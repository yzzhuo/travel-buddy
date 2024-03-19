import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import DropDown, { VibeType } from '../components/DropDown';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LoadingDots from '../components/LoadingDots';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';
import Toggle from '../components/Toggle';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');
  const [vibe, setVibe] = useState<VibeType>('Professional');
  const [generatedBios, setGeneratedBios] = useState<String>('');
  const [isGPT, setIsGPT] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const prompt = `Generate 3 ${
    vibe === 'Casual' ? 'relaxed' : vibe === 'Funny' ? 'silly' : 'Professional'
  } twitter biographies with no hashtags and clearly labeled "1.", "2.", and "3.". Only return these 3 twitter bios, nothing else. ${
    vibe === 'Funny' ? 'Make the biographies humerous' : ''
  }Make sure each generated biography is less than 300 characters, has short sentences that are found in Twitter bios, and feel free to use this context as well: ${bio}${
    bio.slice(-1) === '.' ? '' : '.'
  }`;

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

  console.log('process', apiKey)
  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Place explore</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="w-screen h-screen">
      <iframe
        frameBorder="0"
        style={{border:0, width: '100%', maxWidth: '100%'}}
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Eiffel+Tower,Paris+France`}
        allowFullScreen
      >
      </iframe>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
