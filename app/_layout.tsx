import { Stack } from 'expo-router';
import { UserProvider } from '../components/UserContext';

export default function Layout() {
  return (
    <UserProvider>
      <Stack initialRouteName="(auth)/welcome" />
    </UserProvider>
  );
}