
// // app/_layout.tsx
// import { Slot, Stack } from 'expo-router';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import AuthGuard from '@/components/AuthGuard'
// import { StatusBar } from 'react-native';

// const queryClient = new QueryClient();

// export default function RootLayout() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Stack screenOptions={{ headerShown: false }}>
//         {/* <Stack.Screen name="login" /> */}
//         {/* <Stack.Screen name="(tabs)" /> */}
//         {/* <Stack.Screen name='chat' /> */}
//         <Slot/>
//       </Stack>
//     </QueryClientProvider>
//   );
// }
// app/_layout.tsx
// import { Slot, Stack } from 'expo-router';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { StatusBar } from 'react-native';
// import { useEffect } from 'react';
// import Toast from 'react-native-toast-message';

// const queryClient = new QueryClient();

// export default function RootLayout() {
//   useEffect(() => {
//     Toast.show({
//       type: "success",
//       text1: "Toast works 🎉",
//       text2: "If you see this, Toast is OK",
//     });
//   }, []);

//   return (
//     <QueryClientProvider client={queryClient}>
//         <Toast />
//       <Stack screenOptions={{ headerShown: false }}>
//         <Slot />
//       </Stack>
//       <StatusBar barStyle="light-content" />
//     </QueryClientProvider>
//   );
// }
import { Slot, Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { useGlobalSocketListeners } from '@/hook/useGlobalSocketListeners';

const queryClient = new QueryClient();

export default function RootLayout() {
  useGlobalSocketListeners(); // ✅ listeners global

 

  return (
    <QueryClientProvider client={queryClient}>
      {/* ✅ Stack وحده */}
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />
      <Toast  position='top'/>
    </QueryClientProvider>
  );
}
