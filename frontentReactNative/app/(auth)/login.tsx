// import { COLORS } from "@/constants/theme";
// import { styles } from "@/styles/auth.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import {
//   Image,
//   Text,
//   TouchableOpacity,
//   View,
//   TextInput,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   ImageBackground,
//   StatusBar
// } from "react-native";
// import { useLogin, useRegister } from "@/hook/useAuth";
// import { useState } from "react";
// import { useAuthStore } from "@/stores/authstore";
// import Toast from 'react-native-toast-message';

// export default function Login() {
//   const router = useRouter();
//   const { login: setAuth } = useAuthStore();

//   const { mutate: login, isPending: isLoggingIn } = useLogin();
//   const { mutate: register, isPending: isRegistering } = useRegister();

//   const [isLoginMode, setIsLoginMode] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!isLoginMode && !formData.name.trim()) {
//       newErrors.name = 'Full name is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (!isLoginMode && formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);

//     // Show Toast for first error if exists
//     const firstError = Object.values(newErrors)[0];
//     if (firstError) {
//       Toast.show({
//         type: 'error',
//         text1: 'Validation Error',
//         text2: firstError,
//         position: 'top',
//         visibilityTime: 2000,
//       });
//     }

//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => { 
//     if (!validateForm()) return;

//   // داخل دالة handleSubmit

// if (isLoginMode) {
//   // Login
//   login({
//     email: formData.email,
//     password: formData.password
//   }, {
//     onSuccess: (data) => {
//       // ✅ تحويل _id إلى id إذا لزم (لتوحيد الهيكل)
//       const userForStore = {
//         id: data.user._id || data.user.id, // يدعم كلا الحالتين
//         name: data.user.name,
//         email: data.user.email,
//         role: data.user.role,
//         avatar: data.user.avatar || undefined,
//         avatarUrl: data.user.avatarUrl || undefined,
//         bio: data.user.bio || undefined,
//       };

//       setAuth(userForStore, data.token);
//       Toast.show({
//         type: 'success',
//         text1: 'Login Successful 🎉',
//         text2: `Welcome back, ${data.user.name}!`,
//         position: 'top',
//         visibilityTime: 2000,
//       });
//       router.replace("/(tabs)");
//     },
//     onError: (error: any) => {
//       Toast.show({
//         type: 'error',
//         text1: 'Login Failed',
//         text2: error.message,
//         position: 'top',
//         visibilityTime: 2000,
//       });
//     }
//   });
// } else {
//   // Register
//   register({
//     name: formData.name,
//     email: formData.email,
//     password: formData.password,
//     role: 'client'
//   }, {
//     onSuccess: (data) => {
//       // ✅ نفس التحويل هنا
//       const userForStore = {
//         id: data.user._id || data.user.id,
//         name: data.user.name,
//         email: data.user.email,
//         role: data.user.role,
//         avatar: data.user.avatar || undefined,
//         avatarUrl: data.user.avatarUrl || undefined,
//         bio: data.user.bio || undefined,
//       };

//       setAuth(userForStore, data.token);
//       Toast.show({
//         type: 'success',
//         text1: 'Account Created Successfully 🎊',
//         text2: `Welcome to AgriPlant, ${data.user.name}!`,
//         position: 'top',
//         visibilityTime: 2000,
//       });
//       router.replace("/(tabs)");
//     },
//     onError: (error: any) => {
//       Toast.show({
//         type: 'error',
//         text1: 'Registration Failed',
//         text2: error.message,
//         position: 'top',
//         visibilityTime: 2000,
//       });
//     }
//   });
// }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const toggleMode = () => {
//     setIsLoginMode(!isLoginMode);
//     setErrors({});
//     setFormData({
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: ''
//     });

//     // Show message when switching mode
//     Toast.show({
//       type: 'info',
//       text1: !isLoginMode ? 'Login Mode' : 'Sign Up Mode',
//       text2: !isLoginMode ? 'Sign in to your account' : 'Create a new account',
//       position: 'top',
//       visibilityTime: 2000,
//     });
//   };

//   const handleForgotPassword = () => {
//     Toast.show({
//       type: 'info',
//       text1: 'Forgot Password',
//       text2: 'This feature will be added soon',
//       position: 'top',
//       visibilityTime: 2000,
//     });
//   };

//   const isFormValid = () => {
//     if (isLoginMode) {
//       return formData.email.trim() && formData.password.trim();
//     } else {
//       return formData.name.trim() &&
//         formData.email.trim() &&
//         formData.password.trim() &&
//         formData.confirmPassword.trim() &&
//         formData.password === formData.confirmPassword;
//     }
//   };

