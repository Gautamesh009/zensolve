import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { complaintsApi } from "../../shared/api/complaintsApi";
import { STATUS } from "../../shared/constants/status";

import { ChevronLeft, MapPin, Clock, ShieldCheck } from "lucide-react-native";

export default function ComplaintDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [complaint, setComplaint] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const data = await complaintsApi.getById(id);
            setComplaint(data);
        } catch (error) {
            console.error("Failed to fetch complaint detail:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (!complaint) {
        return (
            <View className="flex-1 justify-center items-center bg-white p-6">
                <Text className="text-gray-500 mb-4">Grievance not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="bg-blue-600 px-6 py-2 rounded-lg">
                    <Text className="text-white font-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const statusInfo = STATUS[complaint.status as keyof typeof STATUS] || { name: complaint.status, color: "gray" };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="relative">
                <Image source={{ uri: complaint.image }} className="w-full h-80" />
                <TouchableOpacity
                    className="absolute top-12 left-6 bg-black/40 p-2 rounded-full"
                    onPress={() => router.back()}
                >
                    <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <View className="absolute bottom-4 left-6 right-6 flex-row justify-between items-end">
                    <View className={`px-4 py-1.5 rounded-full bg-${statusInfo.color}-500 shadow-sm`}>
                        <Text className="text-white font-bold text-xs uppercase">{statusInfo.name}</Text>
                    </View>
                </View>
            </View>

            <View className="p-6">
                <Text className="text-2xl font-bold text-gray-900 mb-2">{complaint.title}</Text>

                <View className="flex-row items-center mb-6">
                    <MapPin size={16} color="#4b5563" />
                    <Text className="text-gray-600 text-sm ml-1 flex-1" numberOfLines={1}>{complaint.address}</Text>
                </View>

                <View className="bg-gray-50 rounded-2xl p-4 mb-8">
                    <View className="flex-row items-center mb-3">
                        <Clock size={16} color="#2563eb" />
                        <Text className="text-blue-900 font-bold ml-2">Status Timeline</Text>
                    </View>

                    <View className="ml-2">
                        {["SUBMITTED", "ASSIGNED", "IN_PROGRESS", "RESOLVED"].map((s, idx, arr) => {
                            const isActive = s === complaint.status;
                            const isPast = arr.indexOf(complaint.status) >= idx;
                            return (
                                <View key={s} className="flex-row min-h-[40px]">
                                    <View className="items-center">
                                        <View className={`w-3 h-3 rounded-full ${isPast ? 'bg-blue-600' : 'bg-gray-300'}`} />
                                        {idx < arr.length - 1 && <View className={`w-0.5 flex-1 ${isPast ? 'bg-blue-600' : 'bg-gray-300'}`} />}
                                    </View>
                                    <View className="ml-4 -mt-1 pb-4">
                                        <Text className={`text-sm font-bold ${isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {STATUS[s as keyof typeof STATUS]?.name || s}
                                        </Text>
                                        {isActive && <Text className="text-[10px] text-blue-600 italic">Currently active • AI processed</Text>}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                <Text className="text-lg font-bold text-gray-900 mb-2">Description</Text>
                <Text className="text-gray-600 leading-6 mb-8">{complaint.description}</Text>

                {complaint.feedback && (
                    <View className="bg-green-50 rounded-2xl p-4 border border-green-100 mb-8">
                        <View className="flex-row items-center mb-2">
                            <ShieldCheck size={20} color="#059669" />
                            <Text className="text-green-900 font-bold ml-2">Department Feedback</Text>
                        </View>
                        <Text className="text-green-800 text-sm">{complaint.feedback}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
