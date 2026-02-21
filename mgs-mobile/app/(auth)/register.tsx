import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useRouter, Link } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (error) {
            Alert.alert("Registration Failed", error.message);
            setLoading(false);
        } else {
            Alert.alert("Success", "Account created! Please check your email for verification.");
            router.replace("/(auth)/login");
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
            <View className="flex-1 p-6 justify-center">
                <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
                <Text className="text-gray-500 mb-8">Join the community to fix issues together</Text>

                <View className="mb-8">
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-1">Full Name</Text>
                        <TextInput
                            className="border border-gray-200 rounded-lg p-3"
                            placeholder="Enter your name"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-1">Email</Text>
                        <TextInput
                            className="border border-gray-200 rounded-lg p-3"
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-semibold text-gray-700 mb-1">Password</Text>
                        <TextInput
                            className="border border-gray-200 rounded-lg p-3"
                            placeholder="Enter your password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    className={`bg-blue-600 py-4 rounded-xl items-center ${loading ? 'opacity-70' : ''}`}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-lg font-bold">Register</Text>
                    )}
                </TouchableOpacity>

                <View className="mt-6 flex-row justify-center">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-600 font-bold">Login</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
}
