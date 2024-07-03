
import Image from 'next/image';
import Link from "next/link";
import { UserButton, auth } from "@clerk/nextjs";
import { LogIn, ArrowRight } from 'lucide-react';
import Fileupload from '../components/Fileupload'

export default async function Home() {

  const { userId } = await auth();
  const isAuth = !!userId;
  const firstChat="";

  return (
    <div className='m-screen min-h-screen bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600'>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="flex mt-2">
            {isAuth && (
              <>
                <Link href={`/chat/`}>
                  <button className='flex items-center bg-neutral-900 text-white hover:bg-neutral-800 px-4 py-2 rounded'>
                    Go to Chats <ArrowRight className="ml-2" />
                  </button>
                </Link>
              </>
            )}
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Join a vast community of students, researchers, and professionals to instantly answer questions and understand research with cutting-edge AI technology.
          </p>

          <div className="w-full mt-4 ">
            {isAuth ? (
              <Fileupload/>
            ) : (
              <Link href="/sign-in" >
                <button className='flex items-center bg-neutral-900 text-white hover:bg-neutral-800 mx-[auto] px-4 py-2 rounded'>
                  <span>Login to get Started!</span>
                  <LogIn className='w-4 h-4 ml-2'/>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
