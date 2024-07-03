"use client"
import React from 'react'
import {useDropzone} from "react-dropzone"
import { Inbox, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useMutation } from '@tanstack/react-query';
import { useRouter } from "next/navigation";
import { storage } from '@/lib/firebase';
import {ref,uploadBytes} from 'firebase/storage';
import axios from 'axios';



const Fileupload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  
  const { mutate, isLoading } = useMutation({
    mutationFn : async({
      file_key,file_name
    }: {
      file_key: string;
      file_name: string;
    }) =>{
      const response = await axios.post("/api/create-chat",{
        file_key,
        file_name,
      });
      return response.data
    }
    
  })
  
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {"application/pdf" : [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) =>{
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10MB!
        toast.error("file is larger than 10MB")
        return;
      }
      try {
        setUploading(true);
  
        // Generate a unique filename using the current timestamp
        const timestamp = new Date().getTime();
        
        const sanitizedFileName = file.name.replace(/ /g, "-");
        const file_key = `uploads/${timestamp}_${sanitizedFileName}`;

        const file_name = `${timestamp}_${sanitizedFileName}`;
        const storageRef = ref(storage, `uploads/${file_name}`);
        await uploadBytes(storageRef, file);

        // Use the same format for generating file_key during upload and download
        

        const data = {file_key,file_name}

        if (!data.file_key || !data.file_name){
          toast.error("Something went Wrong !")
          return
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error("Error in Creating Chat")
          },
        });
        console.log(data);
        
        console.log("File uploaded successfully");
        
        return data

      } catch (error) {
        console.log("Error uploading file", error);
      } finally {
        setUploading(false);
      }
    }
      
      
  })
  return (
    <div className='p-2 bg-white rounded-xl'>
      <div {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}>
        <input {...getInputProps()}/>
        {uploading || isLoading ? (
          <>
          {/* {loading state} */}
          <Loader2 className='h-10 w-10 text-blue-300 animate-spin'/>
          <p className="mt-2 text-sm text-slate-400">
              Loading....
          </p>
          </>)
          :
        <>
        <Inbox className='w-10 h-10 text-blue-300'/>
        <p className='m-2 text-sm text-slate-500'>Upload PDF here</p>
        </>
        }
      </div>

    </div>
  )
}

export default Fileupload