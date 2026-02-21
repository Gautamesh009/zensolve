import { useState, useEffect } from 'react';
import { complaintsApi } from '../shared/api/complaintsApi';
import { socketClient } from '../shared/socket/socketClient';
import { useAuthStore } from '../store/authStore';

export interface Complaint {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    category: string;
    priority: number;
    imageUrl?: string;
    address?: string;
}


export function useComplaints() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const data = await complaintsApi.getMy();
            setComplaints(data);
        } catch (error) {
            console.error("Failed to fetch complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;

        fetchComplaints();

        // Connect socket and listen for updates
        socketClient.connect();

        // Join a personal room for updates related to this user's complaints
        // In a real app, we might join rooms for specific complaint IDs

        socketClient.on("complaint-updated", (updatedComplaint: Complaint) => {
            setComplaints((prev) =>
                prev.map((c) => c.id === updatedComplaint.id ? { ...c, ...updatedComplaint } : (c as Complaint))
            );
        });

        return () => {
            socketClient.off("complaint-updated");
        };
    }, [user]);

    return { complaints, loading, refetch: fetchComplaints };
}
