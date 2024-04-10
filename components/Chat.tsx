'use client';

import { useState } from 'react';
import { useUIState, useActions } from "ai/rsc";
import { SendIcon } from '../components/icons';
import { PlanStep } from '@/lib/types';
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'ai';
import Image from 'next/image';

export default function Chat({ step }: { step: PlanStep }) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions()

  const renderUserMessage = (message: string) => {
    return (
      <div className="border rounded-lg bg-slate-200 p-4 ml-8 flex justify-end">
        {message}
      </div>
    )

  }

  const renderTips = () => {
    return (
      <div className='my-4 flex justify-end'>
        {step?.tips?.map(tip => (
          <button key={tip.text} className='btn'
            onClick={() => {
              handleSubmitMessage(tip.message)
            }}
          >
            {tip.text}
          </button>
        ))}
      </div>
    )
  }

  const handleSubmitMessage = async (input: string) => {
    // Add user message to UI state
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: renderUserMessage(input),
      },
    ]);

    // Submit and get response message
    const responseMessage = await submitUserMessage(input);
    setMessages((currentMessages) => [
      ...currentMessages,
      responseMessage,
    ]);
  }
  return (
    <div className="reletive flex flex-col w-full mx-auto overflow-auto stretch " style={{height: '87vh'}}>
      <div className="flex items-center bg-white border-gray-200 border-b-2 py-2">
        <Image
          src="/avatar.png"
          alt="tourbuddy"
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <h1 className="text-md font-semibold text-black">
         Tourbuddy - Your travel planer
        </h1>
      </div>
      <div className='flex-auto flex flex-col gap-4 overflow-auto py-2 px-2'>
        {messages.map(message => (
          <div key={message.id}>
            {message.display}
          </div>
        ))}
      {renderTips()}
      </div>
      <form 
        onSubmit={async (e) => {
          e.preventDefault();
          handleSubmitMessage(inputValue);
          setInputValue('');
        }}
        className="w-full relative max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <input
           value={inputValue}
           onChange={(event) => {
             setInputValue(event.target.value)
           }}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
            <button className='absolute inset-y-0 right-3 top-1 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all'
            >
              <SendIcon
                className="h-4 w-4 text-gray-300"
              />
            </button>
        </form> 
    </div>
  );
}