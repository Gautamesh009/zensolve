import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, Link } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Mail, Lock, ArrowRight } from "lucide-react-native";

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
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
        >
            <View className="flex-1 p-8 justify-center">
                {/* Branding / Icon */}
                <View className="items-center mb-12">
                    <View className="bg-primary-600 w-20 h-20 rounded-[24px] items-center justify-center shadow-xl shadow-primary-500/40 rotate-12">
                        <ArrowRight size={40} color="white" className="-rotate-12" />
                    </View>
                    <Text className="text-4xl font-black text-surface-900 mt-6 tracking-tighter">ZenSolve</Text>
                    <View className="h-1 w-8 bg-accent rounded-full mt-1" />
                </View>

                <View className="mb-4">
                    <Text className="text-3xl font-bold text-surface-900 mb-2">Welcome back</Text>
                    <Text className="text-surface-900/40 font-medium">Please enter your details to sign in</Text>
                </View>

                <View className="space-y-4 mb-8">
                    <View>
                        <Text className="text-xs font-bold text-surface-900 uppercase tracking-widest mb-2 ml-1 opacity-50">Email Address</Text>
                        <View className="flex-row items-center bg-surface-50 border border-surface-200 rounded-3xl px-4 shadow-sm">
                            <Mail size={20} color="#a1a1aa" />
                            <TextInput
                                className="flex-1 p-4 text-surface-900 font-medium"
                                placeholder="name@example.com"
                                placeholderTextColor="#a1a1aa"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    <View>
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-xs font-bold text-surface-900 uppercase tracking-widest ml-1 opacity-50">Password</Text>
                            <TouchableOpacity>
                                <Text className="text-primary-600 text-xs font-bold">Forgot?</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center bg-surface-50 border border-surface-200 rounded-3xl px-4 shadow-sm">
                            <Lock size={20} color="#a1a1aa" />
                            <TextInput
                                className="flex-1 p-4 text-surface-900 font-medium"
                                placeholder="••••••••"
                                placeholderTextColor="#a1a1aa"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    className={`bg-primary-600 py-6 rounded-[32px] items-center shadow-2xl shadow-primary-500/40 ${loading ? 'opacity-70' : ''}`}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <View className="flex-row items-center">
                            <Text className="text-white text-lg font-bold uppercase tracking-[2px] mr-2">Sign In</Text>
                            <ArrowRight size={20} color="white" />
                        </View>
                    )}
                </TouchableOpacity>

                <View className="mt-10 flex-row justify-center">
                    <Text className="text-surface-900/40 font-bold uppercase text-[10px] tracking-widest">Don't have an account? </Text>
                    <Link href="/(auth)/register" asChild>
                        <TouchableOpacity>
                            <Text className="text-primary-600 font-black uppercase text-[10px] tracking-widest">Create Account</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

