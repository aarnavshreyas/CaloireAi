import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../components/UserContext';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Sign In Error', error.message);
    } else if (data.session && data.session.user) {
      // Store user ID for later use (e.g., in context or async storage)
      // For now, pass to onboarding
      router.replace('/(onboarding)');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>Sign In</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{ borderWidth: 1, width: 220, marginBottom: 12, padding: 8 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, width: 220, marginBottom: 12, padding: 8 }} />
      <Button title={loading ? 'Signing In...' : 'Sign In'} onPress={handleSignIn} disabled={loading} />
      <Button title="Back to Welcome" onPress={() => router.replace('/(auth)/welcome')} />
    </View>
  );
} 