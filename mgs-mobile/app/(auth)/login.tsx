import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter, Link } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert("Login Failed", error.message);
            setLoading(false);
        } else {
            // RootLayout will handle redirect
        }
    }

    return (
        <View className="flex-1 bg-white p-6 justify-center">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
            <Text className="text-gray-500 mb-8">Login to track your grievances</Text>

            <View className="mb-8">
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
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-lg font-bold">Login</Text>
                )}
            </TouchableOpacity>

            <View className="mt-6 flex-row justify-center">
                <Text className="text-gray-600">Don't have an account? </Text>
                <Link href="/(auth)/register" asChild>
                    <TouchableOpacity>
                        <Text className="text-blue-600 font-bold">Register</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
