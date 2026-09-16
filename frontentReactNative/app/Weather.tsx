import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Modal,
    FlatList,
    Dimensions,
    StatusBar,
} from "react-native";
import axios from "axios";
import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ================= TYPES ================= */

type SoilDrainage = "poor" | "moderate" | "good";

const CROPS = [
    "Wheat", "Corn", "Rice", "Barley", "Soybean", "Cotton", "Sugarcane",
    "Tomato", "Potato", "Sunflower", "Apple", "Blueberry", "Cassava",
    "Cherry", "Chili", "Coffee", "Cucumber", "Grape", "Guava", "Jamun",
    "Lemon", "Mango", "Orange", "Peach", "Pepper", "Raspberry",
    "Strawberry", "Tea"
] as const;

type CropType = typeof CROPS[number];

interface WeatherData {
    temp: number;
    wind: number;
    rain?: number;
    ml_weather: string;
    ml_weather_prob: number;
}

interface DiseaseRisk {
    [key: string]: string | number | {
        confidence?: number;
        crop?: string;
        disease?: string;
        reasons?: string[] | string;
        risk?: string | number;
    };
}

interface ApiResponse {
    success: boolean;
    weather: WeatherData;
    disease_risk: DiseaseRisk;
    yield_prediction: any; // أي نوع
}

/* ================= COMPONENT ================= */