//   const isPending = isLoggingIn || isRegistering;

//   return (
//     <>
//       <StatusBar 
//         barStyle="light-content" 
//         backgroundColor="transparent" 
//         translucent 
//       />
//       <ImageBackground
//         source={require('@/assets/images/loginbackground.jpg')}
//         style={styles.backgroundImage}
//         resizeMode="cover"
//       >
//         <KeyboardAvoidingView
//           style={styles.keyboardAvoidingView}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//             <ScrollView
//               style={styles.container}
//               contentContainerStyle={styles.scrollViewContent}
//               showsVerticalScrollIndicator={false}
//             >
//               <View style={styles.illustrationContainer}>
//                 <Image
//                   source={require("../../assets/images/logo.png")}
//                   style={styles.illustration}
//                   resizeMode="contain"
//                 />
//               </View>

//               {/* BRAND SECTION */}
//               <View style={styles.brandSection}>
//                 <Text style={styles.appName}>AgriPlant</Text>
//                 <Text style={styles.tagline}>Don't miss anything</Text>
//               </View>

//               {/* LOGIN SECTION */}
//               <View style={styles.loginSection}>
//                 <Text style={styles.sectionTitle}>
//                   {isLoginMode ? 'Welcome Back' : 'Create Account'}
//                 </Text>

//                 {/* Name Field (Sign Up only) */}
//                 {!isLoginMode && (
//                   <View style={styles.inputContainer}>
//                     <Text style={styles.inputLabel}>Full Name</Text>
//                     <TextInput
//                       style={[
//                         styles.input,
//                         focusedField === 'name' && styles.focusedInput,
//                         errors.name && styles.inputError
//                       ]}
//                       placeholder="Enter your full name"
//                       placeholderTextColor={COLORS.textLight}
//                       value={formData.name}
//                       onChangeText={(text) => handleInputChange('name', text)}
//                       onFocus={() => setFocusedField('name')}
//                       onBlur={() => setFocusedField(null)}
//                       autoCapitalize="words"
//                     />
//                     {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
//                   </View>
//                 )}

//                 {/* Email Field */}
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.inputLabel}>Email Address</Text>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       focusedField === 'email' && styles.focusedInput,
//                       errors.email && styles.inputError
//                     ]}
//                     placeholder="Enter your email"
//                     placeholderTextColor={COLORS.textLight}
//                     value={formData.email}
//                     onChangeText={(text) => handleInputChange('email', text)}
//                     onFocus={() => setFocusedField('email')}
//                     onBlur={() => setFocusedField(null)}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     autoComplete="email"
//                   />
//                   {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//                 </View>

//                 {/* Password Field */}
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.inputLabel}>Password</Text>
//                   <View style={styles.passwordContainer}>
//                     <TextInput
//                       style={[
//                         styles.passwordInput,
//                         focusedField === 'password' && styles.focusedInput,
//                         errors.password && styles.inputError,
//                       ]}
//                       placeholder="Enter your password"
//                       placeholderTextColor={COLORS.textLight}
//                       value={formData.password}
//                       onChangeText={(text) => handleInputChange('password', text)}
//                       onFocus={() => setFocusedField('password')}
//                       onBlur={() => setFocusedField(null)}
//                       secureTextEntry={!showPassword}
//                       autoComplete="password"
//                     />
//                     <TouchableOpacity
//                       style={styles.eyeIcon}
//                       onPress={() => setShowPassword(!showPassword)}
//                     >
//                       <Ionicons
//                         name={showPassword ? "eye-off" : "eye"}
//                         size={20}
//                         color={COLORS.textLight}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                   {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
//                 </View>

//                 {/* Confirm Password Field (Sign Up only) */}
//                 {!isLoginMode && (
//                   <View style={styles.inputContainer}>
//                     <Text style={styles.inputLabel}>Confirm Password</Text>
//                     <View style={styles.passwordContainer}>
//                       <TextInput
//                         style={[
//                           styles.passwordInput,
//                           focusedField === 'confirmPassword' && styles.focusedInput,
//                           errors.confirmPassword && styles.inputError
//                         ]}
//                         placeholder="Confirm your password"
//                         placeholderTextColor={COLORS.textLight}
//                         value={formData.confirmPassword}
//                         onChangeText={(text) => handleInputChange('confirmPassword', text)}
//                         onFocus={() => setFocusedField('confirmPassword')}
//                         onBlur={() => setFocusedField(null)}
//                         secureTextEntry={!showConfirmPassword}
//                         autoComplete="password"
//                       />
//                       <TouchableOpacity
//                         style={styles.eyeIcon}
//                         onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                       >
//                         <Ionicons
//                           name={showConfirmPassword ? "eye-off" : "eye"}
//                           size={20}
//                           color={COLORS.textLight}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                     {errors.confirmPassword && (
//                       <Text style={styles.errorText}>{errors.confirmPassword}</Text>
//                     )}
//                   </View>
//                 )}

