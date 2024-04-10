import { MapIcon } from '@heroicons/react/24/outline';

export interface TravelPreference {
  destination: string;
  startDate: string;
  duration: number;
  interests?: string;
  places?: string;
  activities?: string;
  dietary?: string;
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
  price: string
  brief_intro: string
  tip?: string
  type: 'attraction' | 'restaurant' | 'activities'
}


export const generatePromptForTravelPlan = (preferences: TravelPreference) => {
  return `I am planning a trip here is my preferences:
  ---
  ${JSON.stringify(preferences)}
  ---
  Please Generate a JSON response with the following structure:
  ---
  interface Result {
    startDate: string
    duration: string
    city: string
    country: string
    itinerary: Itinerary[]
  }
  interface Itinerary {
    date: string
    city: string
    transportation: 'driving' | 'walking | 'bicycling'
    places_to_visit: PlacesToVisit[]
    things_to_do: string
    accommodation: string
  }
  interface PlacesToVisit {
    name: string
    address: string
    price: string
    brief_intro: string
    tip?: string
    type: 'attraction' | 'restaurant' | 'activities'
  }
  ---
  `;
}
export default function TravelPlanReport({preferences, data, onChangeData}:
   {preferences: TravelPreference, 
    data: PlanResult,
    onChangeData: (data: PlanResult) => void,
  }) {

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    const generateDirectionQuery = (places: any[]) => {
      if (places.length > 0) {
        let query = `origin=${places[0].name.replace('', '+')}&destination=${places[places.length - 1].name.replace('', '+')}&`;
        if (places.length > 2) {
          query += `waypoints=`;
          // join the middle waypoints with |
          query += places.slice(1, places.length - 1).map((place: any) => place.name.replace('', '+')).join('|');
        }
        return query;
      }
    }

    const getTransportationMode = (transportation: string) => {
      if (['driving', 'walking', 'bicycling'].includes(transportation)) {
        return transportation;
      } else {
        return 'driving';
      }
    }
  return (
  <div className='flex flex-col justify-center md:items-center'>
    <div className="prose prose-sm md:prose flex flex-col md:items-center md:justify-center pt-4">
      <h1>Trip to {preferences.destination}</h1>
      <div className='flex md:gap-4 md:font-bold flex-col md:flex-row '>
        <span>Start Date: {data.startDate}</span>
        <span>Duration: {data.duration}</span>
        <span>Destination: {data.city}, {data.country}</span>
      </div>
    </div>
    <div className='grid grid-cols-12 gap-6 max-w-5xl'>
      <div className="col-span-12">
        <section className='mt-8'>
          <div className="prose prose-sm md:prose md:block hidden">
            <h2>Itinerary Summary</h2>
          </div>
          <div className="overflow-x-auto mt-4 bg-white shadow-xl">
            <table className="table table-fixed border hidden md:table">
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
            <section className='bg-white px-4 py-2 rounded-lg shadow-lg'>
              <div className="prose">
                <h3>{item.date}</h3>
                <div className='flex md:flex-row gap-4 flex-col'>
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
                      onChangeData({...data, itinerary: newItinerary});
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
                    </div>
                </div>
              </div>
              <div className="grid mt-4  flex-col md:grid-cols-12 w-full gap-4">
                <div className="col-span-6">
                <iframe
                    frameBorder="0"
                    height={750}
                    className='h-56 md:h-96 shadow-xl'
                    style={{border:0, width: '100%', maxWidth: '100%'}}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/directions?key=${apiKey}&${generateDirectionQuery(item.places_to_visit)}&mode=${getTransportationMode(item.transportation)}`}
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
                        {place.tip && <div role="alert" className="alert px-2 py-1 flex justify-start">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <span className='text-left text-xs md:text-sm flex-auto'>Tip: {place.tip}</span>
                        </div>
                        }
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              </div>
            </section>
          </div>
        ))
      }
    </div>
  </div>
  );
}
