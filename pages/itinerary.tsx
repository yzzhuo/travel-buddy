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
import Autocomplete from "react-google-autocomplete";
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
const data = {
  "startDate": "April 1, 2024",
  "duration": "3days",
  "city": "Paris",
  "country": "France",
  "destination_image": "https://example.com/paris_image",
  "itinerary": [
    {
      "date": "April 1",
      "city": "Paris",
      "transportation": "Plane",
      "places_to_visit": [
        {
          "name": "Montmartre",
          "address": "Montmartre, Paris",
          "transportation": "Walking",
          "price": "Free",
          "brief_intro": "Montmartre is a historic hilltop neighborhood known for its artistic heritage and stunning views of the city.",
          "tip": "Don't miss the iconic Sacré-Cœur Basilica."
        },
        {
          "name": "Musée d'Orsay",
          "address": "1 Rue de la Légion d'Honneur, 75007 Paris",
          "transportation": "Metro",
          "price": "14€",
          "brief_intro": "Housed in a former railway station, the museum showcases an impressive collection of impressionist and post-impressionist masterpieces.",
          "tip": "Arrive early to avoid crowds."
        },
        {
          "name": "Seine River Cruise",
          "address": "Port de la Bourdonnais, 75007 Paris",
          "transportation": "Boat",
          "price": "15€",
          "brief_intro": "Enjoy a relaxing boat ride along the Seine River, passing by iconic landmarks such as the Eiffel Tower and Notre-Dame Cathedral.",
          "tip": "Opt for an evening cruise to see Paris illuminated at night."
        }
      ],
      "things_to_do": "Explore Montmartre's artistic streets, admire impressionist masterpieces at Musée d'Orsay, enjoy a scenic boat ride along the Seine.",
      "accommodation": "Hotel XYZ (60€)"
    },
    {
      "date": "April 2",
      "city": "Paris",
      "transportation": "Metro",
      "places_to_visit": [
        {
          "name": "Sainte-Chapelle",
          "address": "8 Boulevard du Palais, 75001 Paris",
          "transportation": "Metro",
          "price": "10€",
          "brief_intro": "Sainte-Chapelle is known for its stunning stained glass windows, depicting biblical scenes and stories.",
          "tip": "Visit during sunny days to see the windows at their most vibrant."
        },
        {
          "name": "Canal Saint-Martin",
          "address": "Canal Saint-Martin, Paris",
          "transportation": "Metro",
          "price": "Free",
          "brief_intro": "Stroll along the picturesque canal and explore the trendy shops and cafes along its banks."
        },
        {
          "name": "Le Marais District",
          "address": "Le Marais, Paris",
          "transportation": "Metro",
          "price": "Free",
          "brief_intro": "Explore the historic Le Marais district, known for its narrow streets, historic mansions, and trendy shops and cafes."
        }
      ],
      "things_to_do": "Marvel at the stunning stained glass windows of Sainte-Chapelle, stroll along the picturesque Canal Saint-Martin, explore trendy shops and cafes in Le Marais District.",
      "accommodation": "Hotel XYZ (60€)"
    },
    {
      "date": "April 3",
      "city": "Paris",
      "transportation": "Metro",
      "places_to_visit": [
        {
          "name": "Luxembourg Gardens",
          "address": "75006 Paris",
          "transportation": "Metro",
          "price": "Free",
          "brief_intro": "Relax in the beautiful Luxembourg Gardens, known for its formal gardens, fountains, and statues.",
          "tip": "Visit early in the morning for a peaceful experience."
        },
        {
          "name": "Île de la Cité",
          "address": "Île de la Cité, Paris",
          "transportation": "Metro",
          "price": "Free",
          "brief_intro": "Discover the historic heart of Paris on Île de la Cité, home to iconic landmarks such as Notre-Dame Cathedral and Sainte-Chapelle."
        },
        {
          "name": "Panthéon",
          "address": "Place du Panthéon, 75005 Paris",
          "transportation": "Metro",
          "price": "9€",
          "brief_intro": "Visit the Panthéon, a mausoleum containing the remains of many notable French figures, including Voltaire, Rousseau, and Victor Hugo."
        }
      ],
      "things_to_do": "Relax in the beautiful Luxembourg Gardens, discover the historic heart of Paris on Île de la Cité, visit the Panthéon.",
      "accommodation": "Hotel XYZ (60€)"
    }
  ]
}

interface UITip {
  value: string;
  open: boolean;
}

