import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { complaintsApi } from '../shared/api/complaintsApi';

export interface NearbyComplaint {
    id: string;
    title: string;
    description: string;
    distance: string;
    image: string;
}

export function useRewards() {
    const [nearby, setNearby] = useState<NearbyComplaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [validating, setValidating] = useState<string | null>(null);

    const fetchNearby = async () => {
        try {
            setLoading(true);
            // In a real app we'd pass lat/lng to the API
            // For demo, we'll fetch all and maybe local filter or just show what backend returns as "nearby"
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            const loc = await Location.getCurrentPositionAsync({});

            // Placeholder: assuming backend has a nearby endpoint or similar
            // const data = await complaintsApi.getNearby(loc.coords.latitude, loc.coords.longitude);

            // For now, use getMy as a placeholder or mock data if backend not ready
            const data = await complaintsApi.getMy();

            // Mocking the distance for demo
            const nearbyData = data.slice(0, 3).map((c: any) => ({
                ...c,
                distance: `${(Math.random() * 500).toFixed(0)}m away`
            }));

            setNearby(nearbyData);
        } catch (error) {
            console.error("Failed to fetch nearby complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    const validateComplaint = async (id: string) => {
        try {
            setValidating(id);
            await complaintsApi.validate(id);
            setNearby((prev) => prev.filter((c) => c.id !== id));
            return true;
        } catch (error) {
            console.error("Validation failed:", error);
            return false;
        } finally {
            setValidating(null);
        }
    };

    useEffect(() => {
        fetchNearby();
    }, []);

    return { nearby, loading, validating, validateComplaint, refetch: fetchNearby };
}
