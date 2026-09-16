// app/(tabs)/change-password.tsx
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '@/constants/Api';
import { useAuthStore } from '@/stores/authstore';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function ChangePasswordScreen() {
    const { token, logout } = useAuthStore();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        // التحقق من الحقول
        if (!currentPassword || !newPassword) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirmation do not match');
            Toast.show({
                type: 'error',
                text1: 'must new password equilt confirm Password',
                position: 'top',
                visibilityTime: 2000,
            });
            return;
        }

        if (newPassword.length < 6) {
            // Alert.alert('Error', 'Password must be at least 6 characters');
            Toast.show({
                type: 'error',
                text1: 'must new password equilt confirm Password',
                position: 'top',
                visibilityTime: 2000,
            });
            return;
        }

        if (!token) {
            Alert.alert('Error', 'You must be logged in');
            Toast.show({
                type: 'error',
                text1: 'must new password equilt confirm Password',
                position: 'top',
                visibilityTime: 2000,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/auth/changePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            // تسجيل الخروج بعد تغيير كلمة المرور (لأن التوكن القديم لم يعد صالحًا)
            Alert.alert('Success', data.message, [
                {
                    text: 'OK',
                    onPress: () => {
                        logout();
                        router.replace('/(auth)/login'); // إعادة التوجيه إلى صفحة الدخول
                    },
                },
            ]);

        } catch (error: any) {
            console.error('Change password error:', error);
            Alert.alert('Error', error.message || 'Could not change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Change Password</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.formContainer}
            >
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Current Password</Text>
                    <TextInput
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry
                        placeholder="Enter current password"
                        placeholderTextColor={COLORS.grey}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                        placeholder="Enter new password"
                        placeholderTextColor={COLORS.grey}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Confirm New Password</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        placeholder="Confirm new password"
                        placeholderTextColor={COLORS.grey}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.disabledButton]}
                    onPress={handleChangePassword}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Changing...' : 'Change Password'}
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
    },
    formContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    inputWrapper: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});