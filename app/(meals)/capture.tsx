import React, { useState } from 'react';
import { View, Text, Button, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { logMeal } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { useUser } from '../../components/UserContext';

export default function CaptureMealScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userId } = useUser();

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleLogMeal = async () => {
    if (!userId) {
      Alert.alert('User not authenticated');
      return;
    }
    if (!foodName || !calories || !protein || !fat || !carbs) {
      Alert.alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await logMeal({
        user_id: userId,
        image_url: image || '',
        food_name: foodName,
        calories: Number(calories),
        protein: Number(protein),
        fat: Number(fat),
        carbs: Number(carbs),
      });
      Alert.alert('Meal logged!');
      router.replace('/(meals)/history');
    } catch (e) {
      Alert.alert('Error logging meal', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>Capture Your Meal</Text>
      <Button title="Take Photo" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 16 }} />
      )}
      <TextInput placeholder="Food Name" value={foodName} onChangeText={setFoodName} style={{ borderWidth: 1, width: 200, marginTop: 16, padding: 8 }} />
      <TextInput placeholder="Calories" value={calories} onChangeText={setCalories} keyboardType="numeric" style={{ borderWidth: 1, width: 200, marginTop: 8, padding: 8 }} />
      <TextInput placeholder="Protein (g)" value={protein} onChangeText={setProtein} keyboardType="numeric" style={{ borderWidth: 1, width: 200, marginTop: 8, padding: 8 }} />
      <TextInput placeholder="Fat (g)" value={fat} onChangeText={setFat} keyboardType="numeric" style={{ borderWidth: 1, width: 200, marginTop: 8, padding: 8 }} />
      <TextInput placeholder="Carbs (g)" value={carbs} onChangeText={setCarbs} keyboardType="numeric" style={{ borderWidth: 1, width: 200, marginTop: 8, padding: 8 }} />
      <Button title={loading ? 'Logging...' : 'Log Meal'} onPress={handleLogMeal} disabled={loading} />
    </View>
  );
} 