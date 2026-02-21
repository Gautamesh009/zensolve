import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import { Camera, MapPin, X, Info } from "lucide-react-native";
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

        try {
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);

            let reverse = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
            });

            if (reverse.length > 0) {
                const { name, street, city } = reverse[0];
                setAddress(`${name || street || ''}, ${city || ''}`.replace(/^, /, ''));
            }
        } catch (e) {
            setAddress("Location unavailable");
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
        <ScrollView className="flex-1 bg-surface-50" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="px-6 pt-12 pb-6 bg-white border-b border-surface-200">
                <Text className="text-3xl font-bold text-surface-900">Report Issue</Text>
                <Text className="text-surface-900/50 text-sm">Fill in the details to submit your report</Text>
            </View>

            <View className="p-6">
                {/* Image Section */}
                <View className="mb-8">
                    <Text className="text-sm font-bold text-surface-900 uppercase tracking-widest mb-3">Evidence Photo</Text>
                    {image ? (
                        <View className="relative">
                            <Image source={{ uri: image }} className="w-full h-64 rounded-3xl" />
                            <TouchableOpacity
                                className="absolute top-4 right-4 bg-black/60 p-2 rounded-full shadow-lg"
                                onPress={() => setImage(null)}
                            >
                                <X size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            className="bg-white h-52 rounded-3xl items-center justify-center border-2 border-dashed border-primary-200 shadow-sm"
                            onPress={handlePickImage}
                        >
                            <View className="bg-primary-50 p-4 rounded-full mb-3">
                                <Camera size={32} color="#2563eb" />
                            </View>
                            <Text className="text-primary-600 font-bold">Capture Grievance Photo</Text>
                            <Text className="text-surface-900/30 text-xs mt-1">Image will be used for AI verification</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Location Banner */}
                <View className="bg-white p-4 rounded-3xl border border-surface-200 flex-row items-center mb-8 shadow-sm">
                    <View className="bg-primary-500 p-2.5 rounded-2xl mr-4">
                        <MapPin size={20} color="white" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-surface-900 font-bold text-xs uppercase opacity-40">Issue Location</Text>
                        <Text className="text-surface-900 font-bold text-sm" numberOfLines={1}>{address}</Text>
                    </View>
                    <TouchableOpacity onPress={handleGetLocation} className="bg-surface-50 px-4 py-2 rounded-xl">
                        <Text className="text-primary-600 font-bold text-xs">Verify</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View className="space-y-6">
                    <View>
                        <Text className="text-sm font-bold text-surface-900 uppercase tracking-widest mb-2 ml-1">Subject</Text>
                        <TextInput
                            className="bg-white border border-surface-200 rounded-2xl p-4 text-surface-900 shadow-sm focus:border-primary-500"
                            placeholder="What's the issue?"
                            placeholderTextColor="#a1a1aa"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-bold text-surface-900 uppercase tracking-widest mb-2 ml-1">Description</Text>
                        <TextInput
                            className="bg-white border border-surface-200 rounded-2xl p-4 h-32 text-surface-900 shadow-sm focus:border-primary-500"
                            placeholder="Provide more context for faster resolution..."
                            placeholderTextColor="#a1a1aa"
                            multiline
                            textAlignVertical="top"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <View>
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-sm font-bold text-surface-900 uppercase tracking-widest ml-1">Category</Text>
                            <View className="flex-row items-center bg-blue-50 px-3 py-1 rounded-full">
                                <Info size={12} color="#2563eb" />
                                <Text className="text-primary-600 text-[10px] font-bold ml-1">AI Verified</Text>
                            </View>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row pb-2">
                            {Object.values(CATEGORIES).map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    className={`mr-3 px-6 py-3 rounded-2xl border ${category === cat.id ? 'bg-primary-600 border-primary-600 shadow-md shadow-primary-500/30' : 'bg-white border-surface-200 shadow-sm'}`}
                                    onPress={() => setCategory(cat.id)}
                                >
                                    <Text className={`font-bold ${category === cat.id ? 'text-white' : 'text-surface-900/60'}`}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className={`mt-10 bg-primary-600 py-5 rounded-3xl items-center shadow-xl shadow-primary-500/40 ${loading ? 'opacity-70' : ''}`}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-lg font-bold uppercase tracking-[2px]">Submit Grievance</Text>
                    )}
                </TouchableOpacity>
                <Text className="text-center text-surface-900/30 text-[10px] mt-6 font-bold uppercase mb-12">
                    Powered by Google Gemini 1.5 Flash
                </Text>
            </View>
        </ScrollView>
    );
}