const WeatherScreen: React.FC = () => {
    const [crop, setCrop] = useState<CropType>("Tomato");
    const [city, setCity] = useState<string>("Damascus");
    const [soilDrainage, setSoilDrainage] = useState<SoilDrainage>("good");

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Crop selector modal
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter crops based on search
    const filteredCrops = CROPS.filter(crop =>
        crop.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Crop categories for grouping
    const cropCategories = {
        "Grains & Cereals": ["Wheat", "Corn", "Rice", "Barley"],
        "Legumes": ["Soybean"],
        "Fiber Crops": ["Cotton"],
        "Sugar Crops": ["Sugarcane"],
        "Vegetables": ["Tomato", "Potato", "Cucumber", "Chili", "Pepper"],
        "Fruits": ["Apple", "Blueberry", "Cherry", "Grape", "Guava", "Jamun",
            "Lemon", "Mango", "Orange", "Peach", "Raspberry", "Strawberry"],
        "Beverages": ["Coffee", "Tea"],
        "Others": ["Sunflower", "Cassava"]
    };

    const getRiskColor = (riskValue: any): string => {
        if (typeof riskValue === 'number') {
            if (riskValue > 70) return COLORS.error;
            if (riskValue > 40) return COLORS.warning;
            return COLORS.success;
        }
        if (typeof riskValue === 'string') {
            const lowerRisk = riskValue.toLowerCase();
            if (lowerRisk.includes('high') || lowerRisk.includes('severe')) return COLORS.error;
            if (lowerRisk.includes('medium') || lowerRisk.includes('moderate')) return COLORS.warning;
            return COLORS.success;
        }
        return COLORS.grey;
    };

    const renderValue = (value: any): string => {
        if (value === null || value === undefined) return "-";
        if (typeof value === "string" || typeof value === "number") {
            return String(value);
        }
        if (Array.isArray(value)) {
            return value.join(", ");
        }
        if (typeof value === "object") {
            return JSON.stringify(value);
        }
        return String(value);
    };

    const analyzeWeather = async () => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const res = await axios.post<ApiResponse>("http://192.168.169.74:5000/api/weather", {
                crop,
                city,
                soil_drainage: soilDrainage,
            });
            setData(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to analyze weather. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Render crop item in modal
    const renderCropItem = ({ item }: { item: CropType }) => (
        <TouchableOpacity
            style={[styles.cropModalItem, crop === item && styles.cropModalItemActive]}
            onPress={() => {
                setCrop(item);
                setModalVisible(false);
                setSearchQuery("");
            }}
        >
            <View style={styles.cropItemContent}>
                <View style={styles.cropIconContainer}>
                    <Ionicons
                        name="leaf"
                        size={20}
                        color={crop === item ? '#FFFFFF' : COLORS.primary}
                    />
                </View>
                <View style={styles.cropTextContainer}>
                    <Text style={[styles.cropModalText, crop === item && styles.cropModalTextActive]}>
                        {item}
                    </Text>
                    <Text style={styles.cropCategoryText}>
                        {Object.entries(cropCategories).find(([_, crops]) =>
                            crops.includes(item)
                        )?.[0]}
                    </Text>
                </View>
            </View>
            {crop === item && (
                <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            )}
        </TouchableOpacity>
    );

    // Render disease risk data
    const renderDiseaseRisk = () => {
        if (!data?.disease_risk) return null;

        return (
            <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="medkit" size={24} color={COLORS.error} />
                    <Text style={styles.sectionTitle}>Disease Risk Analysis</Text>
                </View>

                <View style={styles.diseaseGrid}>
                    {Object.entries(data.disease_risk).map(([disease, riskData]) => {
                        if (typeof riskData === 'object' && riskData !== null && !Array.isArray(riskData)) {
                            const riskObj = riskData as any;
                            return (
                                <View key={disease} style={styles.diseaseCard}>
                                    <View style={styles.diseaseHeader}>
                                        <Ionicons name="warning" size={16} color={COLORS.error} />
                                        <Text style={styles.diseaseName}>{disease}</Text>
                                    </View>
                                    <View style={styles.riskDetails}>
                                        {Object.entries(riskObj).map(([k, v]) => (
                                            <View key={k} style={styles.riskDetail}>
                                                <Text style={styles.detailLabel}>{k}:</Text>
                                                <Text style={[styles.detailValue, { color: getRiskColor(v) }]}>
                                                    {Array.isArray(v) ? v.join(", ") : String(v)}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            );
                        } else {
                            const riskValue = riskData;
                            return (
                                <View key={disease} style={styles.diseaseItem}>
                                    <View style={styles.diseaseHeader}>
                                        <Ionicons
                                            name={typeof riskValue === 'number' && riskValue > 70 ? "warning" : "checkmark-circle"}
                                            size={16}
                                            color={typeof riskValue === 'number' && riskValue > 70 ? COLORS.error : COLORS.success}
                                        />
                                        <Text style={styles.diseaseName}>{disease}</Text>
                                    </View>
                                    <Text style={[styles.riskLevel, { color: getRiskColor(riskValue) }]}>
                                        {typeof riskValue === "number" ? `${riskValue}% Risk` : String(riskValue)}
                                    </Text>
                                </View>
                            );
                        }
                    })}
                </View>
            </View>
        );
    };

    // Render yield_prediction
    const renderYieldPrediction = (prediction: any) => {
        if (prediction === null || prediction === undefined) return "-";
        if (typeof prediction === "number" || typeof prediction === "string") return String(prediction);

        if (typeof prediction === "object") {
            return Object.entries(prediction).map(([key, value]) => {
                if (typeof value === "object") {
                    return (
                        <View key={key} style={{ marginBottom: 6 }}>
                            <Text style={{ fontWeight: '600' }}>{key}:</Text>
                            {typeof value === "object" && value !== null
                                ? Object.entries(value).map(([k, v]) => (
                                    <Text key={k} style={{ marginLeft: 12 }}>
                                        {k}: {String(v)}
                                    </Text>
                                ))
                                : <Text>{String(value)}</Text>
                            }

                        </View>
                    );
                }
                return <Text key={key}>{key}: {String(value)}</Text>;
            });
        }

        return String(prediction);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="partly-sunny" size={32} color={COLORS.primary} />
                        <Text style={styles.headerTitle}>Smart Agriculture Weather</Text>
                    </View>
                    <Text style={styles.headerSubtitle}>Get AI-powered weather insights for your crops</Text>
                </View>

                {/* Crop Selection */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="leaf" size={24} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>Select Crop</Text>
                    </View>
                    <TouchableOpacity style={styles.cropSelector} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
                        <View style={styles.selectedCropContent}>
                            <View style={styles.cropIcon}><Ionicons name="leaf" size={20} color={COLORS.primary} /></View>
                            <View style={styles.cropInfo}>
                                <Text style={styles.cropLabel}>Selected Crop</Text>
                                <Text style={styles.cropName}>{crop}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-down" size={24} color={COLORS.textLight} />
                    </TouchableOpacity>
                </View>

                {/* Inputs */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location" size={24} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>Location & Soil</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>City Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="location-outline" size={20} color={COLORS.textLight} />
                            <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Enter city name" placeholderTextColor={COLORS.textLight} />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Soil Drainage</Text>
                        <View style={styles.chipContainer}>
                            {(["poor", "moderate", "good"] as SoilDrainage[]).map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.drainageChip, soilDrainage === item && styles.drainageChipActive]}
                                    onPress={() => setSoilDrainage(item)}
                                >
                                    <Ionicons
                                        name={item === "good" ? "water" : item === "moderate" ? "hourglass" : "sad"}
                                        size={16}
                                        color={soilDrainage === item ? '#FFFFFF' : COLORS.primary}
                                    />
                                    <Text style={[styles.drainageChipText, soilDrainage === item && styles.drainageChipTextActive]}>
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Analyze Button */}
                <TouchableOpacity style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]} onPress={analyzeWeather} disabled={loading} activeOpacity={0.8}>
                    {loading ? <ActivityIndicator color="#FFFFFF" size="small" /> :
                        <View style={styles.buttonContent}>
                            <Ionicons name="analytics" size={20} color="#FFFFFF" />
                            <Text style={styles.analyzeButtonText}>Analyze Weather & Crop</Text>
                        </View>
                    }
                </TouchableOpacity>

                {/* Error */}
                {error && <View style={styles.errorCard}><Ionicons name="warning" size={24} color={COLORS.error} /><Text style={styles.errorText}>{error}</Text></View>}

                {/* Results */}
                {data?.success && (
                    <>
                        {/* Weather */}
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="partly-sunny" size={24} color={COLORS.primary} />
                                <Text style={styles.sectionTitle}>Weather Prediction</Text>
                            </View>
                            <View style={styles.weatherInfoGrid}>
                                <View style={styles.weatherMetric}>
                                    <Ionicons name="thermometer" size={20} color={COLORS.warning} />
                                    <Text style={styles.metricValue}>{data.weather.temp}°C</Text>
                                    <Text style={styles.metricLabel}>Temperature</Text>
                                </View>
                                <View style={styles.weatherMetric}>
                                    <Ionicons name="flag" size={20} color={COLORS.secondary} />
                                    <Text style={styles.metricValue}>{data.weather.wind} km/h</Text>
                                    <Text style={styles.metricLabel}>Wind Speed</Text>
                                </View>
                                {data.weather.rain !== undefined && (
                                    <View style={styles.weatherMetric}>
                                        <Ionicons name="rainy" size={20} color="#2196F3" />
                                        <Text style={styles.metricValue}>{data.weather.rain} mm</Text>
                                        <Text style={styles.metricLabel}>Rainfall</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.conditionContainer}>
                                <Text style={styles.conditionLabel}>Condition</Text>
                                <View style={styles.conditionBadge}><Text style={styles.conditionText}>{data.weather.ml_weather}</Text></View>
                                <Text style={styles.confidenceText}>Confidence: {(data.weather.ml_weather_prob * 100).toFixed(1)}%</Text>
                            </View>
                        </View>

                        {/* Disease Risk */}
                        {renderDiseaseRisk()}

                        {/* Yield Prediction */}
                        <View style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="bar-chart" size={24} color="#4CAF50" />
                                <Text style={styles.sectionTitle}>Yield Prediction</Text>
                            </View>
                            <View style={styles.yieldContainer}>
                                {renderYieldPrediction(data.yield_prediction)}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Crop Modal */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(false); setSearchQuery(""); }}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalTitleContainer}><Ionicons name="leaf" size={24} color={COLORS.primary} /><Text style={styles.modalTitle}>Select Crop</Text></View>
                            <TouchableOpacity onPress={() => { setModalVisible(false); setSearchQuery(""); }} style={styles.closeButton}><Ionicons name="close" size={24} color={COLORS.text} /></TouchableOpacity>
                        </View>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color={COLORS.textLight} />
                            <TextInput style={styles.searchInput} placeholder="Search crops..." placeholderTextColor={COLORS.textLight} value={searchQuery} onChangeText={setSearchQuery} autoFocus />
                            {searchQuery.length > 0 && <TouchableOpacity onPress={() => setSearchQuery("")}><Ionicons name="close-circle" size={20} color={COLORS.textLight} /></TouchableOpacity>}
                        </View>
                        <FlatList
                            data={filteredCrops}
                            renderItem={renderCropItem}
                            keyExtractor={(item) => item}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.modalList}
                            ListHeaderComponent={<Text style={styles.resultsText}>{filteredCrops.length} crops found</Text>}
                            ListEmptyComponent={
                                <View style={styles.emptyResults}>
                                    <Ionicons name="search" size={48} color={COLORS.textLight} />
                                    <Text style={styles.emptyResultsText}>No crops found for "{searchQuery}"</Text>
                                </View>
                            }
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default WeatherScreen;



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginLeft: 12,
    },
    headerSubtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        lineHeight: 22,
    },
    sectionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginLeft: 12,
    },
    cropSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    selectedCropContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cropIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cropInfo: {
        flex: 1,
    },
    cropLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    cropName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        paddingVertical: 14,
        marginLeft: 12,
    },
    chipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    drainageChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
        flex: 1,
        marginHorizontal: 4,
        justifyContent: 'center',
    },
    drainageChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    drainageChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        marginLeft: 8,
    },
    drainageChipTextActive: {
        color: '#FFFFFF',
    },
    analyzeButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 18,
        marginVertical: 8,
    },
    analyzeButtonDisabled: {
        opacity: 0.6,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    analyzeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    errorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        marginLeft: 12,
        flex: 1,
    },
    weatherInfoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    weatherMetric: {
        alignItems: 'center',
        flex: 1,
        padding: 8,
    },
    metricValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginVertical: 4,
    },
    metricLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    conditionContainer: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    conditionLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 8,
    },
    conditionBadge: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    conditionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    confidenceText: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    diseaseGrid: {
        marginTop: 8,
    },
    diseaseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    diseaseCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    diseaseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    diseaseName: {
        fontSize: 14,
        color: COLORS.text,
        marginLeft: 8,
        flex: 1,
        fontWeight: '600',
    },
    riskLevel: {
        fontSize: 14,
        fontWeight: '600',
    },
    riskDetails: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
    riskDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    yieldContainer: {
        alignItems: 'center',
    },
    yieldValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 16,
    },
    yieldIndicator: {
        width: '100%',
    },
    yieldBar: {
        height: 8,
        backgroundColor: COLORS.border,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    yieldFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    yieldLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    modalTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginLeft: 12,
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        marginHorizontal: 20,
        marginVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        paddingVertical: 14,
        marginLeft: 12,
        marginRight: 8,
    },
    modalList: {
        paddingHorizontal: 20,
    },
    cropModalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    cropModalItemActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    cropItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    cropIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cropTextContainer: {
        flex: 1,
    },
    cropModalText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    cropModalTextActive: {
        color: '#FFFFFF',
    },
    cropCategoryText: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    resultsText: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 16,
    },
    emptyResults: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyResultsText: {
        fontSize: 16,
        color: COLORS.textLight,
        marginTop: 16,
        textAlign: 'center',
    },

});