const Home: NextPage = () => {
  const dialogues = [
    {
       question: 'What is your destination?',
       id: 'destination',
       tips: [{
         text: 'Not sure which destination to go to? Need some recommendations?',
         prompt: (preference: Preference) => 'please recommend some cities of Europe with brief reason for my recent travel?(city be bolded)'
       }],
       option: () => {
        return <Autocomplete
          className='input input-bordered'
          apiKey={apiKey}
          defaultValue={preference.destination}
          onPlaceSelected={(place) => {
            console.log(place);
            setPreference({
              ...preference,
              destination: place.formatted_address
            })
          }}
        />
       }
    },
    {
       question: 'When do you plan to travel?',
       id: 'travelDate',
       option: () => {
          return <input
            type="date"
            className="input input-bordered"
            value={preference.travelDate}
            onChange={(e) => {
              setPreference({
                ...preference,
                travelDate: e.target.value
              })
            }}
          />
        },
       tips:[{
         text: 'Want to know the best time to travel to your destination?',
         prompt: (preference: Preference) =>`what is the best time to visit ${preference.destination}?`
       }, {
         text: 'Want a weather overview of your destination?',
         prompt: (preference: Preference) => `Give me the weather overview of ${preference.destination}?`
       }]
    },
    {
       question: 'How long will your trip be (days)?',
       id: 'tripLength',
       option: () => {
          return <input
            type="number"
            className="input input-bordered input-sm"
            value={preference.tripLength}
            onChange={(e) => {
              setPreference({
                ...preference,
                tripLength: e.target.value
              })
            }}
          />
        },
       tips: [{
         text: 'Suggested duration to visit the destination?',
         prompt: (preference: Preference) => `what is the suggested duration to visit ${preference.destination}?`
       }]
    },
    {
     question: 'Do you have any specific places you would like to visit?',
     id: 'places',
     tips:[{
        text: 'Want to know the main local travelling activities?',
        prompt: (preference: Preference) => `What are the main local activities in ${preference.destination}?`
      },{
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
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
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
    setStep(step + 1);
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
        <div className="flex-col justify-start items-start">
          <h3 className='w-full bg-black text-white px-2 py-2'>Step</h3>
          <p className="text-left font-medium px-4 py-4">
            <span
              className="font-semibold text-white w-6 h-6 inline-flex justify-center rounded-full bg-black mr-1"
            >{step + 1}</span>
            {dialogues[step].question}
            {/* <span className="text-slate-500">(city)</span> */}
          </p>
          <div className='px-8'>
            {dialogues[step]?.option?.()}
          </div>
        </div>
      </>
  }

  const renderTips = () => {
    return <>
      <div className="flex-col justify-start items-start space-x-3">
        <p className="text-left font-medium w-full bg-black px-2 py-2 text-white">
          Tour Guide
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
    <div className="flex mx-auto flex-col items-center  py-2 min-h-screen">
      <Head>
        <title>Twitter Bio Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="grid grid-cols-12 w-full  px-4 ">
        <div className="border-gray-200 border col-span-4">
          {/* <div className="flex space-y-4 p-7 sm:p-10 items-center">
            <span
                className="font-semibold text-white w-6 h-6 inline-flex justify-center rounded-full bg-black mr-1"
              >1</span>
              Destination
          </div> */}
          <div className="">
             {
              finishedInput ? renderPlan() : renderStep()
             }
            <div className="flex gap-2 justify-end px-2 py-4">
              <button className='btn btn-sm' onClick={() => setStep(step - 1)}>Prev</button>
              <button className='btn btn-sm btn-primary' onClick={handleNext}>Next</button>
            </div>
          </div>
          {renderTips()}
        </div>
        <div className="col-span-8 px-4 py-2">
          <div className="prose">
            <h1>My Trip</h1>
            <div className='flex gap-4 font-bold'>
              <span>Start Date: {preference.travelDate}</span>
              <span>Duration: {preference.tripLength} Days</span>
              <span>Destination: {preference.destination}</span>
            </div>
          </div>
          <div className="divider w-full"></div>
          <div className='grid grid-cols-12 gap-6'>
            <div className="col-span-12">
            <section className=''>
              <div className="prose">
                <h2>Itinerary Summary</h2>
              </div>
              <div className="overflow-x-auto mt-4">
                <table className="table table-fixed border border-slate-400">
                  <thead>
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
                          <ul>
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
                          <span>Transportation: {item.transportation}</span>
                        </div>
                      </div>
                      <div className="grid mt-4 grid-cols-12 w-full gap-4">
                        <div className="col-span-6">
                        <iframe
                            frameBorder="0"
                            height={750}
                            style={{border:0, width: '100%', height:'600px', maxWidth: '100%'}}
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=Montmartre
                            &destination=Seine+River+Cruise&waypoints=Musée+d'Orsay`}
                            allowFullScreen
                          />
                        </div>
                        <div className='col-span-6'>
                          <div className='prose'>
                            <h4 className='font-bold'>Route</h4>
                            <p>{item.places_to_visit.map((place: any, index: number) => (
                              <span key={index}>{place.name} → </span>
                            ))}Hotel</p>
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
                                </h5>
                                {/* <div className='flex gap-4'>
                                  <span>Address: {place.address}</span>
                                  <span>Transportation: {place.transportation}</span>
                                  <span>Price: {place.price}</span>
                                </div> */}
                                <p>{place.brief_intro}</p>
                                {/* <p>Tip: {place.tip}</p> */}
                                {place.tip && <div role="alert" className="alert px-2 py-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                  <span>{place.tip}</span>
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
              {/* <iframe
                frameBorder="0"
                height={750}
                style={{border:0, width: '100%', height:'600px', maxWidth: '100%'}}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Seine+River+Cruise,Paris+France`}
                allowFullScreen
              >
              </iframe> */}
              {/* <iframe
                frameBorder="0"
                height={750}
                style={{border:0, width: '100%', height:'600px', maxWidth: '100%'}}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=Montmartre
                &destination=Seine+River+Cruise&waypoints=Musée+d'Orsay`}
                allowFullScreen
              >
              </iframe> */}
          </div>
        </div>
      
      </main>
      <Footer />
    </div>
  );
};

export default Home;
