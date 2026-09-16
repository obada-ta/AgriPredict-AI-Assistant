import { COLORS } from "@/constants/theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import Entypo from '@expo/vector-icons/Entypo'

export default function TabLayout() {


  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          position: "absolute",
          elevation: 0,
          height: 60,
          padding: 20
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ size, color }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ color, size }) => <Entypo name="tools" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ size }) => (
            <Ionicons name="add-circle" size={size} color={COLORS.primary} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} />,
        }}
      />
      { }
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="change-password"
        options={{
          tabBarStyle: { display: 'none' }, // يخفي الـ tab bar
          headerShown: true,
          title: 'Change Password',
        }}
      /> */}



    </Tabs >
  );
}
