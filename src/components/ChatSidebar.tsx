"use client";
import React from 'react'
import { DrizzleChat } from '@/lib/db/schema';
import Link from 'next/link';
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from '@/lib/utils';
import axios from "axios";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSidebar = ( { chats, chatId }: Props)=> {
  const [loading, setLoading] = React.useState(false);
  
  return (
    <div className="w-full min-h-screen max-h-screen overflow-y-scroll soff p-4 text-gray-200 bg-gray-900">
        <Link href='/'>
            <button className="flex items-center bg-neutral-900 text-white hover:bg-neutral-800 px-4 py-2 rounded w-full border-dashed border-white border">
            <PlusCircle className="mr-2 w-4 h-4" />
            New Chat</button>
        </Link>
        <div className="flex min-h-screen max-h-screen  pb-20 flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfname}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className='absolute bottom-4 left-4'>
        <div className='flex items-center gap-2 text-sm text-slate-500 flex-wrap'>
        <Link href='/'>Home</Link>
        <Link href='/'>Source</Link>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar