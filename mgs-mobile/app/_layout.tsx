import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../store/authStore";
import "../global.css";

export default function RootLayout() {
    const { session, loading, initialize } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        initialize();
    }, []);

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (!session && !inAuthGroup && segments[0] !== undefined) {
            // Redirect to login if not logged in and not already in auth flow (and not on onboarding)
            router.replace("/(auth)/login");
        } else if (session && inAuthGroup) {
            // Redirect to home if logged in and trying to access auth screens
            router.replace("/(tabs)/home");
        }
    }, [session, loading, segments]);

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    );
}

