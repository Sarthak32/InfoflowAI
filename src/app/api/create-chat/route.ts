import { db } from "@/lib/db";
import { loadfileIntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";
import { chats } from "@/lib/db/schema";
import { getfileurl } from "@/lib/firebase-server"; 
import { auth } from '@clerk/nextjs';
import { error } from "console";


export async function POST(req: Request, res: Response) {
  const { userId } : { userId: string | null } = auth();
  if(!userId){
    return NextResponse.json({error: "unauthorized"},{status:401})
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log("userId:", userId);
    
    console.log("Length of file_key:", file_key.length);
    console.log("Length of file_name:", file_name.length);
    const pdfUrlPromise = getfileurl(file_key);
    const pdfUrl = await pdfUrlPromise;

    // Add console.log and try-catch around the database insertion
    console.log("Before inserting into the database");
    const chat_id = await db.insert(chats).values({
      fileKey: file_key,
      pdfname: file_name,
      pdfUrl: pdfUrl,
      userId,
    }).returning({ insertedId: chats.id });
    console.log("After inserting into the database. chat_id:", chat_id);

    return NextResponse.json( {
      chat_id: chat_id[0].insertedId,
    },
    { status: 200 })
  } catch (error) {
    console.error("Error in POST function:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