//                 {/* Submit Button */}
//                 <TouchableOpacity
//                   style={[
//                     styles.loginButton,
//                     (!isFormValid() || isPending) && styles.loginButtonDisabled
//                   ]}
//                   onPress={handleSubmit}
//                   disabled={!isFormValid() || isPending}
//                   activeOpacity={0.9}
//                 >
//                   {isPending ? (
//                     <Ionicons
//                       name="refresh"
//                       size={20}
//                       color={COLORS.surface}
//                     />
//                   ) : (
//                     <Ionicons
//                       name={isLoginMode ? "log-in" : "person-add"}
//                       size={20}
//                       color={COLORS.surface}
//                     />
//                   )}
//                   <Text style={styles.loginButtonText}>
//                     {isPending ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
//                   </Text>
//                 </TouchableOpacity>

//                 {/* Mode Toggle */}
//                 <View style={styles.linksContainer}>
//                   <TouchableOpacity onPress={toggleMode}>
//                     <Text style={styles.linkText}>
//                       {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
//                     </Text>
//                   </TouchableOpacity>

//                   {isLoginMode && (
//                     <TouchableOpacity onPress={handleForgotPassword}>
//                       <Text style={styles.linkText}>Forgot Password?</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>

//                 <Text style={styles.termsText}>
//                   By continuing, you agree to our Terms of Service and Privacy Policy
//                 </Text>
//               </View>
//             </ScrollView>
//           </TouchableWithoutFeedback>
//         </KeyboardAvoidingView>
//       </ImageBackground>

//       {/* Toast Component */}
//       <Toast position="top" />
//     </>
//   );
// }
// import { COLORS } from "@/constants/theme";
// import { styles } from "@/styles/auth.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import {
//   Image,
//   Text,
//   TouchableOpacity,
//   View,
//   TextInput,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   ImageBackground,
//   StatusBar
// } from "react-native";
// import { useLogin, useRegister } from "@/hook/useAuth"; // ⚠️ تأكد من كتابة "hooks" وليس "hook"
// import { useState } from "react";
// import { useAuthStore } from "@/stores/authstore"; // ⚠️ تأكد من كتابة "authStore" وليس "authstore"
// import Toast from 'react-native-toast-message';

// export default function Login() {
//   const router = useRouter();
//   const { login: setAuth } = useAuthStore();

//   const { mutate: login, isPending: isLoggingIn } = useLogin();
//   const { mutate: register, isPending: isRegistering } = useRegister();

//   const [isLoginMode, setIsLoginMode] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!isLoginMode && !formData.name.trim()) {
//       newErrors.name = 'Full name is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (!isLoginMode && formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);

//     const firstError = Object.values(newErrors)[0];
//     if (firstError) {
//       Toast.show({
//         type: 'error',
//         text1: 'Validation Error',
//         text2: firstError,
//         position: 'top',
//         visibilityTime: 2000,
//       });
//     }

//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = () => { 
//     if (!validateForm()) return;

//     if (isLoginMode) {
//       // Login
//       login({
//         email: formData.email,
//         password: formData.password
//       }, {
//         onSuccess: (data) => {
//           // ✅ توحيد هيكل المستخدم ليناسب Zustand
//           const userForStore = {
//             id: data.user.id || data.user.id,
//             name: data.user.name,
//             email: data.user.email,
//             role: data.user.role,
//             avatar: data.user.avatar || undefined,
//             avatarUrl: data.user.avatarUrl || undefined,
//             bio: data.user.bio || undefined,
//           };

