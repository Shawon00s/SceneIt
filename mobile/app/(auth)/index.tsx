import {
    View,
    Text,
    Platform,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import styles from "../../assets/styles/login.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { icons } from "../../constants/icons";
import { images } from "../../constants/images";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { user, isLoading, login, token, checkAuth } = useAuthStore() as {
        user: any;
        isLoading: boolean;
        login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
        token: string;
        checkAuth: () => void;
    };

    const router = useRouter();

    // Check if user is already logged in when component mounts
    useEffect(() => {
        checkAuth();
    }, []);

    // Redirect to tabs if user is already logged in
    useEffect(() => {
        if (user && token) {
            router.replace('/(tabs)');
        }
    }, [user, token]);

    const validateForm = () => {
        if (!email.trim()) {
            Alert.alert("Error", "Email is required");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Error", "Please enter a valid email address");
            return false;
        }
        if (!password.trim()) {
            Alert.alert("Error", "Password is required");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            const result = await login(email.trim(), password);

            if (result.success) {
                router.replace('/(tabs)');
            } else {
                Alert.alert("Error", result.error || "Failed to login");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {/* Background Image */}
            <Image source={images.bg} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" />

            <View style={styles.container}>
                <View style={styles.card}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <LinearGradient
                            colors={['#000000', '#333333', '#000000']}
                            style={{
                                borderRadius: 50,
                                padding: 10,
                                marginBottom: 20,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                                alignSelf: 'center',
                            }}
                        >
                            <Image source={icons.logo} style={{ width: 80, height: 60 }} resizeMode="contain" />
                        </LinearGradient>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to SceneIt 🎬</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {/* EMAIL INPUT */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="your.email@example.com"
                                    value={email}
                                    placeholderTextColor={COLORS.placeholderText}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* PASSWORD INPUT */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={COLORS.primary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* LOGIN BUTTON */}
                        <TouchableOpacity
                            style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>

                        {/* FOOTER */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                                <Text style={styles.link}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}