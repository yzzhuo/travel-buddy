// @ts-ignore
import TravelPlanReport, { PlanResult } from '@/components/TravelPlanReport';
import type { NextPage } from 'next';
import Head from 'next/head';

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
              "transportation": "bus",
              "price": "10€",
              "brief_intro": "Sainte-Chapelle is known for its stunning stained glass windows, depicting biblical scenes and stories.",
              "tip": "Visit during sunny days to see the windows at their most vibrant."
            },
            {
              "name": "Canal Saint-Martin",
              "address": "Canal Saint-Martin, Paris",
              "price": "Free",
              "brief_intro": "Stroll along the picturesque canal and explore the trendy shops and cafes along its banks."
            },
            {
              "name": "Le Marais District",
              "address": "Le Marais, Paris",
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
          "transportation": "bus",
          "places_to_visit": [
            {
              "name": "Luxembourg Gardens",
              "address": "75006 Paris",
              "transportation": "bus",
              "price": "Free",
              "brief_intro": "Relax in the beautiful Luxembourg Gardens, known for its formal gardens, fountains, and statues.",
              "tip": "Visit early in the morning for a peaceful experience."
            },
            {
              "name": "Île de la Cité",
              "address": "Île de la Cité, Paris",
              "price": "Free",
              "brief_intro": "Discover the historic heart of Paris on Île de la Cité, home to iconic landmarks such as Notre-Dame Cathedral and Sainte-Chapelle."
            },
            {
              "name": "Panthéon",
              "address": "Place du Panthéon, 75005 Paris",
              "price": "9€",
              "brief_intro": "Visit the Panthéon, a mausoleum containing the remains of many notable French figures, including Voltaire, Rousseau, and Victor Hugo."
            }
          ],
          "things_to_do": "Relax in the beautiful Luxembourg Gardens, discover the historic heart of Paris on Île de la Cité, visit the Panthéon.",
          "accommodation": "Hotel XYZ (60€)",
        }
      ]
  } as PlanResult;
  const preferences = {
    destination: 'Paris',
    startDate: 'April 1, 2024',
    duration: 3
  } as Preference;

  return (
    <div className="flex flex-col w-full px-4 py-24 mx-auto stretch">
      <Head>
        <title>tourbuddy</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='w-full px-28'>
        <TravelPlanReport 
          data={data} 
          preferences={preferences}
          onChangeData={() => {}}
        />        
      </main>
    </div>
    )
};

export default Home;
