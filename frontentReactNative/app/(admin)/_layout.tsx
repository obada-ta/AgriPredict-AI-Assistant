import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from '@/stores/authstore'
import { StatusBar } from "react-native";
import { Background } from "@react-navigation/elements";
export default function TabLayout() {
    const { user } = useAuthStore();
    return (
        <>
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
                    name="post"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="user"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="people" size={size} color={color} />
                        ),
                    }}
                />

                {/* <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ size, color }) => <Ionicons name="home" size={size} color={color} />,
                    }}
                /> */}


                <Tabs.Screen
                    name="companies"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="business" size={size} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="feedBackstaff"
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="document" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </>

    );
}