//           setAuth(userForStore, data.token);
//           Toast.show({
//             type: 'success',
//             text1: 'Login Successful 🎉',
//             text2: `Welcome back, ${data.user.name}!`,
//             position: 'top',
//             visibilityTime: 2000,
//           });
//           router.replace("/(tabs)");
//         },
//         onError: (error: any) => {
//           Toast.show({
//             type: 'error',
//             text1: 'Login Failed',
//             text2: error.message,
//             position: 'top',
//             visibilityTime: 2000,
//           });
//         }
//       });
//     } else {
//       // Register (role: client by default)
//       register({
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         role: 'client'
//       }, {
//         onSuccess: (data) => {
//           // ✅ نفس التوحيد هنا
//           const userForStore = {
//             id: data.user.id || data.user.id,
//             name: data.user.name,
//             email: data.user.email,
//             role: data.user.role,
//             avatar: data.user.avatar || undefined,
//             avatarUrl: data.user.avatarUrl || undefined,
//             bio: data.user.bio || undefined,
//           };

//           setAuth(userForStore, data.token);
//           Toast.show({
//             type: 'success',
//             text1: 'Account Created Successfully 🎊',
//             text2: `Welcome to AgriPlant, ${data.user.name}!`,
//             position: 'top',
//             visibilityTime: 2000,
//           });
//           router.replace("/(tabs)");
//         },
//         onError: (error: any) => {
//           Toast.show({
//             type: 'error',
//             text1: 'Registration Failed',
//             text2: error.message,
//             position: 'top',
//             visibilityTime: 2000,
//           });
//         }
//       });
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   const toggleMode = () => {
//     setIsLoginMode(!isLoginMode);
//     setErrors({});
//     setFormData({
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: ''
//     });

//     Toast.show({
//       type: 'info',
//       text1: !isLoginMode ? 'Login Mode' : 'Sign Up Mode',
//       text2: !isLoginMode ? 'Sign in to your account' : 'Create a new account',
//       position: 'top',
//       visibilityTime: 2000,
//     });
//   };

//   const handleForgotPassword = () => {
//     Toast.show({
//       type: 'info',
//       text1: 'Forgot Password',
//       text2: 'This feature will be added soon',
//       position: 'top',
//       visibilityTime: 2000,
//     });
//   };

//   const isFormValid = () => {
//     if (isLoginMode) {
//       return formData.email.trim() && formData.password.trim();
//     } else {
//       return (
//         formData.name.trim() &&
//         formData.email.trim() &&
//         formData.password.trim() &&
//         formData.confirmPassword.trim() &&
//         formData.password === formData.confirmPassword
//       );
//     }
//   };

//   const isPending = isLoggingIn || isRegistering;

//   return (
//     <>
//       <StatusBar 
//         barStyle="light-content" 
//         backgroundColor="transparent" 
//         translucent 
//       />
//       <ImageBackground
//         source={require('@/assets/images/loginbackground.jpg')}
//         style={styles.backgroundImage}
//         resizeMode="cover"
//       >
//         <KeyboardAvoidingView
//           style={styles.keyboardAvoidingView}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//             <ScrollView
//               style={styles.container}
//               contentContainerStyle={styles.scrollViewContent}
//               showsVerticalScrollIndicator={false}
//             >
//               <View style={styles.illustrationContainer}>
//                 <Image
//                   source={require("../../assets/images/logo.png")}
//                   style={styles.illustration}
//                   resizeMode="contain"
//                 />
//               </View>

//               <View style={styles.brandSection}>
//                 <Text style={styles.appName}>AgriPlant</Text>
//                 <Text style={styles.tagline}>Don't miss anything</Text>
//               </View>

//               <View style={styles.loginSection}>
//                 <Text style={styles.sectionTitle}>
//                   {isLoginMode ? 'Welcome Back' : 'Create Account'}
//                 </Text>

//                 {!isLoginMode && (
//                   <View style={styles.inputContainer}>
//                     <Text style={styles.inputLabel}>Full Name</Text>
//                     <TextInput
//                       style={[
//                         styles.input,
//                         focusedField === 'name' && styles.focusedInput,
//                         errors.name && styles.inputError
//                       ]}
//                       placeholder="Enter your full name"
//                       placeholderTextColor={COLORS.textLight}
//                       value={formData.name}
//                       onChangeText={(text) => handleInputChange('name', text)}
//                       onFocus={() => setFocusedField('name')}
//                       onBlur={() => setFocusedField(null)}
//                       autoCapitalize="words"
//                     />
//                     {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
//                   </View>
//                 )}

//                 <View style={styles.inputContainer}>
//                   <Text style={styles.inputLabel}>Email Address</Text>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       focusedField === 'email' && styles.focusedInput,
//                       errors.email && styles.inputError
//                     ]}
//                     placeholder="Enter your email"
//                     placeholderTextColor={COLORS.textLight}
//                     value={formData.email}
//                     onChangeText={(text) => handleInputChange('email', text)}
//                     onFocus={() => setFocusedField('email')}
//                     onBlur={() => setFocusedField(null)}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     autoComplete="email"
//                   />
//                   {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//                 </View>

//                 <View style={styles.inputContainer}>
//                   <Text style={styles.inputLabel}>Password</Text>
//                   <View style={styles.passwordContainer}>
//                     <TextInput
//                       style={[
//                         styles.passwordInput,
//                         focusedField === 'password' && styles.focusedInput,
//                         errors.password && styles.inputError,
//                       ]}
//                       placeholder="Enter your password"
//                       placeholderTextColor={COLORS.textLight}
//                       value={formData.password}
//                       onChangeText={(text) => handleInputChange('password', text)}
//                       onFocus={() => setFocusedField('password')}
//                       onBlur={() => setFocusedField(null)}
//                       secureTextEntry={!showPassword}
//                       autoComplete="password"
//                     />
//                     <TouchableOpacity
//                       style={styles.eyeIcon}
//                       onPress={() => setShowPassword(!showPassword)}
//                     >
//                       <Ionicons
//                         name={showPassword ? "eye-off" : "eye"}
//                         size={20}
//                         color={COLORS.textLight}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                   {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
//                 </View>

//                 {!isLoginMode && (
//                   <View style={styles.inputContainer}>
//                     <Text style={styles.inputLabel}>Confirm Password</Text>
//                     <View style={styles.passwordContainer}>
//                       <TextInput
//                         style={[
//                           styles.passwordInput,
//                           focusedField === 'confirmPassword' && styles.focusedInput,
//                           errors.confirmPassword && styles.inputError
//                         ]}
//                         placeholder="Confirm your password"
//                         placeholderTextColor={COLORS.textLight}
//                         value={formData.confirmPassword}
//                         onChangeText={(text) => handleInputChange('confirmPassword', text)}
//                         onFocus={() => setFocusedField('confirmPassword')}
//                         onBlur={() => setFocusedField(null)}
//                         secureTextEntry={!showConfirmPassword}
//                         autoComplete="password"
//                       />
//                       <TouchableOpacity
//                         style={styles.eyeIcon}
//                         onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                       >
//                         <Ionicons
//                           name={showConfirmPassword ? "eye-off" : "eye"}
//                           size={20}
//                           color={COLORS.textLight}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                     {errors.confirmPassword && (
//                       <Text style={styles.errorText}>{errors.confirmPassword}</Text>
//                     )}
//                   </View>
//                 )}

//                 <TouchableOpacity
//                   style={[
//                     styles.loginButton,
//                     (!isFormValid() || isPending) && styles.loginButtonDisabled
//                   ]}
//                   onPress={handleSubmit}
//                   disabled={!isFormValid() || isPending}
//                   activeOpacity={0.9}
//                 >
//                   {isPending ? (
//                     <Ionicons
//                       name="refresh"
//                       size={20}
//                       color={COLORS.surface}
//                     />
//                   ) : (
//                     <Ionicons
//                       name={isLoginMode ? "log-in" : "person-add"}
//                       size={20}
//                       color={COLORS.surface}
//                     />
//                   )}
//                   <Text style={styles.loginButtonText}>
//                     {isPending ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Create Account')}
//                   </Text>
//                 </TouchableOpacity>

//                 <View style={styles.linksContainer}>
//                   <TouchableOpacity onPress={toggleMode}>
//                     <Text style={styles.linkText}>
//                       {isLoginMode ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
//                     </Text>
//                   </TouchableOpacity>

//                   {isLoginMode && (
//                     <TouchableOpacity onPress={handleForgotPassword}>
//                       <Text style={styles.linkText}>Forgot Password?</Text>
//                     </TouchableOpacity>
//                   )}
//                 </View>

//                 <Text style={styles.termsText}>
//                   By continuing, you agree to our Terms of Service and Privacy Policy
//                 </Text>
//               </View>
//             </ScrollView>
//           </TouchableWithoutFeedback>
//         </KeyboardAvoidingView>
//       </ImageBackground>

//       <Toast />
//     </>
//   );
// }
// import { COLORS } from "@/constants/theme";
// import { styles } from "@/styles/auth.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import {
//   Image,
//   Text,
//   TouchableOpacity,
//   View,
//   TextInput,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   ImageBackground,
//   StatusBar
// } from "react-native";
// import { useLogin, useRegister } from "@/hook/useAuth";
// import { useState } from "react";
// import { useAuthStore } from "@/stores/authstore";
// import Toast from 'react-native-toast-message';

// export default function Login() {

//   const router = useRouter();
//   const { login: setAuth } = useAuthStore();
//   const { mutate: login, isPending: isLoggingIn } = useLogin();
//   const { mutate: register, isPending: isRegistering } = useRegister();

//   const [isLoginMode, setIsLoginMode] = useState(true);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });

//   const isPending = isLoggingIn || isRegistering;

//   const handleSubmit = () => {
//     if (isLoginMode) {
//       login(
//         { email: formData.email, password: formData.password },
//         {
//           onSuccess: (data) => {
//             setAuth(data.user, data.token);
//             router.replace("/(tabs)");
//           }
//         }
//       );
//     } else {
//       register(
//         { 
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//           role: "client"
//         },
//         {
//           onSuccess: (data) => {
//             setAuth(data.user, data.token);
//             router.replace("/(tabs)");
//           }
//         }
//       );
//     }
//   };

//   return (
//     <>
//       <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

//       <ImageBackground
//         source={require('@/assets/images/loginbackground.jpg')}
//         style={{ flex: 1 }}
//       >
//         <KeyboardAvoidingView
//           style={{ flex: 1 }}
//           behavior={Platform.OS === "ios" ? "padding" : undefined}
//         >
//           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//             <ScrollView
//               contentContainerStyle={{
//                 paddingHorizontal: 20,
//                 paddingTop: 80,
//                 paddingBottom: 60,
//                 justifyContent: "center",
//                 minHeight: "100%",
//                 backgroundColor: "rgba(0,0,0,0.25)"
//               }}
//               showsVerticalScrollIndicator={false}
//             >

//               {/* APP LOGO */}
//               <View style={{ alignItems: "center", marginBottom: 30 }}>
//                 <Image
//                   source={require("@/assets/images/logo.png")}
//                   style={{ width: 120, height: 110 }}
//                   resizeMode="contain"
//                 />
//                 <Text style={{
//                   marginTop: 10,
//                   fontSize: 32,
//                   fontWeight: "bold",
//                   color: COLORS.surface
//                 }}>
//                   AgriPlant
//                 </Text>
//                 <Text style={{ color: COLORS.surface, opacity: 0.8 }}>
//                   Don't miss anything
//                 </Text>
//               </View>

//               {/* WHITE FORM CARD */}
//               <View style={{
//                 backgroundColor: COLORS.surface,
//                 padding: 20,
//                 borderRadius: 20,
//                 shadowColor: "#000",
//                 shadowOpacity: 0.2,
//                 shadowRadius: 8,
//                 elevation: 4
//               }}>

//                 <Text style={{
//                   fontSize: 24,
//                   fontWeight: "bold",
//                   color: COLORS.primary,
//                   textAlign: "center",
//                   marginBottom: 20
//                 }}>
//                   {isLoginMode ? "Welcome Back" : "Create Account"}
//                 </Text>

//                 {/* FULL NAME (Signup only) */}
//                 {!isLoginMode && (
//                   <View style={{ marginBottom: 15 }}>
//                     <Text style={styles.inputLabel}>Full Name</Text>
//                     <TextInput
//                       placeholder="Enter your full name"
//                       placeholderTextColor="#999"
//                       style={styles.input}
//                       value={formData.name}
//                       onChangeText={(t) => setFormData({ ...formData, name: t })}
//                     />
//                   </View>
//                 )}

//                 {/* EMAIL */}
//                 <View style={{ marginBottom: 15 }}>
//                   <Text style={styles.inputLabel}>Email Address</Text>
//                   <TextInput
//                     placeholder="Enter your email"
//                     placeholderTextColor="#999"
//                     style={styles.input}
//                     value={formData.email}
//                     onChangeText={(t) => setFormData({ ...formData, email: t })}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                   />
//                 </View>

//                 {/* PASSWORD */}
//                 <View style={{ marginBottom: 15 }}>
//                   <Text style={styles.inputLabel}>Password</Text>
//                   <TextInput
//                     placeholder="Enter your password"
//                     placeholderTextColor="#999"
//                     style={styles.input}
//                     secureTextEntry
//                     value={formData.password}
//                     onChangeText={(t) => setFormData({ ...formData, password: t })}
//                   />
//                 </View>

//                 {/* CONFIRM PASSWORD */}
//                 {!isLoginMode && (
//                   <View style={{ marginBottom: 15 }}>
//                     <Text style={styles.inputLabel}>Confirm Password</Text>
//                     <TextInput
//                       placeholder="Confirm your password"
//                       placeholderTextColor="#999"
//                       style={styles.input}
//                       secureTextEntry
//                       value={formData.confirmPassword}
//                       onChangeText={(t) =>
//                         setFormData({ ...formData, confirmPassword: t })
//                       }
//                     />
//                   </View>
//                 )}

//                 {/* BUTTON */}
//                 <TouchableOpacity
//                   onPress={handleSubmit}
//                   style={{
//                     backgroundColor: COLORS.primary,
//                     paddingVertical: 15,
//                     borderRadius: 12,
//                     alignItems: "center",
//                     marginTop: 10
//                   }}
//                   disabled={isPending}
//                 >
//                   <Text style={{ color: COLORS.surface, fontSize: 16, fontWeight: "600" }}>
//                     {isPending ? "Processing..." : isLoginMode ? "Sign In" : "Create Account"}
//                   </Text>
//                 </TouchableOpacity>

//                 {/* SWITCH MODE */}
//                 <TouchableOpacity
//                   onPress={() => setIsLoginMode(!isLoginMode)}
//                   style={{ marginTop: 20, alignItems: "center" }}
//                 >
//                   <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
//                     {isLoginMode
//                       ? "Don't have an account? Sign Up"
//                       : "Already have an account? Sign In"}
//                   </Text>
//                 </TouchableOpacity>

//               </View>

//             </ScrollView>
//           </TouchableWithoutFeedback>
//         </KeyboardAvoidingView>
//       </ImageBackground>

//       <Toast/>
//     </>
//   );
// }

import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  StatusBar
} from "react-native";
import { useLogin, useRegister } from "@/hook/useAuth";
import { useState } from "react";
import { useAuthStore } from "@/stores/authstore";
import Toast from 'react-native-toast-message';

