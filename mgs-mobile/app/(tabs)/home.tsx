import { View, Text, ScrollView, RefreshControl } from "react-native";
import { CATEGORIES } from "../../shared/constants/categories";
import { useAuthStore } from "../../store/authStore";
import { useComplaints } from "../../hooks/useComplaints";

export default function Home() {
    const { user } = useAuthStore();
    const { complaints, loading, refetch } = useComplaints();

    const userName = user?.user_metadata?.full_name || "Citizen";
    const resolvedCount = complaints.filter(c => c.status === "RESOLVED").length;
    const totalPoints = 50 + (resolvedCount * 10) + (complaints.length * 5); // Example calculation

    return (
        <ScrollView
            className="flex-1 bg-gray-50"
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refetch} />
            }
        >
            <View className="bg-blue-600 p-8 pb-12 rounded-b-3xl">
                <Text className="text-blue-100 text-lg opacity-80">Welcome back,</Text>
                <Text className="text-white text-3xl font-bold">{userName}</Text>
            </View>

            <View className="px-6 -mt-6">
                <View className="bg-white p-6 rounded-2xl shadow-sm flex-row justify-between border border-gray-100">
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-gray-900">{complaints.length}</Text>
                        <Text className="text-gray-500 text-xs">Reports</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-green-600">{resolvedCount}</Text>
                        <Text className="text-gray-500 text-xs">Resolved</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-2xl font-bold text-blue-600">{totalPoints}</Text>
                        <Text className="text-gray-500 text-xs">Points</Text>
                    </View>
                </View>
            </View>

            <View className="p-6">
                <Text className="text-xl font-bold text-gray-900 mb-4">Community Insights</Text>
                <View className="flex-row flex-wrap justify-between">
                    {Object.values(CATEGORIES).slice(0, 4).map((cat) => {
                        const catCount = complaints.filter(c => c.category === cat.id).length;
                        return (
                            <View key={cat.id} className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow-sm border border-gray-100">
                                <Text className="font-semibold text-gray-800">{cat.name}</Text>
                                <Text className="text-gray-500 text-xs">{catCount} reports</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}
