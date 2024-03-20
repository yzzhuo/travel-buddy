import type { NextPage } from 'next';
import Head from 'next/head';
import { useRef, useState } from 'react';
import Header from '../components/Header';
import { useCompletion } from 'ai/react';
import LoadingDots from '../components/LoadingDots';
import { MapIcon } from '@heroicons/react/24/outline';

interface TravelPreference {
  destination: string;
  startDate: string;
  duration: number;
}

export interface PlanResult {
  startDate: string
  duration: string
  city: string
  country: string
  itinerary: Itinerary[]
}

export interface Itinerary {
  date: string
  city: string
  transportation: string
  places_to_visit: PlacesToVisit[]
  things_to_do: string
  accommodation: string
}

export interface PlacesToVisit {
  name: string
  address: string
  transportation: string
  price: string
  brief_intro: string
  tip?: string
}


const Home: NextPage = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const [preferences, setPreferences] = useState<TravelPreference>({
    destination: 'Helsinki',
    startDate: new Date().toISOString().split('T')[0],
    duration: 1,
  });
  const [loading, setLoading] = useState(false);
  const { completion, complete } = useCompletion({
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
    const prompt = `generate a travel plan and itinerary for me baesd on my preferences, only reply a JSON meet the requirements types of resultt .
    my preferences:
    ---
    ${JSON.stringify(preferences)}
    ---
    requirements types of result:
    ---
    export interface Result {
      startDate: string
      duration: string
      city: string
      country: string
      itinerary: Itinerary[]
    }
    export interface Itinerary {
      date: string
      city: string
      transportation: 'driving' | 'walking | 'bicycling'
      places_to_visit: PlacesToVisit[]
      things_to_do: string
      accommodation: string
    }
    export interface PlacesToVisit {
      name: string
      address: string
      price: string
      brief_intro: string
      tip?: string
    }
    ---
    `;
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

  const generateDirectionQuery = (places: any) => {
    let query = `origin=${places[0].name.replace('', '+')}&destination=${places[places.length - 1].name.replace('', '+')}&`;
    if (places.length > 2) {
      query += `waypoints=`;
      // join the middle waypoints with |
      query += places.slice(1, places.length - 1).map((place: any) => place.name.replace('', '+')).join('|');
    }
    return query;
  }

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
              Place
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
          <div className="prose flex flex-col items-center justify-center space-x-3">
            <h1>Trip to {preferences.destination}</h1>
            <div className='flex gap-4 font-bold'>
              <span>Start Date: {data.startDate}</span>
              <span>Duration: {data.duration} day</span>
              <span>Destination: {data.city}, {data.country}</span>
            </div>
          </div>
          <div className='grid grid-cols-12 gap-6 max-w-5xl'>
            <div className="col-span-12">
              <section className='mt-8'>
                <div className="prose">
                  <h2>Itinerary Summary</h2>
                </div>
                <div className="overflow-x-auto mt-4">
                  <table className="table table-fixed border">
                    <thead className='bg-slate-400 text-white'>
                      <tr>
                        <th>Date</th>
                        <th>City</th>
                        <th>Places to Visits</th>
                        <th className='w-40%'>Things to do</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.itinerary.map((item: any, index: number) => (
                        <tr key={index}>
                          <td>{item.date}</td>
                          <td>{item.city}</td>
                          <td>
                            <ul className='list-disc ml-0 pl-0'>
                              {item.places_to_visit.map((place: any, index: number) => (
                                <li key={index}>{place.name}</li>
                              ))}
                            </ul>
                          </td>
                          <td>{item.things_to_do}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
            <div className="prose col-span-12">
              <h2>Itinerary Detail</h2>
            </div>
            {
              data.itinerary.map((item: any, index: number) => (
                <div key={index} className="col-span-12">
                  <section className=''>
                    <div >
                      <div className="prose">
                        <h3>{item.date}</h3>
                        <div className='flex gap-4'>
                          <span>City: {item.city}</span>
                          <div className='flex gap-2'>Transportation: 
                          <select className="select select-sm text-sm py-1" 
                            value={item.transportation}
                            onChange={(e) => {
                              console.log(e.target.value);
                              const newItinerary = data.itinerary.map((it: any, i: number) => {
                                if (i === index) {
                                  it.transportation = e.target.value;
                                }
                                return it;
                              });
                              setData({...data, itinerary: newItinerary});
                            }}
                          >
                              {['driving', 'walking', 'bicycling'].map((transportation, index) => (
                                <option 
                                key={index} 
                                value={transportation} 
                                selected={item.transportation === transportation}
                                >
                                {transportation}
                                </option>
                              ))
                              }
                            </select>
                            {/* {item.transportation} */}
                            </div>
                        </div>
                      </div>
                      <div className="grid mt-4 grid-cols-12 w-full gap-4">
                        <div className="col-span-6">
                        <iframe
                            frameBorder="0"
                            height={750}
                            style={{border:0, width: '100%', height:'600px', maxWidth: '100%'}}
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/directions?key=${apiKey}&${generateDirectionQuery(item.places_to_visit)}&mode=${item.transportation}`}
                            allowFullScreen
                          />
                        </div>
                        <div className='col-span-6'>
                          <div className='prose'>
                            <h4 className='font-bold'>Route</h4>
                            <p>{item.places_to_visit.map((place: any, index: number) => (
                              <span key={index}>{place.name} 
                                {index === item.places_to_visit.length - 1 ? '' : ' → '}
                              </span>
                            ))}</p>
                          </div>
                          <div className="prose mt-4">
                          <h4>Places</h4>
                          <ul className='list-none ml-0 pl-0'>
                            {item.places_to_visit.map((place: any, index: number) => (
                              <li key={index}>
                                <h5 className='font-bold'> 
                                  <span className='bg-primary text-white rounded-full w-6 h-6 inline-flex mr-2 justify-center items-center'>
                                    {index + 1}
                                  </span>
                                  {place.name}
                                  <a href={`https://www.google.com/maps/search/?api=1&query=${item.city},${place.name}`} target="_blank" rel="noreferrer" className="text-primary ml-2">
                                    <MapIcon className="w-4 h-4 inline-block text-geay" />
                                  </a>
                                </h5>
                                {/* <div className='flex gap-4'>
                                  <span>Address: {place.address}</span>
                                  <span>Transportation: {place.transportation}</span>
                                  <span>Price: {place.price}</span>
                                </div> */}
                                <p>{place.brief_intro}</p>
                                {/* <p>Tip: {place.tip}</p> */}
                                {place.tip && <div role="alert" className="alert px-2 py-1 text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                  <span>Tip: {place.tip}</span>
                                </div>
                                }
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      </div>
                    </div>
                  </section>
                </div>
              ))
            }
          </div>
        </div>
        }
      </main>
    </div>
  );
};

export default Home;
