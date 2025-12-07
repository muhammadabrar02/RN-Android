// types.ts
export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  completed: boolean;
  dateAdded: Date;
  image?: string;
  calories?: number;
  sets?: number;
  reps?: number;
  distance?: string;
  equipment?: string[];
  instructions?: string[];
  tips?: string[];
  completedDate?: string;
}
// // app/types/index.ts
// export type Exercise = {
//   id: string;
//   name: string;
//   description: string;
//   category: string;
//   difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
//   duration: number; // in minutes
//   completed: boolean;
//   dateAdded: Date;
// };

// export type Quote = {
//   id: string;
//   text: string;
//   author: string;
//   category: string;
// };