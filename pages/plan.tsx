import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { LoadingCircle, SendIcon } from '../components/icons';
import {ChevronRightIcon, ChevronDownIcon} from '@heroicons/react/24/outline'
import Markdown from 'react-markdown'
import { useCompletion } from 'ai/react';
import { Disclosure } from '@headlessui/react'

interface Preference {
  destination: string;
  travelDate: string;
  tripLength: string;
  landmarks: string;
  activities: string;
  dietary: string;
}

const plan = `
根据您提供的信息，我为您创建了赴赫尔辛基的旅行计划：

### 赴赫尔辛基旅行计划

- **目的地**: 赫尔辛基
- **出行日期**: 2024年3月20日
- **行程长度**: 2天

#### 活动安排：
- **滑雪**: 在赫尔辛基附近的滑雪场享受滑雪运动。

#### 餐饮安排：
- 暂无特殊饮食要求。

#### 地标参观：
- 无需参观地标。

#### 注意事项：
- 请提前安排好滑雪装备，并确保了解当地天气状况，以便做好准备。

祝您在赫尔辛基度过愉快的时光！
`;

const dialogues = [
 {
    question: 'What is your destination?',
    id: 'destination',
    tips: [{
      text: 'Not sure which destination to go to? Need some recommendations?',
      prompt: 'please recommend some cities of Europe with brief reason for my recent travel?(city be bolded)'
    }]
 },
 {
    question: 'When do you plan to travel?',
    id: 'travelDate',
    tips:[{
      text: 'Want to know the best time to travel to your destination?'
    }, {
      text: 'Want a weather overview of your destination?'
    }]
 },
 {
    question: 'How long will your trip be?',
    id: 'tripLength',
    tips: [{
      text: 'Suggested duration to visit the destination?',
    }]
 },
 {
    question: 'What type of activities do you enjoy?',
    id: 'activities',
    tips: [{
      text: 'Want to know the main local travelling activities?'
    }]
 },
 {
  question: 'Do you have any specific landmarks or attractions you would like to visit?',
  id: 'places',
  tips:[{
    text: 'What are the main local attractions?'
  }]
},
 {
    question: 'Do you have any dietary requirements or restrictions?',
    id: 'dietary',
    tips: [
      {
        text: 'What are the local food specialties?'
      },
      {
        text: 'Local restaurant price ranges and options?'
      }
    ]
 },
 {
  id: 'transportation',
  question: 'How do you plan to travel to your destination?',
  tips: [
    {
      text: 'What are the main transportation options?'
    },
  ]
 }, {
  id: 'accommodation',
  question: 'Where do you plan to stay during your trip?',
  tips: [
    {
      text: 'What are the main accommodation options?'
    },
    {
      text: 'What are the main local hotels and their price ranges?'
    },
    {
      text: 'Want to know the best area to stay in?'
    },
  ]
 },
 {
  id: 'other',
  question: 'Any other preferences or requirements?',
  tips: [{
    text: 'currency exchange rate?'
  }, {
    text: 'local language and phrases?'
  }]
}
]

interface UITip {
  value: string;
  open: boolean;
}

