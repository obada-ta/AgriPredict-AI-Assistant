
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   Modal,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import axios from "axios";
// import { BASE_URL } from "@/constants/Api";
// import { useAuthStore } from "@/stores/authstore";
// import { SafeAreaView } from "react-native-safe-area-context";

// type AiType = "soil" | "plant" | "crop" | "yield" | "analyze-land";


// const AI_TYPES: Record<AiType, string[]> = {
//   soil: ["image"],
//   plant: ["image"],
//   crop: ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall"],
//   yield: ["crop_type", "soil_type", "soil_pH", "temperature", "humidity", "wind_speed", "N", "P", "K", "soil_quality"],
//   "analyze-land": ["sand", "clay", "silt", "ph", "organic_matter", "nitrogen", "phosphorus", "potassium", "slope", "elevation"],
// };

// interface AiInputValues {
//   [key: string]: string | number;
// }

// interface ImageType {
//   uri: string;
//   width?: number;
//   height?: number;
//   cancelled?: boolean;
// }

// export default function AiDynamicForm() {
//   const [selectedAI, setSelectedAI] = useState<AiType | null>(null);
//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [inputs, setInputs] = useState<AiInputValues>({});
//   const [image, setImage] = useState<ImageType | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const { token } = useAuthStore();

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       alert("Permission required!");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       const asset = result.assets[0];
//       setImage({ uri: asset.uri, width: asset.width, height: asset.height });
//     } else {
//       console.log("User cancelled image picker");
//     }
//   };


//   const openModal = (type: AiType) => {
//     setSelectedAI(type);
//     setInputs({});
//     setImage(null);
//     setResult(null);
//     setModalVisible(true);
//   };

//   const handleInputChange = (key: string, value: string) => {
//     setInputs((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!selectedAI) return;
//     setLoading(true);

//     try {
//       let payload: any;
//       let headers: any;

//       // ========== CASE 1: IMAGE ==========
//       if (image) {
//         const formData = new FormData();



//         formData.append("image", {
//           uri: image.uri,
//           name: "photo.jpg",
//           type: "image/jpeg",
//         } as any);

//         Object.keys(inputs).forEach((key) => {
//           formData.append(key, String(inputs[key]));
//         });

//         payload = formData;
//         headers = {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         };

//       } else {
//         // ========== CASE 2: JSON ==========
//         payload = inputs;
//         headers = {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         };
//       }

//       const res = await axios.post(
//         `${BASE_URL}/api/ai/${selectedAI}`,
//         payload,
//         { headers }
//       );

//       setResult(res.data);

//     } catch (err: any) {
//       console.error("AI ERROR:", err?.response?.data || err.message);
//       alert("Error: " + (err?.response?.data?.error || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView >
//         <Text style={styles.title}>Select AI Type</Text>
//         <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', }}>
//           {(Object.keys(AI_TYPES) as AiType[]).map((type) => (
//             // <Button
//             //   key={type}
//             //   title={type}
//             //   onPress={() => openModal(type)}

//             // />
//             <TouchableOpacity
//               onPress={() => openModal(type)}
//               key={type}
//               style={{ backgroundColor: 'red', paddingHorizontal: 20, paddingVertical: 10 }}
//             >
//               <Text style={{ color: "white", fontSize: 20 }}>
//                 {type}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Modal visible={modalVisible} animationType="slide">
//           <ScrollView style={styles.modalContent}>
//             <Text style={styles.title}>Fill Features for {selectedAI}</Text>

//             {selectedAI &&
//               AI_TYPES[selectedAI].map((field) => {
//                 if (field === "image") {
//                   return (
//                     <View key={field} style={{ marginVertical: 10 }}>
//                       <Button title="Pick Image" onPress={pickImage} />
//                       {image?.uri && <Image source={{ uri: image.uri }} style={styles.image} />}
//                     </View>
//                   );
//                 } else {
//                   return (
//                     <View key={field} style={{ marginVertical: 5 }}>
//                       <Text>{field}</Text>
//                       <TextInput
//                         style={styles.input}
//                         keyboardType="numeric"
//                         onChangeText={(val) => handleInputChange(field, val)}
//                       />
//                     </View>
//                   );
//                 }
//               })}

//             <View style={{ marginVertical: 20 }}>
//               <Button title="Submit" onPress={handleSubmit} />
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Text style={{ color: "white", marginTop: 10, backgroundColor: "red", alignSelf: 'center', padding: 10, borderRadius: 10 }}>Cancel</Text>
//               </TouchableOpacity>
//             </View>

//             {loading && <ActivityIndicator size="large" color="green" />}
//             {result && (
//               <View style={{ marginTop: 20 }}>
//                 <Text style={{ fontWeight: "bold" }}>Result:</Text>
//                 <Text>{JSON.stringify(result, null, 2)}</Text>
//                 {result.image && <Image source={{ uri: result.image }} style={styles.image} />}
//               </View>
//             )}
//           </ScrollView>
//         </Modal>
//       </ScrollView>
//     </SafeAreaView>

//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, },
//   modalContent: { flex: 1, padding: 20 },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 5, marginBottom: 10 },
//   image: { width: 200, height: 200, marginVertical: 10 },
// });

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   Modal,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import axios from "axios";
// import { BASE_URL } from "@/constants/Api";
// import { useAuthStore } from "@/stores/authstore";
// import { SafeAreaView } from "react-native-safe-area-context";

