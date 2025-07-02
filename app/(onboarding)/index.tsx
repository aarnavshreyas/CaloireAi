import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { saveOnboarding } from '../../lib/supabase';
import { useUser } from '../../components/UserContext';

const steps = [
  'Welcome',
  'Profile',
  'Goals',
  'Stats',
  'Dietary',
  'Subscription',
  'Summary',
];

function ProgressBar({ step }: { step: number }) {
  return (
    <View style={styles.progressBarContainer}>
      {steps.map((_, i) => (
        <View
          key={i}
          style={[styles.progressDot, i <= step ? styles.progressDotActive : null]}
        />
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  // State for each step
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [dietary, setDietary] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { userId } = useUser();

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleFinish = async () => {
    if (!userId) {
      alert('User not authenticated');
      return;
    }
    try {
      await saveOnboarding({
        user_id: userId,
        name,
        age,
        gender,
        goal,
        weight,
        height,
        dietary,
        subscribed,
      });
      router.replace('(meals)/dashboard');
    } catch (e) {
      alert('Error saving onboarding: ' + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar step={step} />
      {step === 0 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Welcome to CalorieAI!</Text>
          <Text style={styles.subtitle}>Let's personalize your experience.</Text>
          <Button title="Get Started" onPress={nextStep} />
        </View>
      )}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Profile</Text>
          <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Gender" value={gender} onChangeText={setGender} style={styles.input} />
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>What is your goal?</Text>
          <TouchableOpacity style={styles.option} onPress={() => setGoal('Lose Weight')}><Text>Lose Weight</Text></TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => setGoal('Maintain Weight')}><Text>Maintain Weight</Text></TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => setGoal('Gain Weight')}><Text>Gain Weight</Text></TouchableOpacity>
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Your Stats</Text>
          <TextInput placeholder="Weight (kg)" value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input} />
          <TextInput placeholder="Height (cm)" value={height} onChangeText={setHeight} keyboardType="numeric" style={styles.input} />
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
      {step === 4 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Dietary Preferences</Text>
          <TextInput placeholder="e.g. Vegan, Gluten-Free, None" value={dietary} onChangeText={setDietary} style={styles.input} />
          <Button title="Next" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
      {step === 5 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Try Premium?</Text>
          <Text style={styles.subtitle}>Unlock advanced features with a subscription.</Text>
          <Button title={subscribed ? "Subscribed!" : "Subscribe Now"} onPress={() => setSubscribed(true)} />
          <Button title="Skip" onPress={nextStep} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
      {step === 6 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>All Set!</Text>
          <Text style={styles.subtitle}>Welcome, {name || 'User'}!</Text>
          <Button title="Finish" onPress={handleFinish} />
          <Button title="Back" onPress={prevStep} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  progressBarContainer: { flexDirection: 'row', marginBottom: 24 },
  progressDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#eee', margin: 4 },
  progressDotActive: { backgroundColor: '#4f8cff' },
  stepContainer: { width: '100%', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#888', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, width: 220, padding: 10, marginBottom: 12 },
  option: { padding: 12, backgroundColor: '#f2f2f2', borderRadius: 8, marginVertical: 6, width: 220, alignItems: 'center' },
}); 