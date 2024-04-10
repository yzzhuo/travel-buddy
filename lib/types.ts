
export interface PlanStep {
  question: string;
  id: string;
  input: (preferences: TravelPreference, setPreferences: (preferences: TravelPreference) => void) => JSX.Element;
  tips?: {
    text: string;
    message: string;
  }[]
}
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