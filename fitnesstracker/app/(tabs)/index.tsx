// app/(tabs)/index.tsx
import { Link } from 'expo-router';
import { Dumbbell, PlusCircle } from 'lucide-react-native';

// Import the hook:
import { useExercises } from '../context/ExerciseContext';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Exercise } from '../../types';

// Initial mock data
const initialExercises: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    description: 'Classic upper body exercise',
    category: 'Strength',
    difficulty: 'Beginner',
    duration: 10,
    completed: false,
    dateAdded: new Date(),
  },
  {
    id: '2',
    name: 'Running',
    description: 'Cardio exercise for endurance',
    category: 'Cardio',
    difficulty: 'Intermediate',
    duration: 30,
    completed: true,
    dateAdded: new Date(),
  },
  {
    id: '3',
    name: 'Yoga',
    description: 'Improve flexibility and balance',
    category: 'Flexibility',
    difficulty: 'Beginner',
    duration: 20,
    completed: false,
    dateAdded: new Date(),
  },
];

export default function HomeScreen() {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);

  const toggleComplete = (id: string) => {
    setExercises(prev =>
      prev.map(exercise =>
        exercise.id === id
          ? { ...exercise, completed: !exercise.completed }
          : exercise
      )
    );
  };

  const deleteExercise = (id: string) => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            setExercises(prev => prev.filter(exercise => exercise.id !== id)),
        },
      ]
    );
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={[
        styles.exerciseCard,
        item.completed && styles.completedCard,
      ]}
      onPress={() => toggleComplete(item.id)}
      onLongPress={() => deleteExercise(item.id)}
    >
      <View style={styles.exerciseHeader}>
        <Dumbbell size={20} color="#3B82F6" />
        <Text style={styles.exerciseName}>{item.name}</Text>
        <View
          style={[
            styles.statusIndicator,
            item.completed
              ? styles.completedIndicator
              : styles.pendingIndicator,
          ]}
        />
      </View>
      <Text style={styles.exerciseDescription}>{item.description}</Text>
      <View style={styles.exerciseDetails}>
        <Text style={styles.categoryTag}>{item.category}</Text>
        <Text style={styles.difficultyTag}>{item.difficulty}</Text>
        <Text style={styles.durationText}>{item.duration} min</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fitness Exercises</Text>
        <Link href="/add-exercise" asChild>
          <TouchableOpacity style={styles.addButton}>
            <PlusCircle size={28} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No exercises added yet!</Text>
        }
      />

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Total: {exercises.length} | Completed:{' '}
          {exercises.filter(e => e.completed).length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 50,
    padding: 10,
  },
  listContainer: {
    padding: 16,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  completedIndicator: {
    backgroundColor: '#10B981',
  },
  pendingIndicator: {
    backgroundColor: '#F59E0B',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryTag: {
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  difficultyTag: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  durationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 'auto',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 40,
  },
  statsContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});