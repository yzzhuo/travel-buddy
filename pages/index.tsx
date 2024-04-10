import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { LoadingCircle, SendIcon } from '../components/icons';
import {ChevronRightIcon, ChevronDownIcon} from '@heroicons/react/24/outline'
import Markdown from 'react-markdown'
import { useCompletion } from 'ai/react';
import TravelPlanReport, { PlanResult, TravelPreference, generatePromptForTravelPlan } from '../components/TravelPlanReport';
import LoadingDots from '../components/LoadingDots';

const dialogues = [
 {
    question: 'What is your destination?',
    id: 'destination',
    tips: [{
      text: 'Not sure which destination to go to? Need some recommendations?',
      prompt: (preference: TravelPreference) => 'please recommend some cities of Europe with brief reason for my recent travel?(city be bolded)'
    }]
 },
 {
    question: 'When do you plan to travel?',
    id: 'travelDate',
    tips:[{
      text: 'Want to know the best time to travel to your destination?',
      prompt: (preference: TravelPreference) =>`what is the best time to visit ${preference.destination}?`
    }, {
      text: 'Want a weather overview of your destination?',
      prompt: (preference: TravelPreference) => `Give me the weather overview of ${preference.destination}?`
    }]
 },
 {
    question: 'How long will your trip be?',
    id: 'tripLength',
    tips: [{
      text: 'Suggested duration to visit the destination?',
      prompt: (preference: TravelPreference) => `what is the suggested duration to visit ${preference.destination}?`
    }]
 },
 {
  question: 'Do you have any interested specific landmarks or activities?',
  id: 'interests',
  tips:[{
    text: 'What are the main local attractions, list the must-try local specialties?',
    prompt: (preference: TravelPreference) => `What are the main local attractions in ${preference.destination}?`
  }, {
      text: 'Want to know the main local travelling activities?',
      prompt: (preference: TravelPreference) => `What are the main local activities in ${preference.destination}, give me some options I could select with bold text?`
    }
  ]
 },
 {
    question: 'Do you have any dietary restrictions or do you have local food you want to try?',
    id: 'dietary',
    tips: [
      {
        text: 'What are the local food specialties?',
        prompt: (preference: TravelPreference) => `What are the local food specialties in ${preference.destination}?`
      },
      {
        text: 'Local restaurant price ranges and options?',
        prompt: (preference: TravelPreference) => `What are the local restaurant price ranges and options in ${preference.destination}?`
      }
    ]
 },
//  {
//   id: 'other',
//   question: 'Any other preferences or tips you would like to know?',
//   tips: [{
//     text: 'currency exchange rate?',
//     prompt: (preference: TravelPreference) => `What is the currency exchange rate in ${preference.destination}?`
//   }, {
//     text: 'local language?',
//     prompt: (preference: TravelPreference) => `What are the local language in ${preference.destination}?`
//   }]
// }
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
  const [preference, setPreference] = useState<TravelPreference>({
    destination: '',
    startDate: '',
    duration: 1,
    places: '',
    activities: '',
    dietary: '',
  });
  const [data, setData] = useState<PlanResult>(
    {
    startDate: '',
    duration: '',
    city: '',
    country: '',
    itinerary: [],
  }
  );
  const [tipResult, setTipResult] = useState<UITip[]>([])
  const [finishedInput, setFinishedInput] = useState(false);
  const [finished, setFinished] = useState(false);

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
        return;
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
    const response = await complete(`${prompt}, anwser the question directly with content that are easy to read and clearly structured markdown format(for example use title/bold/list smartly).`);
    console.log({ response });
    setLoading(false);
  };

  const generatePlan = async () => {
    setLoading(true);
    const prompt = generatePromptForTravelPlan(preference);
    console.log({ prompt });
    const response = await complete(prompt);
    console.log({ response });
    console.log({ prompt });
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await complete(prompt);
        console.log({ response });
        const result = JSON.parse(response as string);
        console.log({ result });
        setData(result);
        setFinished(true);
        break; // If successful, break the loop
      } catch (error) {
        console.error(error);
        // If it's the last iteration, rethrow the error
        if (i === maxRetries - 1) throw error;
      }
    }
    setLoading(false);
  }

  const handlClickTip = (index: number) => {
    const isOpen = tipResult[index].open;
    // if (!isOpen && !tipResult[index].value) {
      if (!isOpen) {
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
          <p className="text-left font-medium flex-auto">
            <span
              className="font-semibold text-white w-6 h-6 inline-flex justify-center rounded-full bg-black mr-1"
            >{step + 1}</span>
            {dialogues[step].question}
            {/* <span className="text-slate-500">(city)</span> */}
          </p>
          <div className='flex flex-col mt-4 gap-2 mb-16'>
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
                { tipResult[index] && tipResult[index].open && <Markdown className='text-sm py-4 p-4 max-h-36 overflow-y-auto'>
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
      {/* <Markdown remarkPlugins={[remarkGfm]}>{planResult}</Markdown> */}
      <TravelPlanReport 
        data={data} 
        preferences={preference}
        onChangeData={setData}
        />
    </div>
  }
  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Travel Plan Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center  text-center px-4 ">
      {finished ? renderPlan() :<> <div className="border-gray-200sm:mx-0 mx-5 mt-5 max-w-screen-md rounded-md border sm:w-full">
          <div className="flex flex-col md:space-y-4 p-7 sm:p-10 items-center bg-white shadow-lg">
            <Image
              src="/avatar.png"
              alt="tourbuddy"
              width={40}
              height={40}
              className="h-12 w-14 md:h-18 md:w-20"
            />
            <h1 className="text-lg font-semibold text-black">
              Hi, I'm Tourbuddy!
            </h1>
            <p className="text-gray-500 sm:block hidden">
              I'm an AI bot help you to make your personalized travel plan
            </p>
          </div>
          <div className='w-full relative h-1 bg-gray-50'>
            <div className={`absolute h-1 bg-orange-500`} style={{
              width: `${(step + 1) * 100 / dialogues.length}%`
            }}></div>
          </div>
          <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-4 sm:p-10">
         
             {  finishedInput ? 
             <div className='flex flex-col justify-center items-center gap-2'>
              <LoadingDots color="black" style="large" />
               Generating, Please wait a moment
             </div>
            :
             renderStep()}
          </div>
        </div>
        <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        {!finishedInput ? <form
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
            >
              {loading ? (
                  <LoadingCircle />
                ) : (
                  <SendIcon
                    className="h-4 w-4 text-gray-300"
                  />
                )}
            </button>
        </form>  : null}
      </div>
      </>
      } 
      </main>
    </div>
  );
};

export default Home;