// type AiType = "soil" | "plant-disease" | "plant-type" | "crop-yield" | "recommend-crop" | "analyze-land";

// const AI_TYPES: Record<AiType, string[]> = {
//   soil: ["image"],
//   "plant-disease": ["image"],
//   "plant-type": ["image"],
//   "recommend-crop": ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall"],
//   "crop-yield": ["crop_type", "soil_type", "soil_pH", "temperature", "humidity", "wind_speed", "N", "P", "K", "soil_quality"],
//   "analyze-land": ["sand", "clay", "silt", "ph", "organic_matter", "nitrogen", "phosphorus", "potassium", "slope", "elevation"],
// };

// interface AiInputValues {
//   [key: string]: string | number;
// }

// interface ImageType {
//   uri: string;
//   width?: number;
//   height?: number;
// }

// export default function AiDynamicForm() {
//   const [selectedAI, setSelectedAI] = useState<AiType | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [inputs, setInputs] = useState<AiInputValues>({});
//   const [image, setImage] = useState<ImageType | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const { token } = useAuthStore();

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert("Permission required", "Please allow access to photos.");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       const asset = result.assets[0];
//       setImage({ uri: asset.uri, width: asset.width, height: asset.height });
//     }
//   };

//   const openModal = (type: AiType) => {
//     setSelectedAI(type);
//     setInputs({});
//     setImage(null);
//     setResult(null);
//     setModalVisible(true);
//   };

//   const handleInputChange = (key: string, value: string) => {
//     setInputs((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!selectedAI) return;
//     setLoading(true);

//     try {
//       let payload: any;
//       let headers: any;

//       // ---------- IMAGE ENDPOINTS ----------
//       if (image) {
//         const formData = new FormData();
//         formData.append("image", {
//           uri: image.uri,
//           name: "photo.jpg",
//           type: "image/jpeg",
//         } as any);

//         Object.keys(inputs).forEach((key) => {
//           formData.append(key, String(inputs[key]));
//         });

//         payload = formData;
//         headers = {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         };
//       } else {
//         // ---------- JSON ENDPOINTS ----------
//         payload = inputs;
//         headers = {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         };
//       }

//       // ---------- Determine API URL ----------
//       let apiUrl = `${BASE_URL}/api/`;
//       switch (selectedAI) {
//         case "soil":
//           apiUrl += "predict";
//           break;
//         case "plant-disease":
//           apiUrl += "plant-disease";
//           break;
//         case "plant-type":
//           apiUrl += "plant-type";
//           break;
//         case "crop-yield":
//           apiUrl += "crop-yield";
//           break;
//         case "recommend-crop":
//           apiUrl += "recommend-crop";
//           break;
//         case "analyze-land":
//           apiUrl += "analyze-land";
//           break;
//         default:
//           throw new Error("Invalid AI type");
//       }

//       const res = await axios.post(apiUrl, payload, { headers });
//       setResult(res.data);
//     } catch (err: any) {
//       console.error("AI ERROR:", err?.response?.data || err.message);
//       Alert.alert("Error", err?.response?.data?.error || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         <Text style={styles.title}>Select AI Type</Text>
//         <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
//           {(Object.keys(AI_TYPES) as AiType[]).map((type) => (
//             <TouchableOpacity
//               key={type}
//               style={styles.aiButton}
//               onPress={() => openModal(type)}
//             >
//               <Text style={styles.aiButtonText}>{type}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Modal visible={modalVisible} animationType="slide">
//           <ScrollView style={styles.modalContent}>
//             <Text style={styles.title}>Fill Features for {selectedAI}</Text>

//             {selectedAI &&
//               AI_TYPES[selectedAI].map((field) => {
//                 if (field === "image") {
//                   return (
//                     <View key={field} style={{ marginVertical: 10 }}>
//                       <Button title="Pick Image" onPress={pickImage} />
//                       {image?.uri && <Image source={{ uri: image.uri }} style={styles.image} />}
//                     </View>
//                   );
//                 } else {
//                   return (
//                     <View key={field} style={{ marginVertical: 5 }}>
//                       <Text>{field}</Text>
//                       <TextInput
//                         style={styles.input}
//                         keyboardType="numeric"
//                         onChangeText={(val) => handleInputChange(field, val)}
//                       />
//                     </View>
//                   );
//                 }
//               })}

//             <View style={{ marginVertical: 20 }}>
//               <Button title="Submit" onPress={handleSubmit} />
//               <TouchableOpacity onPress={() => setModalVisible(false)}>
//                 <Text style={styles.cancelButton}>Cancel</Text>
//               </TouchableOpacity>
//             </View>

//             {loading && <ActivityIndicator size="large" color="green" />}
//             {result && (
//               <View style={{ marginTop: 20 }}>
//                 <Text style={{ fontWeight: "bold" }}>Result:</Text>
//                 <Text>{JSON.stringify(result, null, 2)}</Text>
//                 {result.image && <Image source={{ uri: result.image }} style={styles.image} />}
//               </View>
//             )}
//           </ScrollView>
//         </Modal>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   modalContent: { flex: 1, padding: 20 },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 5, marginBottom: 10 },
//   image: { width: 200, height: 200, marginVertical: 10 },
//   aiButton: { backgroundColor: "red", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
//   aiButtonText: { color: "white", fontSize: 18 },
//   cancelButton: { color: "white", marginTop: 10, backgroundColor: "red", alignSelf: "center", padding: 10, borderRadius: 10 },
// });
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Button,
//   Modal,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import axios from "axios";
// import { BASE_URL } from "@/constants/Api";
// import { useAuthStore } from "@/stores/authstore";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { COLORS } from "@/constants/theme";

