import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center bg-white p-6">
            <Text className="text-3xl font-bold text-blue-600 mb-4">MGS Mobile</Text>
            <Text className="text-lg text-gray-600 text-center mb-10">
                Transforming how citizens and governments resolve civic issues.
            </Text>

            <TouchableOpacity
                className="bg-blue-600 w-full py-4 rounded-xl items-center"
                onPress={() => router.push("/(auth)/login")}
            >
                <Text className="text-white text-xl font-semibold">Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}
