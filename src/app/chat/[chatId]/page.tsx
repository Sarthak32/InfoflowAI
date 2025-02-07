import React from 'react'
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from "@/lib/db";
import { chats } from '@/lib/db/schema';
import { eq } from "drizzle-orm";
import ChatSidebar from '@/components/ChatSidebar';
import PdfViewer from '@/components/PdfViewer';
import ChatComponent from '@/components/ChatComponent';
type Props = {
    params: {
        chatId: string;
      };
}

const ChatPage = async ({ params: { chatId } }: Props) => {
    const { userId } : { userId: string | null } = auth();
  if(!userId){
    return redirect('/sign-in')
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }
  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  
  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="flex w-full min-h-screen overflow-y-scroll">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSidebar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        {/* pdf viewer */}
        <div className="min-h-screen p-4 oveflow-y-scroll flex-[5]">
          <PdfViewer pdf_url={currentChat?.pdfUrl || ""}/>
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
        <ChatComponent chatId={parseInt(chatId)}/>
        </div>
      </div>
    </div>
  );

}

export default ChatPage