// // 👇 الألوان المطلوبة


// type AiType = "soil" | "plant-disease" | "plant-type" | "crop-yield" | "recommend-crop" | "analyze-land";

// const AI_TYPES: Record<AiType, string[]> = {
//   soil: ["image"],
//   "plant-disease": ["image"],
//   "plant-type": ["image"],
//   "recommend-crop": ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall"],
//   "crop-yield": ["crop_type", "soil_type", "soil_pH", "temperature", "humidity", "wind_speed", "N", "P", "K", "soil_quality"],
//   "analyze-land": ["sand", "clay", "silt", "ph", "organic_matter", "nitrogen", "phosphorus", "potassium", "slope", "elevation"],
// };

// interface AiInputValues {
//   [key: string]: string | number;
// }

// interface ImageType {
//   uri: string;
//   width?: number;
//   height?: number;
// }

// export default function AiDynamicForm() {
//   const [selectedAI, setSelectedAI] = useState<AiType | null>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [inputs, setInputs] = useState<AiInputValues>({});
//   const [image, setImage] = useState<ImageType | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const { token } = useAuthStore();

//   const pickImage = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) {
//       Alert.alert("Permission required", "Please allow access to photos.");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!result.canceled && result.assets.length > 0) {
//       const asset = result.assets[0];
//       setImage({ uri: asset.uri, width: asset.width, height: asset.height });
//     }
//   };

//   const openModal = (type: AiType) => {
//     setSelectedAI(type);
//     setInputs({});
//     setImage(null);
//     setResult(null);
//     setModalVisible(true);
//   };

//   const handleInputChange = (key: string, value: string) => {
//     setInputs((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!selectedAI) return;
//     setLoading(true);

//     try {
//       let payload: any;
//       let headers: any;

//       if (image) {
//         const formData = new FormData();
//         formData.append("image", {
//           uri: image.uri,
//           name: "photo.jpg",
//           type: "image/jpeg",
//         } as any);

//         Object.keys(inputs).forEach((key) => {
//           formData.append(key, String(inputs[key]));
//         });

//         payload = formData;
//         headers = {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         };
//       } else {
//         payload = inputs;
//         headers = {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         };
//       }

//       let apiUrl = `${BASE_URL}/api/`;
//       switch (selectedAI) {
//         case "soil":
//           apiUrl += "predict";
//           break;
//         case "plant-disease":
//           apiUrl += "plant-disease";
//           break;
//         case "plant-type":
//           apiUrl += "plant-type";
//           break;
//         case "crop-yield":
//           apiUrl += "crop-yield";
//           break;
//         case "recommend-crop":
//           apiUrl += "recommend-crop";
//           break;
//         case "analyze-land":
//           apiUrl += "analyze-land";
//           break;
//         default:
//           throw new Error("Invalid AI type");
//       }

//       const res = await axios.post(apiUrl, payload, { headers });
//       setResult(res.data);
//     } catch (err: any) {
//       console.error("AI ERROR:", err?.response?.data || err.message);
//       Alert.alert("Error", err?.response?.data?.error || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={{ padding: 20 }}>
//         <Text style={styles.title}>Select AI Analysis Type</Text>
//         <View style={styles.aiButtonsContainer}>
//           {(Object.keys(AI_TYPES) as AiType[]).map((type) => (
//             <TouchableOpacity
//               key={type}
//               style={styles.aiButton}
//               onPress={() => openModal(type)}
//             >
//               <Text style={styles.aiButtonText}>{type.replace(/-/g, ' ')}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>

//       <Modal visible={modalVisible} animationType="slide">
//         <SafeAreaView style={styles.modalContainer}>
//           <ScrollView contentContainerStyle={styles.modalContent}>
//             <Text style={styles.modalTitle}>Enter Details for: {selectedAI?.replace(/-/g, ' ')}</Text>

//             {selectedAI &&
//               AI_TYPES[selectedAI].map((field) => {
//                 if (field === "image") {
//                   return (
//                     <View key={field} style={styles.fieldContainer}>
//                       <Text style={styles.fieldLabel}>Upload Image</Text>
//                       <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
//                         <Text style={styles.imagePickerText}>Choose Photo</Text>
//                       </TouchableOpacity>
//                       {image?.uri && (
//                         <Image source={{ uri: image.uri }} style={styles.previewImage} />
//                       )}
//                     </View>
//                   );
//                 } else {
//                   return (
//                     <View key={field} style={styles.fieldContainer}>
//                       <Text style={styles.fieldLabel}>
//                         Enter {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
//                       </Text>
//                       <TextInput
//                         style={styles.input}
//                         keyboardType="numeric"
//                         placeholder={`Enter ${field}`}
//                         value={String(inputs[field] ?? '')}
//                         onChangeText={(val) => handleInputChange(field, val)}
//                       />
//                     </View>
//                   );
//                 }
//               })}

