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
import remarkGfm from 'remark-gfm'

interface Preference {
  destination: string;
  travelDate: string;
  tripLength: string;
  landmarks: string;
  activities: string;
  dietary: string;
}

const language = 'Chinese';
const plan = ``;

const dialogues = [
 {
    question: 'What is your destination?',
    id: 'destination',
    tips: [{
      text: 'Not sure which destination to go to? Need some recommendations?',
      prompt: (preference: Preference) => 'please recommend some cities of Europe with brief reason for my recent travel?(city be bolded)'
    }]
 },
 {
    question: 'When do you plan to travel?',
    id: 'travelDate',
    tips:[{
      text: 'Want to know the best time to travel to your destination?',
      prompt: (preference: Preference) =>`what is the best time to visit ${preference.destination}?`
    }, {
      text: 'Want a weather overview of your destination?',
      prompt: (preference: Preference) => `Give me the weather overview of ${preference.destination}?`
    }]
 },
 {
    question: 'How long will your trip be?',
    id: 'tripLength',
    tips: [{
      text: 'Suggested duration to visit the destination?',
      prompt: (preference: Preference) => `what is the suggested duration to visit ${preference.destination}?`
    }]
 },
 {
    question: 'What type of activities do you enjoy?',
    id: 'activities',
    tips: [{
      text: 'Want to know the main local travelling activities?',
      prompt: (preference: Preference) => `What are the main local activities in ${preference.destination}?`
    }]
 },
 {
  question: 'Do you have any specific landmarks or attractions you would like to visit?',
  id: 'places',
  tips:[{
    text: 'What are the main local attractions?',
    prompt: (preference: Preference) => `What are the main local attractions in ${preference.destination}?`
  }]
},
 {
    question: 'Do you have any dietary requirements or restrictions?',
    id: 'dietary',
    tips: [
      {
        text: 'What are the local food specialties?',
        prompt: (preference: Preference) => `What are the local food specialties in ${preference.destination}?`
      },
      {
        text: 'Local restaurant price ranges and options?',
        prompt: (preference: Preference) => `What are the local restaurant price ranges and options in ${preference.destination}?`
      }
    ]
 },
 {
  id: 'transportation',
  question: 'How do you plan to travel to your destination?',
  tips: [
    {
      text: 'What are the main transportation options?',
      prompt: (preference: Preference) => `What are the main transportation options to ${preference.destination}?`
    },
  ]
 }, {
  id: 'accommodation',
  question: 'Where do you plan to stay during your trip?',
  tips: [
    {
      text: 'What are the main accommodation options?',
      prompt: (preference: Preference) => `What are the main accommodation options in ${preference.destination}?`
    },
    {
      text: 'What are the main local hotels and their price ranges?',
      prompt: (preference: Preference) => `What are the main local hotels and their price ranges in ${preference.destination}?`
    },
    {
      text: 'Want to know the best area to stay in?',
      prompt: (preference: Preference) => `What is the best area to stay in ${preference.destination}?`
    },
  ]
 },
 {
  id: 'other',
  question: 'Any other preferences or requirements?',
  tips: [{
    text: 'currency exchange rate?',
    prompt: (preference: Preference) => `What is the currency exchange rate in ${preference.destination}?`
  }, {
    text: 'local language?',
    prompt: (preference: Preference) => `What are the local language in ${preference.destination}?`
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
  const [planResult, setPlanResult] = useState(plan);
  const [tipResult, setTipResult] = useState<UITip[]>([])
  const [finishedInput, setFinishedInput] = useState(false);
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
      if (finishedInput) {
        setPlanResult(completion);
      } else {
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
      generatePlan();
      setFinishedInput(true);
    } else {
      setStep(step + 1);
    }
  };

  const generateAnswer = async (tipIndex: number) => {
    setLoading(true);
    const prompt = `${dialogues[step].tips[tipIndex].prompt(preference)}`;
    console.log({ prompt });
    const response = await complete(`${prompt}, anwser the question directly in markdown format and content should be in ${language}.`);
    console.log({ response });
    setLoading(false);
  };

  const generatePlan = async () => {
    setLoading(true);
    const prompt = `generate a travel plan and itinerary for me baesd on my preferences and requirements, content should be in ${language}.
    my preferences:
    ${JSON.stringify(preference)}
    ---
    the requirement of the travel plan:
    1.Title
    {startDate} | {duration} | {amount of country} {amount of city}
    2.table for Itinerary summary include fields:
    - Date 
    - City
    - Transportation 
    - Places to visit
    - Things to do
    - accommodation
    3.Itinerary detail of each day includes:
    - Date
    - Route
    - Landmarks and activities of each day(each place should contains address, transportation, price, brief introduction and tip and image of the place)
    4. todo list for thing to do before travel (like booking hotel etc.)
    5. packing list
    `;
    console.log({ prompt });
    const response = await complete(`${prompt}, anwser the question directly in markdown format.`);
    console.log({ response });
    setLoading(false);
  }

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
      return {
        ...tip,
        open: false
      };
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
      <Markdown remarkPlugins={[remarkGfm]}>{planResult}</Markdown>
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
             {
              finishedInput ? renderPlan() : renderStep()
             }
               <div className="flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        {!finishedInput ? <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext(e);
          }}
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white "
        >
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full rounded-md border-gray-300  focus:border-black focus:ring-black"
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
      </div>
          </div>
          
        </div>
        
      
      </main>
      <Footer />
    </div>
  );
};

export default Home;
