import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { Award, CheckCircle2, MapPin } from "lucide-react-native";
import { useRewards } from "../../hooks/useRewards";

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
        <ScrollView className="flex-1 bg-gray-50 p-6">
            <View className="bg-blue-600 rounded-3xl p-6 mb-8 flex-row justify-between items-center">
                <View>
                    <Text className="text-blue-100 text-sm font-medium">Your Total Impact</Text>
                    <Text className="text-white text-4xl font-bold mt-1">125 pts</Text>
                </View>
                <Award size={40} color="white" />
            </View>

            <Text className="text-xl font-bold text-gray-900 mb-4">Community Badges</Text>
            <View className="flex-row gap-4 mb-8">
                {["Early Responser", "Validater", "Top Citizen"].map(badge => (
                    <View key={badge} className="items-center">
                        <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-1">
                            <Award size={24} color="#2563eb" />
                        </View>
                        <Text className="text-[10px] text-gray-600 font-medium">{badge}</Text>
                    </View>
                ))}
            </View>

            <Text className="text-xl font-bold text-gray-900 mb-4">Validate Nearby Issues</Text>
            <Text className="text-gray-500 mb-4 text-sm">Help verify issues reported by your neighbors to earn points.</Text>

            {loading ? (
                <ActivityIndicator size="small" color="#2563eb" />
            ) : nearby.length === 0 ? (
                <View className="bg-white p-6 rounded-2xl items-center border border-gray-100">
                    <Text className="text-gray-400">No issues nearby to validate.</Text>
                </View>
            ) : (
                nearby.map((item) => (
                    <View key={item.id} className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm flex-row">
                        <View className="flex-1 mr-4">
                            <View className="flex-row items-center mb-1">
                                <MapPin size={12} color="#2563eb" />
                                <Text className="text-blue-600 text-[10px] font-bold ml-1 uppercase">{item.distance}</Text>
                            </View>
                            <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={1}>{item.title}</Text>
                            <Text className="text-gray-500 text-xs mb-4" numberOfLines={2}>{item.description}</Text>

                            <TouchableOpacity
                                className={`bg-blue-600 py-2 px-4 rounded-lg flex-row items-center justify-center ${validating === item.id ? 'opacity-70' : ''}`}
                                onPress={() => handleValidate(item.id)}
                                disabled={validating === item.id}
                            >
                                {validating === item.id ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} color="white" className="mr-2" />
                                        <Text className="text-white font-bold ml-2">I verify this</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View className="bg-gray-200 w-24 h-24 rounded-xl items-center justify-center">
                            <Text className="text-gray-400 text-[10px]">Photo</Text>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}
