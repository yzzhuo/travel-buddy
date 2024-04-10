import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { nanoid } from "ai";
import Markdown from "react-markdown";
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function submitUserMessage(content: string) {
  'use server';
 
  const aiState = getMutableAIState<typeof AI>();
 
  // Update the AI state with the new user message.
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content,
      }
    ]
  })

 
  // The `render()` creates a generated, streamable UI.
  const ui = render({
    model: 'gpt-3.5-turbo',
    provider: openai,
    messages: [
      {
        role: 'system',
        content: `\
You are a travel assistant bot and you can help users plan a trip, step by step.
You and the user can discuss a trip destination based on their preference, in the UI.
`
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call).
    // Its content is streamed from the LLM, so this function will be called
    // multiple times with `content` being incremental.
    text: ({ content, done }) => {
      // When it's the final content, mark the state as done and ready for the client to access.
      console.log('content', content)
      if (done) {
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      }
      return (<div className="border rounded-lg flex p-4 bg-blue-100 mr-8">
        <div>
          <Markdown>{content}</Markdown>
        </div>
      </div>)
    },
  })
 
  return {
    id: Date.now(),
    display: ui
  };
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]
 
// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
});