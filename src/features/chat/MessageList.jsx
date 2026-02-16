/**
 * 메시지 목록 컴포넌트
 */

import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

export default function MessageList({ messages, isTyping }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white overscroll-contain">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
          <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
            {msg.type === 'text' && (
              <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${msg.sender === 'user' ? 'bg-[#3797f0] text-white rounded-br-sm' : 'bg-gray-100 text-black rounded-bl-sm border border-gray-200'}`}>
                {msg.text || msg.content}
              </div>
            )}
            {msg.type === 'image' && (
              <div className={`rounded-2xl overflow-hidden border border-gray-200 ${msg.sender === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}>
                <img src={msg.content} alt="Shared" className="max-w-[200px] h-auto block" />
              </div>
            )}
            {msg.type === 'audio' && (
              <div className={`px-4 py-3 rounded-2xl flex items-center gap-3 border ${msg.sender === 'user' ? 'bg-[#3797f0] text-white rounded-br-sm' : 'bg-gray-100 text-black rounded-bl-sm'}`}>
                <Play className={`w-5 h-5 fill-current`} />
                <div className="flex gap-1 items-end">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className={`w-0.5 ${i % 2 === 0 ? 'h-4' : 'h-2'} bg-current opacity-50 rounded-full animate-pulse`}></div>
                  ))}
                </div>
                <span className="text-[10px] font-mono">0:01</span>
              </div>
            )}
            <span className="text-[9px] text-gray-400 mt-1 px-1">{msg.time}</span>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-100 px-3 py-2.5 rounded-2xl flex gap-1 items-center rounded-bl-none">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      )}
    </main>
  );
}

