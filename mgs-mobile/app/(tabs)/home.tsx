import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { CATEGORIES } from "../../shared/constants/categories";
import { useAuthStore } from "../../store/authStore";
import { useComplaints } from "../../hooks/useComplaints";
import { Bell, ShieldCheck, TrendingUp, Trophy } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Home() {
    const { user } = useAuthStore();
    const { complaints, loading, refetch } = useComplaints();
    const router = useRouter();

    const userName = user?.user_metadata?.full_name || "Citizen";
    const resolvedCount = complaints.filter(c => c.status === "RESOLVED").length;
    const totalPoints = 120 + (resolvedCount * 25) + (complaints.length * 10);

    return (
        <ScrollView
            className="flex-1 bg-surface-50"
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={refetch} />
            }
        >
            {/* Header Section */}
            <View className="bg-primary-600 px-6 pt-16 pb-12 rounded-b-[40px] shadow-lg">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-primary-100 text-sm font-medium uppercase tracking-wider">Dashboard</Text>
                        <Text className="text-white text-3xl font-bold">Hello, {userName.split(' ')[0]}</Text>
                    </View>
                    <TouchableOpacity className="bg-white/20 p-3 rounded-full">
                        <Bell size={22} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Score Card */}
                <View className="bg-white/10 p-5 rounded-3xl border border-white/20 flex-row items-center">
                    <View className="bg-accent p-3 rounded-2xl mr-4 shadow-sm">
                        <Trophy size={24} color="white" />
                    </View>
                    <View>
                        <Text className="text-white/80 text-xs font-medium uppercase">Community Score</Text>
                        <Text className="text-white text-2xl font-bold">{totalPoints} Points</Text>
                    </View>
                </View>
            </View>

            {/* Stats Overview */}
            <View className="flex-row px-6 -mt-8 justify-between">
                <View className="bg-white w-[48%] p-5 rounded-3xl shadow-xl shadow-black/5 border border-surface-100">
                    <View className="bg-primary-50 w-10 h-10 rounded-full items-center justify-center mb-3">
                        <TrendingUp size={20} color="#2563eb" />
                    </View>
                    <Text className="text-primary-900 text-2xl font-bold">{complaints.length}</Text>
                    <Text className="text-surface-900/50 text-xs font-semibold">Total Reports</Text>
                </View>
                <View className="bg-white w-[48%] p-5 rounded-3xl shadow-xl shadow-black/5 border border-surface-100">
                    <View className="bg-green-50 w-10 h-10 rounded-full items-center justify-center mb-3">
                        <ShieldCheck size={20} color="#16a34a" />
                    </View>
                    <Text className="text-green-700 text-2xl font-bold">{resolvedCount}</Text>
                    <Text className="text-surface-900/50 text-xs font-semibold">Grievances Solved</Text>
                </View>
            </View>

            {/* Quick Actions / Categories */}
            <View className="p-6">
                <View className="flex-row justify-between items-center mb-5">
                    <Text className="text-xl font-bold text-surface-900">Issue Categories</Text>
                    <TouchableOpacity>
                        <Text className="text-primary-500 font-bold text-xs uppercase">View Map</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row flex-wrap justify-between">
                    {Object.values(CATEGORIES).map((cat) => {
                        const catCount = complaints.filter(c => c.category === cat.id).length;
                        return (
                            <TouchableOpacity
                                key={cat.id}
                                className="bg-white w-[48%] p-5 rounded-3xl mb-4 shadow-md shadow-black/5 border border-surface-100"
                                onPress={() => router.push("/(tabs)/complaints")}
                            >
                                <View className="bg-surface-50 w-10 h-10 rounded-xl items-center justify-center mb-3">
                                    <Text className="text-lg">{cat.name.charAt(0)}</Text>
                                </View>
                                <Text className="font-bold text-surface-900 leading-tight mb-1">{cat.name}</Text>
                                <View className="flex-row items-center">
                                    <View className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2" />
                                    <Text className="text-surface-900/40 text-[10px] font-bold uppercase">{catCount} Active</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Notification / Alert Area */}
            <View className="px-6 pb-20">
                <View className="bg-accent/10 border border-accent/20 p-6 rounded-3xl flex-row items-center">
                    <View className="bg-accent p-2 rounded-full mr-4">
                        <ShieldCheck size={18} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-accent text-sm font-bold">Safety Tip</Text>
                        <Text className="text-accent/80 text-xs leading-4">Your reports are processed using AI for faster resolution. Keep capturing clear photos!</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

