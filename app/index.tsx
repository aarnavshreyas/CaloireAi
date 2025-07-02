import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('(auth)/welcome');
    }, 50); // 50ms delay
    return () => clearTimeout(timeout);
  }, []);
  return null;
}