import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Award, CheckCircle2, Compass, Flame, MapPin, Medal, ShieldCheck, Sparkles } from "lucide-react-native";
import { useRewards } from "../../hooks/useRewards";

const BADGES = [
    { name: "Early Responder", icon: Flame, tone: "bg-amber-50 border-amber-200 text-amber-700" },
    { name: "Top Validator", icon: ShieldCheck, tone: "bg-primary-50 border-primary-200 text-primary-700" },
    { name: "Community Star", icon: Sparkles, tone: "bg-violet-50 border-violet-200 text-violet-700" },
];

export default function Rewards() {
    const { nearby, loading, validating, validateComplaint } = useRewards();

    const handleValidate = async (id: string) => {
        const success = await validateComplaint(id);
        if (success) {
            Alert.alert("Rewarded!", "You earned +5 impact points for validating this issue.");
        } else {
            Alert.alert("Error", "Could not validate at this time.");
        }
    };

    return (
        <ScrollView className="flex-1 bg-surface-50" contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
            <View className="bg-primary-600 rounded-3xl p-6 mb-8 shadow-xl shadow-primary-500/30">
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-primary-100 text-xs uppercase tracking-widest font-bold">Your Total Impact</Text>
                        <Text className="text-white text-4xl font-black mt-1">125 pts</Text>
                    </View>
                    <View className="bg-white/15 p-4 rounded-2xl">
                        <Award size={34} color="white" />
                    </View>
                </View>

                <View className="mt-5 flex-row">
                    <View className="bg-white/15 px-4 py-3 rounded-2xl mr-3 flex-1">
                        <Text className="text-white/70 text-[10px] uppercase font-bold">Rank</Text>
                        <View className="flex-row items-center mt-1">
                            <Medal size={14} color="white" />
                            <Text className="text-white font-bold ml-2">Neighborhood Hero</Text>
                        </View>
                    </View>
                    <View className="bg-white/15 px-4 py-3 rounded-2xl flex-1">
                        <Text className="text-white/70 text-[10px] uppercase font-bold">This Week</Text>
                        <Text className="text-white font-bold mt-1">+25 pts</Text>
                    </View>
                </View>
            </View>

            <Text className="text-xl font-bold text-surface-900 mb-4">Community Badges</Text>
            <View className="flex-row justify-between mb-8">
                {BADGES.map(({ name, icon: Icon, tone }) => (
                    <View key={name} className={`w-[31%] rounded-2xl border p-3 items-center ${tone}`}>
                        <View className="w-11 h-11 rounded-full bg-white/90 items-center justify-center mb-2">
                            <Icon size={20} color="#1d4ed8" />
                        </View>
                        <Text className="text-[10px] text-center font-bold">{name}</Text>
                    </View>
                ))}
            </View>

            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xl font-bold text-surface-900">Validate Nearby Issues</Text>
                <View className="flex-row items-center bg-primary-50 px-3 py-1.5 rounded-full border border-primary-200">
                    <Compass size={12} color="#2563eb" />
                    <Text className="text-primary-700 text-[10px] font-bold ml-1">Location powered</Text>
                </View>
            </View>
            <Text className="text-surface-900/50 mb-4 text-sm">Help verify issues reported by neighbors and earn instant impact points.</Text>

            {loading ? (
                <View className="bg-white p-6 rounded-3xl items-center border border-surface-200">
                    <ActivityIndicator size="small" color="#2563eb" />
                    <Text className="text-surface-900/40 mt-2 text-xs font-semibold">Finding nearby reports...</Text>
                </View>
            ) : nearby.length === 0 ? (
                <View className="bg-white p-6 rounded-3xl items-center border border-surface-200">
                    <Text className="text-surface-900/40">No issues nearby to validate.</Text>
                </View>
            ) : (
                nearby.map((item) => (
                    <View key={item.id} className="bg-white p-5 rounded-3xl mb-4 border border-surface-200 shadow-sm">
                        <View className="flex-row items-start justify-between mb-2">
                            <View className="flex-1 pr-3">
                                <View className="flex-row items-center mb-1">
                                    <MapPin size={12} color="#2563eb" />
                                    <Text className="text-primary-600 text-[10px] font-black ml-1 uppercase tracking-wider">{item.distance} away</Text>
                                </View>
                                <Text className="text-lg font-bold text-surface-900" numberOfLines={1}>{item.title}</Text>
                            </View>
                            <View className="bg-surface-100 w-16 h-16 rounded-2xl items-center justify-center">
                                <Text className="text-lg">📸</Text>
                            </View>
                        </View>

                        <Text className="text-surface-900/50 text-xs mb-4" numberOfLines={2}>{item.description}</Text>

                        <TouchableOpacity
                            className={`bg-primary-600 py-3 px-4 rounded-2xl flex-row items-center justify-center ${validating === item.id ? "opacity-70" : ""}`}
                            onPress={() => handleValidate(item.id)}
                            disabled={validating === item.id}
                        >
                            {validating === item.id ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <>
                                    <CheckCircle2 size={16} color="white" />
                                    <Text className="text-white font-bold ml-2">I verify this report</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ))
            )}
        </ScrollView>
    );
}
