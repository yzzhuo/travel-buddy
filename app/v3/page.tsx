'use client'
 
import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';
import { useCompletion } from 'ai/react';
import TravelPlanReport, {  generatePromptForTravelPlan } from '../../components/TravelPlanReport';
import { PlanResult, PlanStep, TravelPreference } from '@/lib/types';
import Chat from '@/components/Chat';
import LoadingDots from '@/components/LoadingDots';

const planSteps: PlanStep[] = [
  {
     question: 'What is your destination?',
     id: 'destination',
     tips: [{
       text: 'Inspire me where to go',
       message: 'please recommend some cities of Europe with brief reason for my recent travel?'
     }],
     input: (
       preferences: TravelPreference, 
       setPreferences: (preferences: TravelPreference) => void
       ) => {
       return (
         <input
             value={preferences?.destination}
             onChange={(e) => 
               setPreferences({
                 ...preferences,
                 destination: e.target.value,
               })
             }
             className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
             placeholder={'e.g. Helsinki'}
           />
       )
     }
  },
  {
     question: 'When do you plan to travel?',
     id: 'travelDate',
     input: (
       preferences: TravelPreference, 
       setPreferences: (preferences: TravelPreference) => void
       ) => {
       return (
         <input
           type="date"
           placeholder="Start date"
           className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
           value={preferences?.startDate}
           onChange={(e) => 
             setPreferences({
               ...preferences,
               startDate: e.target.value,
             })
           }
         />
       )
     },
     tips:[{
       text: 'Want to know the best time to travel to your destination?',
       message: `what is the best time to vi?`
     }, {
       text: 'Want a weather overview of your destination?',
       message:  `Give me the weather overview?`
     }]
  },
  {
     question: 'How long will your trip be?',
     id: 'tripLength',
     tips: [{
       text: 'Suggested duration to visit the destination?',
       message:  `what is the suggested duration to vi?`
     }],
     input: (
       preferences: TravelPreference, 
       setPreferences: (preferences: TravelPreference) => void
       ) => {
       return (
         <input
           type="number"
           placeholder="days"
           className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
           value={preferences?.duration}
           onChange={(e) => 
             setPreferences({
               ...preferences,
               duration: e.target.value,
             })
           }
         />
       )
     },
  },
  {
   question: 'Do you have any interested specific landmarks or activities?',
   id: 'interests',
   input: (
     preferences: TravelPreference, 
     setPreferences: (preferences: TravelPreference) => void
     ) => {
     return (
       <textarea
       value={preferences?.places}
       onChange={(e) => 
         setPreferences({
           ...preferences,
           interests: e.target.value,
         })
       }
       rows={3}
       className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
       placeholder={'you could tell places you want to visit or activities you want to do'}
     />
     )
   },
   tips:[{
     text: 'What are the main local attractions, list the must-try local specialties?',
     message:  `What are the main local attractions?`
   }, {
       text: 'Want to know the main local travelling activities?',
       message:  `What are the main local activities, give me some options I could select with bold text?`
     }
   ]
  },
  {
     question: 'Do you have any dietary restrictions or do you have local food you want to try?',
     id: 'dietary',
     input: (
       preferences: TravelPreference, 
       setPreferences: (preferences: TravelPreference) => void
       ) => {
       return (
         <textarea
           value={preferences?.dietary}
           onChange={(e) => 
             setPreferences({
               ...preferences,
               dietary: e.target.value,
             })
           }
           rows={2}
           className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
           placeholder={'e.g. I am a vegetarian and I want to try local vegetarian food'}
       />
       )
     },
     tips: [
       {
         text: 'What are the local food specialties?',
         message:  `What are the local food specialties?`
       },
       {
         text: 'Local restaurant price ranges and options?',
         message:  `What are the local restaurant price ranges and options?`
       }
     ]
  },
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
     duration: '',
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
 
   const renderPlanStep = () => {
     if (step === 0) {
       return (
         <div className='flex flex-col justify-center items-center'>
           <h2 className='text-lg font-bold mb-2'>Welcome to Tourbuddy</h2>
           <p className='mb-4'>AI-based tool help you explore a destination and generate an itinerary based on your interest.</p>
           <button className="btn btn-neutral" onClick={() => setStep(1)}>Start</button>
         </div>
       )
     }
       return <>
         <div className="flex-col justify-start items-start space-x-3">
           <p className="text-left font-medium flex-auto">
             <span
               className="font-semibold text-white w-6 h-6 inline-flex justify-center rounded-full bg-black mr-1"
             >{step}</span>
             {planSteps[step - 1].question}
           </p>
           <div>
             {planSteps[step - 1].input(preference, setPreference)}
           </div>
         </div>
       </>
   }
 
   return (
     <div className="flex mx-auto flex-col items-center justify-center py-2 min-h-screen">
       <Head>
         <title>Travel Plan Generator</title>
         <link rel="icon" href="/favicon.ico" />
       </Head>
       <Header />
       <main className="flex w-full px-4 gap-4 flex-1 p-4">
         <div className='w-1/3 bg-white border-solid border-black-50 border-2 p-2 flex hidden'>
           <Chat step={planSteps[step - 1]} />
         </div>
         <div className='bg-white flex-auto p-4 md:p-12 border-2'>
          {!finished && !loading && <div>
             {renderPlanStep()}
           {step > 0 && step < planSteps.length && <div className='w-full flex justify-end gap-2'>
             <button className="btn btn-square btn-sm" onClick={() => {
               setStep(step - 1);
             }}>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
               </svg>
             </button>
             <button className="btn btn-square btn-sm" onClick={() => setStep(step + 1)}>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
               </svg>
             </button>
           </div>
           }
           {
             step === planSteps.length && <div className='w-full flex justify-end'>
                 <button className="btn btn-sm btn-neutral" onClick={generatePlan}>
                   Generate Plan
                 </button>
               </div>
           }
           </div>
          }
          {loading && <div className='flex justify-center items-center flex-col gap-4'>
              <LoadingDots color="black" style="large" />
                Generating, it may take a few minutes...
            </div>}
          {finished &&
            <TravelPlanReport 
              data={data} 
              onChangeData={setData}
              />
          }
         </div>
       </main>
     </div>
   );
 };
 
 export default Home;
 