// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Dumbbell, CheckCircle2, Quote } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Exercises',
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="completed"
        options={{
          title: 'Completed',
          tabBarIcon: ({ color, size }) => <CheckCircle2 color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="quotes"
        options={{
          title: 'Motivation',
          tabBarIcon: ({ color, size }) => <Quote color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}