export default function Login() {
  const router = useRouter();
  const { login: setAuth } = useAuthStore();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: register, isPending: isRegistering } = useRegister();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!isLoginMode && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    const firstError = Object.values(newErrors)[0];
    if (firstError) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: firstError,
        position: 'top',
        visibilityTime: 2000,
      });
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isLoginMode) {
      login(
        { email: formData.email, password: formData.password },
        {
          onSuccess: (data) => {
            const userForStore = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              avatar: data.user.avatar || undefined,
              avatarUrl: data.user.avatarUrl || undefined,
              bio: data.user.bio || undefined,
              followersCount: data.user.followersCount,
              followingCount: data.user.followingCount,
              postsCount: data.user.postsCount
              // followersCount:data.||undefined,
            };
            setAuth(userForStore, data.token);
            Toast.show({
              type: 'success',
              text1: 'Login Successful 🎉',
              text2: `Welcome back, ${data.user.name}!`,
              position: 'top',
              visibilityTime: 2000,
            });
            if (data.user.role == 'staff' || data.user.role == 'admin') {
              router.replace("/(admin)/post")
            } else if (data.user.role == 'client' || data.user.role == 'company') {
              router.replace('/(tabs)')
            }

            // router.replace("/(tabs)");
          },
          onError: (error: any) => {
            Toast.show({
              type: 'error',
              text1: 'Login Failed',
              text2: error.message || 'An error occurred during login',
              position: 'top',
              visibilityTime: 2000,
            });
          }
        }
      );
    } else {
      register(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "client"
        },
        {
          onSuccess: (data) => {
            const userForStore = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              avatar: data.user.avatar || undefined,
              avatarUrl: data.user.avatarUrl || undefined,
              bio: data.user.bio || undefined,
              followersCount: data.user.followersCount,
              followingCount: data.user.followingCount,
              postsCount: data.user.postsCount
            };
            setAuth(userForStore, data.token);
            Toast.show({
              type: 'success',
              text1: 'Account Created Successfully 🎊',
              text2: `Welcome to AgriPlant, ${data.user.name}!`,
              position: 'top',
              visibilityTime: 2000,
            });
            router.replace("/(tabs)");
          },
          onError: (error: any) => {
            Toast.show({
              type: 'error',
              text1: 'Registration Failed',
              text2: error.message || 'An error occurred during registration',
              position: 'top',
              visibilityTime: 2000,
            });
          }
        }
      );
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrors({});
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const isFormValid = () => {
    if (isLoginMode) {
      return formData.email.trim() && formData.password.trim();
    } else {
      return (
        formData.name.trim() &&
        formData.email.trim() &&
        formData.password.trim() &&
        formData.confirmPassword.trim() &&
        formData.password === formData.confirmPassword
      );
    }
  };

  const isPending = isLoggingIn || isRegistering;

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={require('@/assets/images/loginbackground.jpg')}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 80,
                paddingBottom: 60,
                justifyContent: "center",
                minHeight: "100%",
                backgroundColor: "rgba(0,0,0,0.25)"
              }}
              showsVerticalScrollIndicator={false}
            >

              {/* APP LOGO */}
              <View style={{ alignItems: "center", marginBottom: 30 }}>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={{ width: 120, height: 110 }}
                  resizeMode="contain"
                />
                <Text style={{
                  marginTop: 10,
                  fontSize: 32,
                  fontWeight: "bold",
                  color: COLORS.surface
                }}>
                  AgriPredict
                </Text>
                <Text style={{ color: COLORS.surface, opacity: 0.8 }}>
                  Don't miss anything
                </Text>
              </View>

              {/* WHITE FORM CARD */}
              <View style={{
                backgroundColor: COLORS.surface,
                padding: 20,
                borderRadius: 20,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4
              }}>

                <Text style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: COLORS.primary,
                  textAlign: "center",
                  marginBottom: 20
                }}>
                  {isLoginMode ? "Welcome Back" : "Create Account"}
                </Text>

                {/* FULL NAME (Signup only) */}
                {!isLoginMode && (
                  <View style={{ marginBottom: 15 }}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      placeholder="Enter your full name"
                      placeholderTextColor={COLORS.textLight}
                      style={[
                        styles.input,
                        focusedField === 'name' && styles.focusedInput,
                        errors.name && styles.inputError
                      ]}
                      value={formData.name}
                      onChangeText={(t) => handleInputChange('name', t)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      autoCapitalize="words"
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                  </View>
                )}

                {/* EMAIL */}
                <View style={{ marginBottom: 15 }}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor={COLORS.textLight}
                    style={[
                      styles.input,
                      focusedField === 'email' && styles.focusedInput,
                      errors.email && styles.inputError
                    ]}
                    value={formData.email}
                    onChangeText={(t) => handleInputChange('email', t)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                  {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                {/* PASSWORD */}
                <View style={{ marginBottom: 15 }}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder="Enter your password"
                      placeholderTextColor={COLORS.textLight}
                      style={[
                        styles.passwordInput,
                        focusedField === 'password' && styles.focusedInput,
                        errors.password && styles.inputError,
                      ]}
                      secureTextEntry={!showPassword}
                      value={formData.password}
                      onChangeText={(t) => handleInputChange('password', t)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color={COLORS.textLight}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                {/* CONFIRM PASSWORD */}
                {!isLoginMode && (
                  <View style={{ marginBottom: 15 }}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        placeholder="Confirm your password"
                        placeholderTextColor={COLORS.textLight}
                        style={[
                          styles.passwordInput,
                          focusedField === 'confirmPassword' && styles.focusedInput,
                          errors.confirmPassword && styles.inputError,
                        ]}
                        secureTextEntry={!showConfirmPassword}
                        value={formData.confirmPassword}
                        onChangeText={(t) => handleInputChange('confirmPassword', t)}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        autoComplete="password"
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-off" : "eye"}
                          size={20}
                          color={COLORS.textLight}
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                  </View>
                )}

                {/* BUTTON */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{
                    backgroundColor: COLORS.primary,
                    paddingVertical: 15,
                    borderRadius: 12,
                    alignItems: "center",
                    marginTop: 10,
                    opacity: (!isFormValid() || isPending) ? 0.6 : 1
                  }}
                  disabled={!isFormValid() || isPending}
                >
                  <Text style={{ color: COLORS.surface, fontSize: 16, fontWeight: "600" }}>
                    {isPending ? "Processing..." : isLoginMode ? "Sign In" : "Create Account"}
                  </Text>
                </TouchableOpacity>

                {/* SWITCH MODE */}
                <TouchableOpacity
                  onPress={toggleMode}
                  style={{ marginTop: 20, alignItems: "center" }}
                >
                  <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                    {isLoginMode
                      ? "Don't have an account? Sign Up"
                      : "Already have an account? Sign In"}
                  </Text>
                </TouchableOpacity>

              </View>

            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ImageBackground>

      <Toast />
    </>
  );
}