import { Tabs } from "expo-router";
import { Home, PlusCircle, List, Award } from "lucide-react-native";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "#2563eb" }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="report"
                options={{
                    title: "Report",
                    tabBarIcon: ({ color }) => <PlusCircle size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="complaints"
                options={{
                    title: "My Issues",
                    tabBarIcon: ({ color }) => <List size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="rewards"
                options={{
                    title: "Rewards",
                    tabBarIcon: ({ color }) => <Award size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
