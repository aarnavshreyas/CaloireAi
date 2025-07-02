import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { fetchMeals } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { useUser } from '../../components/UserContext';

export default function DashboardScreen() {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { userId, signOut } = useUser();

  useEffect(() => {
    if (!userId) return;
    const loadMeals = async () => {
      setLoading(true);
      try {
        const data = await fetchMeals(userId);
        setMeals(data || []);
      } catch (e) {
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };
    loadMeals();
  }, [userId]);

  // Calculate today's totals
  const today = new Date().toISOString().slice(0, 10);
  const todaysMeals = meals.filter(m => m.meal_time && m.meal_time.startsWith(today));
  const total = (key: string) => todaysMeals.reduce((sum, m) => sum + (m[key] || 0), 0);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/welcome');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Dashboard</Text>
      {loading ? <Text>Loading...</Text> : (
        <>
          <Text>Today's Calories: {total('calories')}</Text>
          <Text>Protein: {total('protein')}g</Text>
          <Text>Fat: {total('fat')}g</Text>
          <Text>Carbs: {total('carbs')}g</Text>
          <Button title="Log New Meal" onPress={() => router.push('/(meals)/capture')} />
          <Button title="View Meal History" onPress={() => router.push('/(meals)/history')} />
          <Button title="Sign Out" onPress={handleSignOut} color="red" />
        </>
      )}
    </View>
  );
} 