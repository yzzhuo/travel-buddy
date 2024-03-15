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

interface Preference {
  destination: string;
  startDate: string;
  duration: number;
}
const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [generatedBios, setGeneratedBios] = useState<String>('hhhhhhello');
  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const prompt = `Generate 3 twitter biographies with no hashtags and clearly labeled "1.", "2.", and "3.". Only return these 3 twitter bios, nothing else.`;

  console.log({ prompt });
  console.log({ generatedBios });


  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>tourbuddy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center py-4  px-4 ">
        <div className='grid gap-4 grid-cols-2 '>
          <div className="col-span-1">
            <article className="prose">
              <h4>Helsinki</h4>
              <div className='p-2 border border-base-300 rounded-lg h-80 overflow-hidden'>
                <p className='text-sm m-0 p-0'>
                  For years parents have espoused the health benefits of eating garlic bread with cheese to their
                  children, with the food earning such an iconic status in our culture that kids will often dress
                  up as warm, cheesy loaf for Halloween.
                  But a recent study shows that the celebrated appetizer may be linked to a series of rabies cases
                  springing up around the country.
                </p>
              </div>
            </article>
          </div>

          <div className="col-span-1 ">
            <article className="prose">
              <h4>Weather</h4>
              <div className='grid-rows-2 grid grid-cols-2 gap-2 border border-base-300 p-2 rounded-lg h-180 overflow-hidden'>
                <div className='bg-green-100 rounded-lg p-2'>
                  <h4 className='mt-0'>Spring(March to May)</h4>
                  <p className='text-sm'>
                    Spring marks a period of warming temperatures, though occasional snow showers and cold weather are still possible
                  </p>
                </div>
                <div className='bg-orange-100 rounded-lg p-2'>
                  <h4 className='mt-0'>Spring(March to May)</h4>
                  <p className='text-sm'>
                    Spring marks a period of warming temperatures, though occasional snow showers and cold weather are still possible
                  </p>
                </div>
                <div className='bg-yellow-100 rounded-lg p-2'>
                  <h4 className='mt-0'>Spring(March to May)</h4>
                  <p className='text-sm'>
                    Spring marks a period of warming temperatures, though occasional snow showers and cold weather are still possible
                  </p>
                </div>
                <div className='bg-blue-100 rounded-lg p-2'>
                  <h4 className='mt-0'>Spring(March to May)</h4>
                  <p className='text-sm'>
                    Spring marks a period of warming temperatures, though occasional snow showers and cold weather are still possible
                  </p>
                </div>
               
              </div>
            </article>
          </div>

          <div className="col-span-1 ">
            <article className="prose">
              <h4>Transport</h4>
              <div className='p-2 border border-base-300 rounded-lg h-30 overflow-hidden'>
                <p className='text-sm m-0 p-0'>
                Helsinki has an efficient public transportation system, including buses, trams, metro, and ferries. You can use the same ticket for all modes of transport within the city.
                </p>
                <div className="mt-2">
                  <h4 className='m-0 p-0'>Bus</h4>
                  <p className='text-sm m-0 p-0'>
                  The bus network is extensive and covers the entire city. The buses are modern and comfortable, and the service is reliable. 
                  </p>
                </div>
              </div>
            </article>

            <article className="prose mt-4 ">
              <h4>Food</h4>
              <div className='p-2 border border-base-300 rounded-lg h-60 overflow-hidden'>
                <p className='text-sm m-0 p-0'>
                Helsinki has an efficient public transportation system, including buses, trams, metro, and ferries. You can use the same ticket for all modes of transport within the city.
                </p>
                <div className="mt-2">
                  <h4 className='m-0 p-0'>Traditional Food</h4>
                  <p className='text-sm m-0 p-0'>
                  瑞典风味：赫尔辛基受到瑞典文化的影响，因此您可以品尝到瑞典风格的美食，如瑞典肉丸、鱼子酱和三文鱼等。
                  芬兰传统菜：芬兰有许多独特的传统菜肴，如鲑鱼、鹿肉、驯鹿肉和乌鱼子酱等。此外，黑面包和烟熏三文鱼也是当地的特色美食。
                  海鲜：由于赫尔辛基位于波罗的海边，因此海鲜菜肴是当地的一大特色，包括新鲜的鱼类、贝类和虾类等。
                  </p>
                </div>

                <div className="mt-2">
                  <h4 className='m-0 p-0'>Restaurant Price Range</h4>
                  <p className='text-sm m-0 p-0'>
                  Budget Eateries: You can find budget-friendly meals in some cafés, small restaurants, and fast-food joints in Helsinki. A simple lunch might cost around 10-15 euros.
                  Mid-range Restaurants: These restaurants typically offer a more diverse menu and a more comfortable dining environment, with prices ranging from about 20 to 40 euros per person.
                  Fine Dining Restaurants: Located in the city center or along the waterfront, some upscale restaurants in Helsinki serve exquisite cuisine and provide high-quality service, with prices possibly exceeding 50 euros per person.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="col-span-1  ">
            <article className="prose">
              <h4>Accomodation</h4>
              
              <div className='p-2 border border-base-300 rounded-lg'>
                <div className="mt-2">
                  <h4 className='m-0 p-0'>Price</h4>
                  <p className='text-sm m-0 p-0'>
                  赫尔辛基的住宿价格因季节、地点和住宿类型而异。一般而言，城市中心和主要景点周围的酒店价格较高，而郊区或者市中心外围地区的住宿价格相对较低。
价格区间从经济型青年旅舍或宾馆的每晚20-50欧元，到高档酒店的每晚100-300欧元不等。
                  </p>
                </div>

                <div className="mt-2">
                  <h4 className='m-0 p-0'>Location</h4>
                  <ul className='text-sm m-0 p-0 list-none'>
                   <li>市中心（中心火车站附近）：市中心是赫尔辛基的商业和文化中心，靠近主要景点、购物中心、餐厅和夜生活场所。这里的住宿选择丰富，适合游客。但价格较高。</li>
                    <li>卡莱宁林宫区（Kallio）：位于市中心以北，是一个多元化和具有艺术氛围的区域。这里的住宿价格相对较低，但交通便利，有很多咖啡馆、酒吧和小饭馆。</li>
                    <li>庞塔桥区（Punavuori）：这个区域靠近市中心，有许多时尚的精品店、艺术画廊和设计工作室。这里的住宿价格较高，但您可以享受到独特的购物和文化体验。</li>
                    <li>芬兰湾海滩区（Hietaniemi Beach）：位于市中心以西，是一个安静而风景优美的地区，靠近海滩和公园。这里有一些度假村和海滨酒店，适合寻求放松和休闲的游客。</li>
                  </ul>
                </div>
              </div>
            </article>
          </div>

        </div>
        <div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