//             <View style={styles.buttonRow}>
//               <TouchableOpacity
//                 style={[styles.submitButton, loading && styles.disabledButton]}
//                 onPress={handleSubmit}
//                 disabled={loading}
//               >
//                 <Text style={styles.submitButtonText}>
//                   {loading ? "Processing..." : "Submit"}
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             </View>

//             {loading && (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={COLORS.primary} />
//               </View>
//             )}

//             {result && (
//               <View style={styles.resultContainer}>
//                 <Text style={styles.resultTitle}>Result:</Text>
//                 <Text style={styles.resultText}>{JSON.stringify(result, null, 2)}</Text>
//                 {result.image && (
//                   <Image source={{ uri: result.image }} style={styles.resultImage} />
//                 )}
//               </View>
//             )}
//           </ScrollView>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: COLORS.text,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   aiButtonsContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 12,
//     justifyContent: 'center',
//   },
//   aiButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 12,
//     minWidth: 140,
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   aiButtonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   modalContent: {
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: COLORS.text,
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   fieldContainer: {
//     marginBottom: 18,
//   },
//   fieldLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.text,
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 14,
//     fontSize: 16,
//     backgroundColor: COLORS.surface,
//     color: COLORS.text,
//   },
//   imagePickerButton: {
//     backgroundColor: COLORS.surface,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   imagePickerText: {
//     color: COLORS.primary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   previewImage: {
//     width: '100%',
//     height: 200,
//     marginTop: 10,
//     borderRadius: 8,
//     resizeMode: 'cover',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     gap: 12,
//   },
//   submitButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   disabledButton: {
//     opacity: 0.7,
//   },
//   submitButtonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: COLORS.grey,
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   loadingContainer: {
//     marginVertical: 20,
//     alignItems: 'center',
//   },
//   resultContainer: {
//     marginTop: 24,
//     padding: 16,
//     backgroundColor: COLORS.surface,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: COLORS.borderLight,
//   },
//   resultTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.text,
//     marginBottom: 8,
//   },
//   resultText: {
//     fontSize: 14,
//     color: COLORS.text,
//     fontFamily: 'monospace',
//     lineHeight: 20,
//   },
//   resultImage: {
//     width: '100%',
//     height: 200,
//     marginTop: 12,
//     borderRadius: 8,
//     resizeMode: 'contain',
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BASE_URL } from "@/constants/Api";
import { useAuthStore } from "@/stores/authstore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { router } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


type AiType = "soil" | "plant-disease" | "plant-type" | "crop-yield" | "recommend-crop" | "analyze-land";

const AI_TYPES: Record<AiType, { label: string; description: string; fields: string[] }> = {
  soil: {
    label: "Soil Analysis",
    description: "Analyze soil composition from images",
    fields: ["image"]
  },
  "plant-disease": {
    label: "Plant Disease Detection",
    description: "Detect diseases from plant images",
    fields: ["image"]
  },
  "plant-type": {
    label: "Plant Type Identification",
    description: "Identify plant species from images",
    fields: ["image"]
  },
  "recommend-crop": {
    label: "Crop Recommendation",
    description: "Get crop recommendations based on soil conditions",
    fields: ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall"]
  },
  "crop-yield": {
    label: "Crop Yield Prediction",
    description: "Predict crop yield based on various factors",
    fields: ["crop_type", "soil_type", "soil_pH", "temperature", "humidity", "wind_speed", "N", "P", "K", "soil_quality"]
  },
  "analyze-land": {
    label: "Land Analysis",
    description: "Comprehensive land analysis for agriculture",
    fields: [
      "sand", "clay", "silt", "ph", "organic_matter",
      "nitrogen", "phosphorus", "potassium",
      "slope", "elevation",
      "drainage", "sun_exposure", "pollution_level"
    ]
  },


};
const OptionSelector = ({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: string[];
  value?: string | number;
  onSelect: (val: string) => void;
}) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.inputLabel}>{label} *</Text>
      <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onSelect(opt)}
              style={[
                styles.optionButton,
                selected && styles.optionButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  selected && styles.optionButtonTextActive,
                ]}
              >
                {opt.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

interface AiInputValues {
  [key: string]: string | number;
}

interface ImageType {
  uri: string;
  width?: number;
  height?: number;
}
// يجب أن تتطابق مع crop_classes و soil_classes في Flask
const CROP_OPTIONS = ["Wheat",
  "Corn",
  "Rice",
  "Barley",
  "Soybean",
  "Cotton",
  "Sugarcane",
  "Tomato",
  "Potato",
  "Sunflower"
];

const SOIL_OPTIONS = ["Peaty", "Loamy", "Sandy", "Saline", "Clay"];

export default function AiDynamicForm() {
  const [selectedAI, setSelectedAI] = useState<AiType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputs, setInputs] = useState<AiInputValues>({});
  const [image, setImage] = useState<ImageType | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { token } = useAuthStore();
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.75) return "high";
    if (confidence >= 0.45) return "medium";
    return "low";
  };
  const ConfidenceBar = ({ confidence }: { confidence: number }) => {
    const percentage = Math.min(Math.max(confidence * 100, 0), 100);
    const level = getConfidenceLevel(confidence);
    const color = getConfidenceColor(level);

    return (
      <View style={{ marginVertical: 16 }}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={[styles.confidenceText, { color }]}>
          Confidence: {percentage.toFixed(1)}%
        </Text>
      </View>
    );
  };
  const getConfidenceColor = (level: "high" | "medium" | "low") => {
    switch (level) {
      case "high":
        return COLORS.success;
      case "medium":
        return COLORS.warning;
      case "low":
        return COLORS.error;
    }
  };

  const getResultIcon = (level: "high" | "medium" | "low") => {
    switch (level) {
      case "high":
        return "checkmark-circle";
      case "medium":
        return "alert-circle";
      case "low":
        return "close-circle";
    }
  };

  const renderResult = () => {
    if (!result || !selectedAI) return null;

    const confidence = normalizeConfidence(
      result.confidence ||
      result.probability ||
      result.score ||
      result.accuracy
    );

    const confidenceLevel =
      confidence !== null ? getConfidenceLevel(confidence) : null;

    const confidenceColor =
      confidenceLevel ? getConfidenceColor(confidenceLevel) : COLORS.primary;

    const mainValue = getMainValue(result);

    return (
      <View style={styles.resultCard}>
        {/* ===== HEADER ===== */}
        <View style={styles.resultHeader}>
          <View
            style={[
              styles.resultIconContainer,
              { backgroundColor: confidenceColor + "20" },
            ]}
          >
            <Ionicons
              name={
                selectedAI.includes("plant")
                  ? "leaf"
                  : selectedAI.includes("soil")
                    ? "earth"
                    : "analytics"
              }
              size={32}
              color={confidenceColor}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.resultMainLabel}>ANALYSIS RESULT</Text>
            {mainValue && (
              <Text
                style={[
                  styles.resultMainValue,
                  { color: confidenceColor },
                ]}
              >
                {String(mainValue).toUpperCase()}
              </Text>
            )}
          </View>
        </View>

        {/* ===== CONFIDENCE ===== */}
        {confidence !== null && (
          <View style={styles.confidenceSection}>
            <View style={styles.confidenceHeader}>
              <Text style={styles.confidenceLabel}>
                Confidence Level
              </Text>
              <Text
                style={[
                  styles.confidencePercentage,
                  { color: confidenceColor },
                ]}
              >
                {(confidence * 100).toFixed(1)}%
              </Text>
            </View>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${confidence * 100}%`,
                    backgroundColor: confidenceColor,
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* ===== DETAILS BY AI TYPE ===== */}
        <View style={{ marginTop: 20 }}>
          {selectedAI === "crop-yield" && (
            <>
              {/* Crop Type (from input) */}
              <ResultRow
                label="Crop Type"
                value={inputs?.crop_type}
              />

              {/* Soil Quality (from input) */}
              {/* <ResultRow
                label="Soil Quality"
                value={inputs?.soil_quality}
              /> */}

              {/* Predicted Yield (from API result) */}
              <ResultRow
                label="Predicted Yield"
                
                value={
                  result?.predicted_yield !== undefined
                    ? `${result.predicted_yield} ${result.unit || ""}`
                    : "-"
                }
              />
            </>
          )}


          {selectedAI === "recommend-crop" && (
            <>
              <ResultRow
                label="Recommended Crop"
                value={result.recommended_crop}
              />

              {Array.isArray(result.top_crops) && (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.sectionTitle}>Top Crop Matches</Text>

                  {result.top_crops.map(
                    (item: { crop: string; probability: number }, index: number) => (
                      <ResultRow
                        key={index}
                        label={item.crop}
                        value={`${item.probability}%`}
                      />
                    )
                  )}
                </View>
              )}
            </>
          )}

          {selectedAI === "plant-disease" && (
            <>
              <ResultRow label="Disease" value={result.disease} />
              {/* <ResultRow label="Severity" value={result.severity} /> */}
            </>
          )}

          {selectedAI === "plant-type" && (
            <>
              {/* <ResultRow label="Plant Type" value={result.label} /> */}
            </>
          )}

          {selectedAI === "soil" && (
            <>
              <ResultRow label="Soil Type" value={result.class} />
            </>
          )}

          {selectedAI === "analyze-land" && result && (
            <>
              {/* Suitability */}
              <ResultRow
                label="Land Suitability"
                value={result.suitability}
              />

              <ResultRow
                label="Suitability Percentage"
                value={`${result.suitabilityPercentage}%`}
              />

              {/* Parameters */}
              {/* {result.parameters && (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.sectionTitle}>Soil Parameters</Text>

                  {Object.entries(result.parameters).map(
                    ([key, data]: [string, any]) => (
                      <ResultRow
                        key={key}
                        label={key.replace(/_/g, " ").toUpperCase()}
                        value={`${data.value} (score: ${data.score})`}
                      />
                    )
                  )}
                </View>
              )} */}
            </>
          )}

        </View>

        {/* ===== IMAGE ===== */}
        {result.image && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Processed Image</Text>
            <Image
              source={{ uri: result.image }}
              style={styles.resultImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* ===== RECOMMENDATION ===== */}
        {(result.recommendation || result.suggestion) && (
          <View style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <Ionicons name="bulb" size={20} color={COLORS.warning} />
              <Text style={styles.recommendationTitle}>
                Recommendation
              </Text>
            </View>
            <Text style={styles.recommendationText}>
              {result.recommendation || result.suggestion}
            </Text>
          </View>
        )}
      </View>
    );
  };


  const normalizeConfidence = (value: any): number | null => {
    if (value === undefined || value === null) return null;
    const num = Number(value);
    if (isNaN(num)) return null;
    return num > 1 ? num / 100 : num;
  };


  const getMainValue = (result: any) =>
    result.class ||           // soil
    result.plant_type ||      // ✅ plant type
    result.label ||           // generic classifiers
    result.crop ||            // recommend crop
    result.recommended_crop ||// crop recommendation
    result.disease ||         // plant disease
    result.prediction ||      // yield (old)
    result.predicted_yield || // yield (new)
    result.suitability ||     // land analysis
    result.result;


  const ResultRow = ({ label, value }: { label: string; value: any }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
        gap: 12,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          color: COLORS.textLight,
          flex: 1,
        }}
      >
        {label}
      </Text>

      <View style={{ flex: 1, alignItems: "flex-end" }}>
        {renderValue(value)}
      </View>
    </View>
  );



  // استبدل renderValue بالكود التالي
  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return (
      <Text style={styles.valuePlaceholder}>N/A</Text>
    );

    if (typeof value === "string") {
      return <Text style={styles.valueText}>{value}</Text>;
    }

    if (typeof value === "number") {
      // تنسيق الأرقام
      return <Text style={styles.valueNumber}>{Number.isInteger(value) ? value : value.toFixed(2)}</Text>;
    }

    if (typeof value === "boolean") {
      return (
        <View style={[styles.badge, value ? styles.badgeSuccess : styles.badgeError]}>
          <Text style={styles.badgeText}>
            {value ? "Yes" : "No"}
          </Text>
        </View>
      );
    }

    if (Array.isArray(value)) {
      return (
        <View style={styles.arrayContainer}>
          {value.map((item, index) => (
            <View key={index} style={styles.arrayItem}>
              <View style={styles.arrayBullet} />
              <Text style={styles.arrayItemText}>
                {typeof item === 'object' ? JSON.stringify(item) : String(item)}
              </Text>
            </View>
          ))}
        </View>
      );
    }

    if (typeof value === "object") {
      return renderObjectValue(value);
    }

    return <Text style={styles.valueText}>{String(value)}</Text>;
  };

  const renderObjectValue = (obj: Record<string, any>): React.ReactNode => {
    return (
      <View style={styles.objectContainer}>
        {Object.entries(obj).map(([key, val]) => (
          <View key={key} style={styles.objectRow}>
            <Text style={styles.objectKey}>{getFieldLabel(key)}:</Text>
            <Text style={styles.objectValue}>
              {typeof val === 'object'
                ? JSON.stringify(val)
                : String(val)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setImage({ uri: asset.uri, width: asset.width, height: asset.height });
    }
  };

  const openModal = (type: AiType) => {
    setSelectedAI(type);
    setInputs({});
    setImage(null);
    setResult(null);
    setModalVisible(true);
  };

  const handleInputChange = (key: string, value: string) => {
    // Don't allow changing image field directly
    if (key === "image") return;
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedAI) return;

    setLoading(true);

    try {
      // Check if this AI type requires image
      const requiresImage = AI_TYPES[selectedAI].fields.includes("image");

      if (requiresImage && !image) {
        Alert.alert("Error", "Please upload an image");
        setLoading(false);
        return;
      }

      // تحديد endpoint
      let apiUrl = `${BASE_URL}/api/ai/`;
      switch (selectedAI) {
        case "soil": apiUrl += "soil"; break;
        case "plant-disease": apiUrl += "plant-disease"; break;
        case "plant-type": apiUrl += "plant"; break;
        case "crop-yield": apiUrl += "crop-yield"; break;
        case "recommend-crop": apiUrl += "crop"; break;
        case "analyze-land": apiUrl += "analyze-land"; break;
        default: throw new Error("Invalid AI type");
      }

      console.log("Sending request to:", apiUrl);

      let responseData;

      if (requiresImage && image) {
        // ========== استخدام fetch للصورة ==========
        const formData = new FormData();

        // إعداد الصورة بشكل صحيح
        const filename = image.uri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        console.log("Image info:", { filename, type, uri: image.uri.substring(0, 50) + "..." });

        // إضافة الصورة إلى FormData
        formData.append('image', {
          uri: image.uri,
          name: filename,
          type: type,
        } as any);

        // إضافة الحقول الأخرى إذا وجدت
        Object.keys(inputs).forEach((key) => {
          if (key !== "image") {
            formData.append(key, String(inputs[key]));
          }
        });

        console.log("Sending FormData with fields:", Object.keys(inputs));

        // إرسال الطلب باستخدام fetch
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            // لا تضيف Content-Type هنا - سيتم تعيينه تلقائياً لـ FormData
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          throw new Error(`Server error: ${response.status}`);
        }

        responseData = await response.json();
        console.log("Image upload successful:", responseData);

      } else {
        // ========== استخدام axios للـ JSON ==========
        let payload: any = {};

        if (selectedAI === "crop-yield") {
          const requiredFields = [
            "crop_type", "soil_type", "soil_pH", "temperature",
            "humidity", "wind_speed", "N", "P", "K", "soil_quality"
          ];

          for (const field of requiredFields) {
            if (!(field in inputs)) {
              throw new Error(`Missing field: ${field}`);
            }

            if (!["crop_type", "soil_type"].includes(field)) {
              const val = parseFloat(inputs[field] as string);
              if (isNaN(val)) throw new Error(`Field ${field} must be a number`);
              payload[field] = val;
            } else {
              payload[field] = String(inputs[field]).trim();
            }
          }
        } else if (selectedAI === "recommend-crop") {
          const requiredFields = ["nitrogen", "phosphorus", "potassium", "temperature", "humidity", "ph", "rainfall"];
          requiredFields.forEach((field) => {
            if (!(field in inputs)) throw new Error(`Missing field: ${field}`);
            const val = parseFloat(inputs[field] as string);
            if (isNaN(val)) throw new Error(`Field ${field} must be a number`);
            payload[field] = val;
          });
        } else if (selectedAI === "analyze-land") {
          Object.keys(inputs).forEach((key) => {
            if (["sand", "clay", "silt", "ph", "organic_matter",
              "nitrogen", "phosphorus", "potassium",
              "slope", "elevation"].includes(key)) {
              payload[key] = parseFloat(inputs[key] as string);
            } else {
              payload[key] = inputs[key];
            }
          });
        } else {
          Object.keys(inputs).forEach((key) => payload[key] = inputs[key]);
        }

        console.log("Sending JSON payload:", payload);

        // استخدم axios للطلبات غير المصورة
        const response = await axios.post(apiUrl, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        responseData = response.data;
      }
      const finalResult = responseData?.result ?? responseData;

      setResult(finalResult);


    } catch (err: any) {
      console.error("AI ERROR details:", {
        message: err.message,
        stack: err.stack,
        response: err.response?.data,
        status: err.response?.status,
      });

      let errorMessage = "Something went wrong";

      if (err.message?.includes('Network Error')) {
        errorMessage = "Network error. Please check:\n1. Your internet connection\n2. Server URL is correct\n3. Server is running";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFieldLabel = (field: string) => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 40 }}>
        <Text style={styles.title}>AI Analysis Tools</Text>
        <Text style={styles.subtitle}>Select an analysis type to get started</Text>
        <TouchableOpacity style={{
          backgroundColor: COLORS.primary,
          width: 100,
          height: 50,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 10,
          borderRadius: 10
        }}
          onPress={() => router.push('/HistoryAli')}
        >
          <Text style={{ color: "white", fontSize: 20 }}>history</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.card, { marginBottom: 10 }]}
          onPress={() => router.push('/Weather')}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '20' }]}>
              <MaterialCommunityIcons name="weather-cloudy" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.cardTitle}>Weather</Text>
          </View>
          {/* <Text style={styles.cardDescription}>{config.description}</Text> */}
          <View style={styles.featuresContainer}>
            <Text style={styles.cardDescription}>
              Disease Risk Calucalation & Affects on Yield Prediction
            </Text>

            {/* <Text style={styles.featuresLabel}>
                  {config.fields.length === 1 ? '1 feature' : `${config.fields.length} features`}
                </Text> */}
            <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
          </View>
        </TouchableOpacity>
        <View style={styles.gridContainer}>
          {(Object.entries(AI_TYPES) as [AiType, { label: string; description: string; fields: string[] }][]).map(([type, config]) => (
            <TouchableOpacity
              key={type}
              style={styles.card}
              onPress={() => openModal(type)}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '20' }]}>
                  <Ionicons
                    name={type.includes('plant') ? 'leaf' : type.includes('soil') ? 'earth' : 'analytics'}
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.cardTitle}>{config.label}</Text>
              </View>
              <Text style={styles.cardDescription}>{config.description}</Text>
              <View style={styles.featuresContainer}>
                <Text style={styles.featuresLabel}>
                  {config.fields.length === 1 ? '1 feature' : `${config.fields.length} features`}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={styles.modalContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 30 }}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {selectedAI && AI_TYPES[selectedAI].label}
                </Text>
              </View>

              <View style={styles.formContainer}>
                {selectedAI && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Required Features</Text>
                      <Text style={styles.sectionDescription}>
                        Please provide the following information for analysis
                      </Text>
                    </View>

                    {AI_TYPES[selectedAI].fields.map((field) => {
                      if (field === "image") {
                        return (
                          <View key={field} style={styles.imageUploadContainer}>
                            <Text style={styles.inputLabel}>Upload Image *</Text>
                            <TouchableOpacity
                              style={[
                                styles.imageUploadButton,
                                image && styles.imageUploadButtonActive
                              ]}
                              onPress={pickImage}
                            >
                              {image ? (
                                <>
                                  <Image source={{ uri: image.uri }} style={styles.previewImage} />
                                  <TouchableOpacity
                                    style={styles.replaceButton}
                                    onPress={pickImage}
                                  >
                                    <Text style={styles.replaceButtonText}>Replace Image</Text>
                                  </TouchableOpacity>
                                </>
                              ) : (
                                <View style={styles.uploadPlaceholder}>
                                  <Ionicons name="camera" size={32} color={COLORS.primary} />
                                  <Text style={styles.uploadText}>Tap to select image</Text>
                                  <Text style={styles.uploadSubtext}>JPG or PNG recommended</Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          </View>
                        );
                      } else if (field === "drainage") {
                        return (
                          <OptionSelector
                            key={field}
                            label="Drainage"
                            options={["poor", "moderate", "good"]}
                            value={inputs[field]}
                            onSelect={(val) => handleInputChange(field, val)}
                          />
                        );
                      }
                      else
                        if (field === "sun_exposure") {
                          return (
                            <OptionSelector
                              key={field}
                              label="Sun Exposure"
                              options={["low", "moderate", "high"]}
                              value={inputs[field]}
                              onSelect={(val) => handleInputChange(field, val)}
                            />
                          );
                        }

                        else if (field === "pollution_level") {
                          return (
                            <OptionSelector
                              key={field}
                              label="Pollution Level"
                              options={["low", "moderate", "high"]}
                              value={inputs[field]}
                              onSelect={(val) => handleInputChange(field, val)}
                            />
                          );
                        }
                        else if (field === "crop_type") {
                          return (
                            <OptionSelector
                              key={field}
                              label="Crop Type"
                              options={CROP_OPTIONS}
                              value={inputs[field]}
                              onSelect={(val) => handleInputChange(field, val)}
                            />
                          );
                        }
                        else if (field === "soil_type") {
                          return (
                            <OptionSelector
                              key={field}
                              label="Soil Type"
                              options={SOIL_OPTIONS}
                              value={inputs[field]}
                              onSelect={(val) => handleInputChange(field, val)}
                            />
                          );
                        }
                      // باقي الحقول الرقمية
                      return (
                        <View key={field} style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>{getFieldLabel(field)} *</Text>
                          <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder={`Enter ${getFieldLabel(field).toLowerCase()}`}
                            placeholderTextColor={COLORS.textLight}
                            onChangeText={(val) => handleInputChange(field, val)}
                            value={inputs[field]?.toString()}
                          />
                          <Text style={styles.inputHelper}>
                            Enter numeric value for {field}
                          </Text>
                        </View>
                      );
                    })}

                    <TouchableOpacity
                      style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                      onPress={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color={COLORS.background} size="small" />
                      ) : (
                        <>
                          <Ionicons name="analytics" size={20} color={COLORS.background} />
                          <Text style={styles.submitButtonText}>Run Analysis</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    {console.log(result)
                    }
                    {/* {result && (
                      <View style={styles.resultContainer}>
                        <View style={styles.resultHeader}>
                          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                          <Text style={styles.resultTitle}>Analysis Results</Text>
                        </View>

                        <View style={styles.resultContent}>
                          {typeof result === 'object' ? (
                            Object.entries(result).map(([key, value]) => (
                              <View key={key} style={styles.resultItem}>
                                <Text style={styles.resultKey}>
                                  {getFieldLabel(key)}:
                                </Text>
                                <Text style={styles.resultValue}>
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </Text>
                              </View>
                            ))
                          ) : (
                            <Text style={styles.resultText}>{String(result)}</Text>
                          )}

                          {result.image && (
                            <Image source={{ uri: result.image }} style={styles.resultImage} />
                          )}
                        </View> */}
                    {/* </View>
                          )} */}

                    {result && (
                      <View style={styles.resultContainer}>
                        <View style={styles.resultHeader}>
                          {/* <Ionicons name="analytics" size={24} color={COLORS.primary} /> */}
                          <Text style={styles.resultTitle}>Analysis Result</Text>
                        </View>

                        {renderResult()}
                      </View>
                    )}

                  </>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>

      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 40
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  cardDescription: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 16,
    lineHeight: 16,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuresLabel: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  formContainer: {
    padding: 20,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  imageUploadContainer: {
    marginBottom: 24,
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  imageUploadButtonActive: {
    borderColor: COLORS.primary,
    borderStyle: "solid",
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  replaceButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  replaceButtonText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  uploadPlaceholder: {
    alignItems: "center",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  inputHelper: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.grey,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  resultContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 8,
  },
  resultContent: {
    gap: 12,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  resultKey: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  resultValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    paddingLeft: 16,
  },
  resultText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },

  optionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  optionButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
  },

  optionButtonTextActive: {
    color: COLORS.background,
    fontWeight: "700",
  },

  resultMain: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  progressBackground: {
    height: 10,
    width: "100%",
    backgroundColor: COLORS.borderLight,
    borderRadius: 6,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 6,
  },

  confidenceText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },

  simpleValue: {
    fontSize: 12,
    color: COLORS.text,
  },

  simpleResultContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  simpleResultText: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resultTitleContainer: {
    flex: 1,
  },
  resultMainLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  resultMainValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  confidenceSection: {
    backgroundColor: COLORS.background + '80',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  confidenceLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  confidencePercentage: {
    fontSize: 20,
    fontWeight: '700',
  },
  confidenceIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  confidenceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  indicatorText: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  detailsList: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailLabelContainer: {
    flex: 1,
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  detailValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'right',
  },
  valueNumber: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
  valuePlaceholder: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  badgeSuccess: {
    backgroundColor: COLORS.success + '20',
  },
  badgeError: {
    backgroundColor: COLORS.error + '20',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  arrayContainer: {
    gap: 6,
  },
  arrayItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrayBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  arrayItemText: {
    fontSize: 12,
    color: COLORS.text,
    flex: 1,
  },
  objectContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  objectRow: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  objectKey: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
    marginRight: 6,
  },
  objectValue: {
    fontSize: 11,
    color: COLORS.text,
    flex: 1,
  },
  imageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  recommendationCard: {
    backgroundColor: COLORS.warning + '10',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
    marginBottom: 24,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.warning,
    marginLeft: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 6,
  },

});