import type { NextPage } from 'next';
import Head from 'next/head';
import { Tab } from '@headlessui/react'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'

interface Preference {
  destination: string;
  startDate: string;
  duration: number;
}
const Home: NextPage = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
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
  const planResult = `
  - **April 1:**
  - **Route:** Hotel → Montmartre → Musée d'Orsay → Seine River Cruise → Hotel
  - **Montmartre:** Address: Montmartre, Paris, Transportation: Walking, Price: Free, Brief Introduction: Montmartre is a historic hilltop neighborhood known for its artistic heritage and stunning views of the city. Tip: Don't miss the iconic Sacré-Cœur Basilica.
  - **Musée d'Orsay:** Address: 1 Rue de la Légion d'Honneur, 75007 Paris, Transportation: Metro, Price: 14€, Brief Introduction: Housed in a former railway station, the museum showcases an impressive collection of impressionist and post-impressionist masterpieces. Tip: Arrive early to avoid crowds.
  - **Seine River Cruise:** Address: Port de la Bourdonnais, 75007 Paris, Transportation: Boat, Price: 15€, Brief Introduction: Enjoy a relaxing boat ride along the Seine River, passing by iconic landmarks such as the Eiffel Tower and Notre-Dame Cathedral. Tip: Opt for an evening cruise to see Paris illuminated at night.`
  return (
    <div className="flex flex-col w-full px-4 py-24 mx-auto stretch">
      <Head>
        <title>tourbuddy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='w-full px-28'>
        <div className="prose">
          <h1>My Trip</h1>
          <div className='flex gap-4 font-bold'>
            <span>Start Date: {data.startDate}</span>
            <span>Duration: {data.duration}</span>
            <span>Destination: {data.city}, {data.country}</span>
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
      </main>
    </div>
    )
};

export default Home;