const Home: NextPage = () => {
  const { completion, complete } =
  useCompletion({
    api: '/api/completion',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [inputText, setInputText] = useState('');
  const [preference, setPreference] = useState<Preference>({
    destination: '',
    travelDate: '',
    tripLength: '',
    landmarks: '',
    activities: '',
    dietary: '',
  });
  const [planResult, setPlanResult] = useState('');
  const [tipResult, setTipResult] = useState<UITip[]>([])
  const [currentTipAnswer, setCurrentTipAnswer] = useState('');
  useEffect(() => {
    const currentTips = dialogues[step].tips.map((tip) => {
      return {
        value: '',
        open: false
      }
    });
    setTipResult(currentTips)
  },
  [step])

  useEffect(() => {
    if (completion) {
      const updatedTipResult = tipResult.map((tip, index) => {
        if (tip.open) {
          return {
            ...tip,
            value: completion
          }
        }
        return tip;
      })
      setTipResult(updatedTipResult);
    }
  }, [completion])

  const handleNext = (e: any) => {
    if (!inputText) return;
    const updatedPreference = {
        ...preference,
        [dialogues[step].id]: inputText,
    }
    setPreference(updatedPreference);
    console.log({ preference });
    setInputText('');
    if (step === dialogues.length - 1) {
      setLoading(true);
      setTimeout(() => {
        setPlanResult(plan);
        setLoading(false);
      }, 1000);
      return;
    } else {
      setStep(step + 1);
    }
  };

  const generateAnswer = async (tipIndex: number) => {
    setLoading(true);
    const prompt = `${dialogues[step].tips[tipIndex].prompt}`;
    console.log({ prompt });
    const response = await complete(`${prompt}, anwser the question directly in markdown format.`);
    console.log({ response });
    setLoading(false);
  };

  const handlClickTip = (index: number) => {
    const isOpen = tipResult[index].open;
    if (!isOpen && !tipResult[index].value) {
      generateAnswer(index);
    }
    const newTipResult = tipResult.map((tip, i) => {
      if (i === index) {
        return {
          ...tip,
          open: !tip.open
        }
      }
      return tip;
    })
    setTipResult(newTipResult);
  }

  const renderStep = () => {
      return <>
        <div className="flex-col justify-start items-start space-x-3">
          <p className="text-left font-medium">
            <span
              className="font-semibold text-white w-6 h-6 inline-flex justify-center rounded-full bg-black mr-1"
            >{step + 1}</span>
            {dialogues[step].question}
            {/* <span className="text-slate-500">(city)</span> */}
          </p>
          <div className='flex flex-col mt-4 gap-2'>
          {
            dialogues[step].tips && dialogues[step].tips.length > 0 ? 
              dialogues[step].tips.map((tip, index) => {
                return  <button
                className="rounded-md border border-gray-200 bg-white text-left text-sm text-gray-500 transition-all duration-75 hover:gray-800 active:bg-gray-50"
                onClick={(e) => {
                  handlClickTip(index)
                }}
              >
                <div className='flex gap-2 items-center bg-blue-100	'>
                  <span className='font-bold text-blue-800 px-4 py-2'>{tip.text}</span>
                  { tipResult[index] && tipResult[index].open ?
                  <ChevronDownIcon className="h-4 w-4 text-blue-800" /> : <ChevronRightIcon className="h-4 w-4 text-blue-800" />}
                </div>
                { tipResult[index] && tipResult[index].open && <Markdown className='text-sm py-4 p-4'>
                  {tipResult[index].value ? tipResult[index].value : 'loading...'}
                </Markdown> }
              </button>
              })
             : null
          }
          </div>
        </div>
      </>
  }

  const renderPlan = () => {

    return <div className='text-left'>
      <Markdown>{planResult}</Markdown>
    </div>
  }

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Twitter Bio Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center  text-center px-4 ">
      <div className="border-gray-200sm:mx-0 mx-5 mt-5 max-w-screen-md rounded-md border sm:w-full">
          <div className="flex flex-col space-y-4 p-7 sm:p-10 items-center">
            <Image
              src="/tourbuddy.jpeg"
              alt="tourbuddy"
              width={40}
              height={40}
              className="h-20 w-20"
            />
            <h1 className="text-lg font-semibold text-black">
              Hi, I'm Tourbuddy!
            </h1>
            <p className="text-gray-500">
              I'm an AI bot help you to make your personalized travel plan
            </p>
          </div>
          <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
            {/* {renderStep()}
             */}
             {
              planResult ? renderPlan() : renderStep()
             }
          </div>
          
        </div>
        
        <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        {!planResult ? <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext(e);
          }}
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
            <button className='absolute inset-y-0 right-3 top-1 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all'
              // onClick={handleNext}  
            >
              {loading ? (
                  <LoadingCircle />
                ) : (
                  <SendIcon
                    className="h-4 w-4 text-gray-300"
                  />
                )}
            </button>
        </form> : null}
        <p className="text-center text-xs text-gray-400">
          Built with{" "}
          <a
            href="https://sdk.vercel.ai/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            Vercel AI SDK
          </a>
          ,{" "}
          <a
            href="https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            OpenAI GPT-3.5-turbo, and fine-tuned
          </a>{" "}
          on Shakespeare's literary works .{" "}
          <a
            href="https://github.com/steven-tey/shooketh"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            View the repo
          </a>{" "}
          or{" "}
          <a
            href="https://vercel.com/templates/next.js/shooketh"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            deploy your own
          </a>
          .
        </p>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
