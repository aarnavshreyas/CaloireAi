import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { fetchMeals } from '../../lib/supabase';
import { useUser } from '../../components/UserContext';

export default function MealHistoryScreen() {
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

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

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>Meal History</Text>
      <FlatList
        data={meals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16, borderBottomWidth: 1, paddingBottom: 8 }}>
            {item.image_url ? <Image source={{ uri: item.image_url }} style={{ width: 100, height: 100 }} /> : null}
            <Text style={{ fontWeight: 'bold' }}>{item.food_name}</Text>
            <Text>Calories: {item.calories} | Protein: {item.protein}g | Fat: {item.fat}g | Carbs: {item.carbs}g</Text>
            <Text style={{ color: '#888' }}>{new Date(item.meal_time).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
} 