import type { NextPage } from 'next';
import Head from 'next/head';
import { useRef, useState } from 'react';
import Header from '../components/Header';
import { useCompletion } from 'ai/react';
import LoadingDots from '../components/LoadingDots';
import { MapIcon } from '@heroicons/react/24/outline';
import TravelPlanReport, { PlanResult, TravelPreference, generatePromptForTravelPlan } from '../components/TravelPlanReport';


const Home: NextPage = () => {
  const [preferences, setPreferences] = useState<TravelPreference>({
    destination: 'Helsinki',
    startDate: new Date().toISOString().split('T')[0],
    duration: 1,
  });
  const [loading, setLoading] = useState(false);
  const { complete } = useCompletion({
    api: '/api/completion',
  });
  const [data, setData] = useState<PlanResult>({
    startDate: '',
    duration: '',
    city: '',
    country: '',
    itinerary: [],
  });
  const [finished, setFinished] = useState(false);

  const generatePlan = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    console.log({ preferences });
    const prompt = generatePromptForTravelPlan(preferences);
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
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Place explore</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="w-screen h-screen">
        {!finished ? <form className="flex flex-col items-center justify-center w-full ">
          <h1 className="text-3xl font-bold my-4 pt-4">Where do you want to go?</h1>
          <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-bold">
              Desination
              <span className="text-slate-500">(City or Country)</span>
            </p>
          </div>
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
          <div className='w-full grid grid-cols-2 gap-2'>
            <div className="col-span-1">
              <p className="text-left font-bold">
                Start date
              </p>
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
            </div>
            <div className="col-span-1">
              <p className="text-left font-bold">
                Duration
                <span className="text-slate-500"> (Days)</span>
              </p>
              <input
                type="number"
                placeholder="days"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
                value={preferences?.duration}
                onChange={(e) => 
                  setPreferences({
                    ...preferences,
                    duration: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className='w-full flex flex-col'>
              <p className="text-left font-bold">
                Interests
              <span className="text-slate-500"> (Optional)</span>
              </p>
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
          </div>
          <div className='w-full flex flex-col'>
              <p className="text-left font-bold">
                Dietary preference
                <span className="text-slate-500"> (Optional)</span>
              </p>
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
          </div>
          {loading ? <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>: <button
            className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
            onClick={generatePlan}
            >
             Generate
          </button>
        }
        </div>
        </form> :
        <div className='flex flex-col justify-center items-center my-4'>
          <div className='flex justify-end max-w-5xl w-full'>
            <button
             className='btn btn-sm text-white btn-neutral'
             onClick={generatePlan}
            >{
              loading ? <LoadingDots color="white" style="small" /> : 'Regenerate'
            }</button>
          </div>
          <TravelPlanReport 
            data={data} 
            onChangeData={setData}
          />
        </div>
        }
      </main>
    </div>
  );
};

export default Home;
