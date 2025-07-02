import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Welcome to CalorieAI!</Text>
      <Button title="Get Started" onPress={() => router.push('/(auth)/sign-up')} />
    </View>
  );
} 