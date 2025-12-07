// app/_layout.tsx
import { Stack } from 'expo-router';
import ExerciseProvider from './context/ExerciseContext';

export default function RootLayout() {
  return (
    <ExerciseProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-exercise" />
      </Stack>
    </ExerciseProvider>
  );
}