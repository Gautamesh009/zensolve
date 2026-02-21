import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import { Camera, MapPin, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { complaintsApi } from "../../shared/api/complaintsApi";
import { CATEGORIES } from "../../shared/constants/categories";

export default function Report() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [address, setAddress] = useState<string>("Detecting location...");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("OTHER");

    useEffect(() => {
        handleGetLocation();
    }, []);

    async function handleGetLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setAddress("Permission denied");
            return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);

        // Reverse geocode
        let reverse = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
        });

        if (reverse.length > 0) {
            const { name, street, city } = reverse[0];
            setAddress(`${name || street}, ${city}`);
        }
    }

    async function handlePickImage() {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    async function handleSubmit() {
        if (!image || !title || !description || !location) {
            Alert.alert("Missing Information", "Please provide a photo, title, and description.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("latitude", location.coords.latitude.toString());
            formData.append("longitude", location.coords.longitude.toString());
            formData.append("address", address);

            // @ts-ignore
            formData.append("image", {
                uri: image,
                type: "image/jpeg",
                name: "complaint.jpg",
            });

            await complaintsApi.submit(formData);

            Alert.alert("Success", "Your grievance has been submitted for AI processing.", [
                { text: "OK", onPress: () => router.replace("/(tabs)/complaints") }
            ]);
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold text-gray-900 mb-6">Report an Issue</Text>

            {image ? (
                <View className="relative mb-6">
                    <Image source={{ uri: image }} className="w-full h-64 rounded-2xl" />
                    <TouchableOpacity
                        className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                        onPress={() => setImage(null)}
                    >
                        <X size={20} color="white" />
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    className="bg-gray-100 h-48 rounded-2xl items-center justify-center border-2 border-dashed border-gray-300 mb-6"
                    onPress={handlePickImage}
                >
                    <Camera size={48} color="#9ca3af" />
                    <Text className="text-gray-500 mt-2 font-medium">Capture Grievance Photo</Text>
                </TouchableOpacity>
            )}

            <View className="bg-blue-50 p-4 rounded-xl flex-row items-center mb-6">
                <MapPin size={20} color="#2563eb" />
                <View className="ml-3 flex-1">
                    <Text className="text-blue-900 font-semibold">Location</Text>
                    <Text className="text-blue-700 text-xs" numberOfLines={1}>{address}</Text>
                </View>
                <TouchableOpacity onPress={handleGetLocation}>
                    <Text className="text-blue-600 text-xs font-bold">Refresh</Text>
                </TouchableOpacity>
            </View>

            <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Subject</Text>
                <TextInput
                    className="border border-gray-200 rounded-lg p-3"
                    placeholder="Short title of the issue"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Detailed Description</Text>
                <TextInput
                    className="border border-gray-200 rounded-lg p-3 h-32"
                    placeholder="Describe the issue in detail..."
                    multiline
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                />
            </View>

            <View className="mb-8">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Category (Initial Selection)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {Object.values(CATEGORIES).map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            className={`mr-2 px-4 py-2 rounded-full border ${category === cat.id ? 'bg-blue-600 border-blue-600' : 'bg-gray-100 border-gray-100'}`}
                            onPress={() => setCategory(cat.id)}
                        >
                            <Text className={category === cat.id ? 'text-white' : 'text-gray-700'}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Text className="text-gray-400 text-[10px] mt-2 italic">
                    * AI will refine the category and priority during processing.
                </Text>
            </View>

            <TouchableOpacity
                className={`bg-blue-600 py-4 rounded-xl items-center mb-10 ${loading ? 'opacity-70' : ''}`}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-lg font-bold">Submit Grievance</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}
