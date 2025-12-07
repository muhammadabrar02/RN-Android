// app/context/ExerciseContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

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

interface ExerciseContextType {
  exercises: Exercise[];
  completedExercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, 'id' | 'dateAdded' | 'completed'>) => void;
  toggleComplete: (id: string) => void;
  deleteExercise: (id: string) => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export const ExerciseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Push-ups',
      description: 'Classic upper body exercise targeting chest, shoulders, and triceps',
      category: 'Strength',
      difficulty: 'Beginner',
      duration: 10,
      completed: false,
      dateAdded: new Date(),
      calories: 100,
      sets: 3,
      reps: 12,
      equipment: ['Mat (optional)'],
      instructions: [
        'Start in plank position',
        'Lower body until chest nearly touches floor',
        'Push back up to starting position',
        'Keep core tight throughout'
      ],
      tips: ['Keep elbows at 45-degree angle', 'Maintain straight back']
    },
    {
      id: '2',
      name: 'Running',
      description: 'Cardio exercise for endurance and cardiovascular health',
      category: 'Cardio',
      difficulty: 'Intermediate',
      duration: 30,
      completed: true,
      dateAdded: new Date(),
      completedDate: '2024-01-15',
      calories: 320,
      distance: '5.2 km',
      equipment: ['Running shoes', 'Comfortable clothes'],
      instructions: [
        'Warm up for 5 minutes',
        'Start at comfortable pace',
        'Maintain steady breathing',
        'Cool down for 5 minutes'
      ],
      tips: ['Stay hydrated', 'Use proper running form']
    },
  ]);

  const completedExercises = exercises.filter(ex => ex.completed);

  const addExercise = (exerciseData: Omit<Exercise, 'id' | 'dateAdded' | 'completed'>) => {
    const newExercise: Exercise = {
      ...exerciseData,
      id: Date.now().toString(),
      dateAdded: new Date(),
      completed: false,
    };
    setExercises(prev => [newExercise, ...prev]);
  };

  const toggleComplete = (id: string) => {
    setExercises(prev => prev.map(exercise =>
      exercise.id === id 
        ? { 
            ...exercise, 
            completed: !exercise.completed,
            completedDate: !exercise.completed ? new Date().toISOString().split('T')[0] : undefined
          }
        : exercise
    ));
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(exercise => exercise.id !== id));
  };

  return (
    <ExerciseContext.Provider value={{
      exercises,
      completedExercises,
      addExercise,
      toggleComplete,
      deleteExercise,
    }}>
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercises = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercises must be used within ExerciseProvider');
  }
  return context;
};

// Add default export
export default ExerciseProvider;