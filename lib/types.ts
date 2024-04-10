
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
