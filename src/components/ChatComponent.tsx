"use client"
import React from 'react'
import { useChat } from "ai/react";
import { Send } from "lucide-react";
import MessageList from './MessageList';

type Props = {
  chatId : number
}

const ChatComponent = ({ chatId } : Props) => {
    
    const {input, handleInputChange, handleSubmit, messages}=useChat({
        api:'/api/chat',
        body:{
          chatId
        },
        
    })
    React.useEffect(() => {
      const messageContainer = document.getElementById("message-container");
      if (messageContainer) {
        messageContainer.scrollTo({
          top: messageContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    }, [messages]);

  return (
    <div className='relative max-h-screen overflow-y-scroll' id='message-container'>
        <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
        </div>

        <MessageList messages={messages} />
        <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex">
          <input
             value={input}
             onChange={handleInputChange}
             placeholder="Ask any question..."
             className="w-full"
          />
          <button className="flex items-center bg-emerald-400 text-white hover:bg-emerald-600 px-4 py-2 rounded  ml-2">
            <Send className="h-4 w-4" />
          </button>
        </div>
        </form>
    </div>
  )
}

export default ChatComponent