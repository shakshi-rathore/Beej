export type CropType = 'rice' | 'wheat' | 'maize' | 'potato' | 'muskmelon' | 'watermelon';

export interface Question {
  id: string;
  question: string;
  image: string;
}

export interface Disease {
  name: string;
  symptoms: string[]; // symptom question IDs
  cause: string;
  treatment: string;
  prevention: string;
  image: string; // URL or local asset path
}
