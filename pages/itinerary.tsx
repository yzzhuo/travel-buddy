import type { NextPage } from 'next';
import Head from 'next/head';
import { useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

interface Preference {
  destination: string;
  startDate: string;
  duration: number;
}
const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [preference, setPrefence] = useState<Preference>({
    destination: '',
    startDate: '',
    duration: 0,
  });
  const [generatedBios, setGeneratedBios] = useState<String>('');
  const [isGPT, setIsGPT] = useState(false);
  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const prompt = `Generate 3 twitter biographies with no hashtags and clearly labeled "1.", "2.", and "3.". Only return these 3 twitter bios, nothing else.`;

  console.log({ prompt });
  console.log({ generatedBios });

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios('');
    setLoading(true);
    const response = await fetch(isGPT ? '/api/openai' : '/api/mistral', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const onParseGPT = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === 'event') {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? '';
          setGeneratedBios((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    const onParseMistral = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === 'event') {
        const data = event.data;
        try {
          const text = JSON.parse(data).choices[0].text ?? '';
          setGeneratedBios((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    const onParse = isGPT ? onParseGPT : onParseMistral;

    // https://web.dev/streams/#the-getreader-and-read-methods
    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
    scrollToBios();
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>tourbuddy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Welcome to TourBuddy
        </h1>
        <p className='mt-4'>
          Just a couple of questions and we'll generate your travel plan in less than two minutes.
        </p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-bold">
              Destination
              <span className="text-slate-500">(city)</span>
            </p>
          </div>
          <input
            value={preference.destination}
            onChange={(e) => 
              setPrefence((prev) => ({ ...prev, destination: e.target.value }))
            }
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={'e.g. Helsinki'}
          />
          <div className="flex items-center space-x-3">
            <p className="text-left font-medium">Start Date</p>
          </div>
          <div className="block">
            <input
              value={preference.startDate}
              onChange={(e) => 
                setPrefence((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
              placeholder={'2024-12-31'}
            />
          </div>

          <div className="flex items-center space-x-3">
            <p className="text-left font-medium">Duration</p>
          </div>
          <div className="block">
            <input type={'number'} value={preference.duration} onChange={(day) => setPrefence({
              ...preference,
              duration: parseInt(day.target.value)
            })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5" 
            placeholder={'5'} />
          </div>
          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generate your plan
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={bioRef}
                >
                  Your generated bios
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedBios
                  .substring(generatedBios.indexOf('1') + 3)
                  .split(/2\.|3\./)
                  .map((generatedBio) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio);
                          toast('Bio copied to clipboard', {
                            icon: '✂️',
                          });
                        }}
                        key={generatedBio}
                      >
                        <p>{generatedBio}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
