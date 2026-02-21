import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { STATUS } from "../../shared/constants/status";
import { useComplaints } from "../../hooks/useComplaints";
import { Calendar, ChevronRight, Inbox, MapPin } from "lucide-react-native";

const STATUS_STYLES: Record<string, { container: string; text: string }> = {
    PENDING: { container: "bg-amber-50 border-amber-200", text: "text-amber-700" },
    IN_PROGRESS: { container: "bg-blue-50 border-blue-200", text: "text-blue-700" },
    RESOLVED: { container: "bg-green-50 border-green-200", text: "text-green-700" },
    REJECTED: { container: "bg-rose-50 border-rose-200", text: "text-rose-700" },
};

export default function Complaints() {
    const router = useRouter();
    const { complaints, loading, refetch } = useComplaints();

    if (loading && complaints.length === 0) {
        return (
            <View className="flex-1 justify-center items-center bg-surface-50">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="mt-4 text-surface-900/40 font-bold uppercase text-[10px] tracking-widest">Loading Records...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-surface-50">
            <View className="px-6 pt-16 pb-6 bg-white border-b border-surface-200">
                <Text className="text-3xl font-black text-surface-900 tracking-tight">Active Track</Text>
                <Text className="text-surface-900/50 text-sm font-medium">Monitor your submitted grievances</Text>
            </View>

            <FlatList
                data={complaints}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={refetch} tintColor="#2563eb" />
                }
                ListEmptyComponent={
                    <View className="items-center justify-center mt-20 opacity-20">
                        <Inbox size={80} color="#09090b" />
                        <Text className="text-surface-900 font-bold mt-4 uppercase tracking-widest text-xs">No Records Found</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const statusInfo = (STATUS as any)[item.status] || { name: item.status };
                    const statusStyles = STATUS_STYLES[item.status] || { container: "bg-surface-100 border-surface-200", text: "text-surface-900" };

                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="bg-white rounded-[32px] mb-6 shadow-xl shadow-black/5 border border-surface-200 overflow-hidden"
                            onPress={() => router.push(`/complaint/${item.id}`)}
                        >
                            <View className="flex-row p-5">
                                {item.imageUrl ? (
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        className="w-20 h-20 rounded-2xl bg-surface-100"
                                    />
                                ) : (
                                    <View className="w-20 h-20 rounded-2xl bg-primary-50 items-center justify-center">
                                        <Text className="text-xl">📋</Text>
                                    </View>
                                )}

                                <View className="flex-1 ml-4 justify-between">
                                    <View>
                                        <View className="flex-row justify-between items-start">
                                            <Text className="text-lg font-bold text-surface-900 flex-1 mr-2" numberOfLines={1}>
                                                {item.title || "Untitled Issue"}
                                            </Text>
                                            <ChevronRight size={18} color="#09090b" opacity={0.2} />
                                        </View>

                                        <View className="flex-row items-center mt-1">
                                            <MapPin size={10} color="#2563eb" />
                                            <Text className="text-surface-900/40 text-[10px] font-bold ml-1 uppercase" numberOfLines={1}>
                                                {item.address || "Location Unknown"}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row justify-between items-center mt-2">
                                        <View className="flex-row items-center">
                                            <Calendar size={12} color="#a1a1aa" />
                                            <Text className="text-surface-900/30 text-[10px] font-medium ml-1">
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Pending"}
                                            </Text>
                                        </View>

                                        <View className={`px-3 py-1 rounded-full border ${statusStyles.container}`}>
                                            <Text className={`text-[9px] font-black uppercase tracking-wider ${statusStyles.text}`}>
                                                {statusInfo.name}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}
