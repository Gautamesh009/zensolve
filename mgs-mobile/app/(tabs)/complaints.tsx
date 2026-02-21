import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { STATUS } from "../../shared/constants/status";
import { useComplaints } from "../../hooks/useComplaints";

export default function Complaints() {
    const router = useRouter();
    const { complaints, loading, refetch } = useComplaints();

    if (loading && complaints.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 p-6">
            <Text className="text-2xl font-bold text-gray-900 mb-6">My Grievances</Text>

            <FlatList
                data={complaints}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refetch} />
                }
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-gray-500">No grievances reported yet.</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const statusInfo = (STATUS as any)[item.status] || { name: item.status, color: "gray" };
                    return (
                        <TouchableOpacity
                            className="bg-white p-4 rounded-xl mb-4 border border-gray-100 shadow-sm"
                            onPress={() => router.push(`/complaint/${item.id}`)}
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <Text className="text-lg font-semibold text-gray-900 flex-1 mr-2" numberOfLines={1}>{item.title || "Untitled"}</Text>
                                <View className={`px-2 py-1 rounded-md bg-${statusInfo.color}-100`}>
                                    <Text className={`text-${statusInfo.color}-700 text-xs font-bold`}>
                                        {statusInfo.name}
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-gray-500 text-sm">
                                Submitted on {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}
