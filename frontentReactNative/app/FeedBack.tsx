import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import { COLORS } from "../constants/theme";
import { useAuthStore } from "@/stores/authstore";
import { BASE_URL } from "@/constants/Api";
import { SafeAreaView } from "react-native-safe-area-context";

const FeedBack = () => {
    const [type, setType] = useState("query"); // query or complaint
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useAuthStore();
    const handleSubmit = async () => {
        if (!message.trim()) {
            Alert.alert("Error", "Please enter your message");
            return;
        }

        setLoading(true);

        try {
            // replace with real token
            const response = await fetch(`${BASE_URL}/api/feedbacks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ type, message }),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Your message has been sent!");
                setMessage("");
                setType("query");
            } else {
                Alert.alert("Error", data.error || "Something went wrong");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Send a Query or Complaint</Text>

            <Text style={styles.label}>Message Type:</Text>
            <View style={styles.typeContainer}>
                <TouchableOpacity
                    style={[
                        styles.typeButton,
                        type === "query" && styles.typeButtonActive,
                    ]}
                    onPress={() => setType("query")}
                >
                    <Text
                        style={[
                            styles.typeText,
                            type === "query" && styles.typeTextActive,
                        ]}
                    >
                        Query
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.typeButton,
                        type === "complaint" && styles.typeButtonActive,
                    ]}
                    onPress={() => setType("complaint")}
                >
                    <Text
                        style={[
                            styles.typeText,
                            type === "complaint" && styles.typeTextActive,
                        ]}
                    >
                        Complaint
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Message:</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Type your message here..."
                multiline
                numberOfLines={5}
                value={message}
                onChangeText={setMessage}
                placeholderTextColor={COLORS.textLight}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Sending..." : "Send"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default FeedBack;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.backgroundLight,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        color: COLORS.text,
        marginBottom: 8,
        marginTop: 12,
    },
    typeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        borderRadius: 10,
        backgroundColor: COLORS.surface,
        alignItems: "center",
    },
    typeButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    typeText: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: "500",
    },
    typeTextActive: {
        color: COLORS.white,
        fontWeight: "bold",
    },
    textInput: {
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
        textAlignVertical: "top",
        marginBottom: 20,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonDisabled: {
        backgroundColor: COLORS.grey,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});
