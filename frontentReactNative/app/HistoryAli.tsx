import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    ScrollView,
    RefreshControl,
    Dimensions,
    Modal,
    Image,
} from 'react-native';

import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/stores/authstore';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '@/constants/Api';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Type definition for API data
type Prediction = {
    _id: string;
    type: string;
    output: any;
    confidence: number | null;
    image: string | null;
    input?: any;
    createdAt: string;
    updatedAt: string;
    user: string;
    flaskUrl: string;
    __v: number;
}

// Filter types
type FilterType = {
    label: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
}

// Type mapping for better display
const TYPE_DISPLAY_NAMES: Record<string, string> = {
    'SOIL': 'Soil Analysis',
    'PLANT': 'Plant Type',
    'PLANT-DISEASE': 'Plant Disease',
    'ANALYZE-LAND': 'Land Analysis',
    'CROP': 'Crop Recommendation',
    'CROP-YIELD': 'Crop Yield',
    'DISEASE': 'Plant Disease'
};

export default function HistoryAI() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { token } = useAuthStore();

    // Filter types available with icons
    const filterTypes: FilterType[] = useMemo(() => [
        { label: 'All', value: 'ALL', icon: 'apps' },
        { label: 'Soil', value: 'SOIL', icon: 'earth' },
        { label: 'Plant', value: 'PLANT', icon: 'leaf' },
        { label: 'Disease', value: 'PLANT-DISEASE', icon: 'medkit' },
        { label: 'Land', value: 'ANALYZE-LAND', icon: 'map' },
        { label: 'Crop', value: 'CROP', icon: 'rose' },
        { label: 'Yield', value: 'CROP-YIELD', icon: 'bar-chart' },
    ], []);

    // Fetch data from API
    const fetchData = useCallback(async (isRefreshing = false) => {
        try {
            if (!isRefreshing) setLoading(true);
            setRefreshing(isRefreshing);
            setError(null);

            const response = await fetch(`${BASE_URL}/api/ai/predictions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setPredictions(data);
            } else {
                console.warn('Received data is not an array:', data);
                setPredictions([]);
                setError('Invalid data format received');
            }
        } catch (error: any) {
            console.error('Error fetching predictions:', error);
            setError(error.message || 'Failed to load predictions. Please check your connection.');
            setPredictions([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Filter predictions by selected type
    const filteredPredictions = useMemo(() => {
        if (!predictions || !Array.isArray(predictions)) {
            return [];
        }
        if (selectedType === 'ALL') {
            return predictions;
        }
        return predictions.filter(item => item && item.type === selectedType);
    }, [predictions, selectedType]);

    // Get color based on prediction type
    const getTypeColor = useCallback((type: string): string => {
        switch (type) {
            case 'SOIL':
                return '#8B4513';
            case 'PLANT':
                return COLORS.primary;
            case 'PLANT-DISEASE':
            case 'DISEASE':
                return COLORS.error;
            case 'ANALYZE-LAND':
                return COLORS.secondary;
            case 'CROP':
                return '#FFA500';
            case 'CROP-YIELD':
                return '#4B0082';
            default:
                return COLORS.grey;
        }
    }, []);

    // Get icon based on prediction type
    const getTypeIcon = useCallback((type: string): keyof typeof Ionicons.glyphMap => {
        switch (type) {
            case 'SOIL': return 'earth';
            case 'PLANT': return 'leaf';
            case 'PLANT-DISEASE':
            case 'DISEASE': return 'medkit';
            case 'ANALYZE-LAND': return 'map';
            case 'CROP': return 'rose';
            case 'CROP-YIELD': return 'bar-chart';
            default: return 'document-text';
        }
    }, []);

    // Format date
    const formatDate = useCallback((dateString: string, detailed = false) => {
        try {
            const date = new Date(dateString);
            if (detailed) {
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }

            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                return 'Today';
            } else if (diffDays === 1) {
                return 'Yesterday';
            } else if (diffDays < 7) {
                return date.toLocaleDateString('en-US', { weekday: 'long' });
            } else {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                });
            }
        } catch {
            return dateString;
        }
    }, []);

    // Open modal with prediction details
    const openPredictionDetails = useCallback((prediction: Prediction) => {
        setSelectedPrediction(prediction);
        setModalVisible(true);
    }, []);

    // Close modal
    const closeModal = useCallback(() => {
        setModalVisible(false);
        setTimeout(() => setSelectedPrediction(null), 300);
    }, []);

    // Render confidence percentage with color
    const renderConfidence = useCallback((confidence: number | null) => {
        if (confidence === null || confidence === undefined) return null;

        let color = COLORS.success;
        let label = 'High';
        if (confidence < 50) {
            color = COLORS.error;
            label = 'Low';
        } else if (confidence < 70) {
            color = COLORS.warning;
            label = 'Medium';
        }

        return (
            <View style={styles.confidenceContainer}>
                <View style={styles.confidenceInfo}>
                    <Text style={[styles.confidenceLabel, { color }]}>
                        {label} Confidence
                    </Text>
                    <Text style={[styles.confidenceValue, { color }]}>
                        {confidence.toFixed(1)}%
                    </Text>
                </View>
                <View style={styles.confidenceBar}>
                    <View
                        style={[
                            styles.confidenceFill,
                            {
                                width: `${Math.min(confidence, 100)}%`,
                                backgroundColor: color
                            }
                        ]}
                    />
                </View>
            </View>
        );
    }, []);

    // Render each prediction item
    const renderPredictionItem = useCallback(({ item }: { item: Prediction }) => {
        const getDisplayValue = () => {
            const output = item.output;
            if (!output) return 'N/A';

            switch (item.type) {
                case 'SOIL':
                    return output.class || 'N/A';
                case 'PLANT':
                    return output.plant_type || 'N/A';
                case 'PLANT-DISEASE':
                case 'DISEASE':
                    return output.disease || 'N/A';
                case 'ANALYZE-LAND':
                    return output.suitability || 'N/A';
                case 'CROP':
                    return output.recommended_crop || 'N/A';
                case 'CROP-YIELD':
                    return `${output.predicted_yield || 'N/A'} ${output.unit || ''}`;
                default:
                    return 'View Details';
            }
        };

        return (
            <TouchableOpacity
                style={styles.predictionCard}
                activeOpacity={0.7}
                onPress={() => openPredictionDetails(item)}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.typeContainer}>
                        <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]} />
                        <Text style={styles.typeText}>
                            {TYPE_DISPLAY_NAMES[item.type] || item.type}
                        </Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <Ionicons name="time" size={12} color={COLORS.textLight} />
                        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.previewValue} numberOfLines={2}>
                        {getDisplayValue()}
                    </Text>

                    {item.confidence !== null && item.confidence !== undefined && (
                        <View style={styles.previewConfidence}>
                            <Text style={styles.previewConfidenceText}>
                                {item.confidence.toFixed(1)}% confident
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardFooter}>
                    {/* <Text style={styles.previewId}>ID: {item._id.substring(0, 8)}...</Text> */}
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
                </View>
            </TouchableOpacity>
        );
    }, [getTypeColor, formatDate, openPredictionDetails]);

    // Render detailed prediction view in modal
    const renderPredictionDetails = useCallback(() => {
        if (!selectedPrediction) return null;

        const { type, output, confidence, input, createdAt, image, _id } = selectedPrediction;
        const typeColor = getTypeColor(type);

        return (
            <View style={styles.modalContent}>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                    <View style={styles.modalTitleContainer}>
                        <Ionicons name={getTypeIcon(type)} size={24} color={typeColor} />
                        <Text style={styles.modalTitle}>
                            {TYPE_DISPLAY_NAMES[type] || type}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={COLORS.textLight} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.modalScrollContent}
                >
                    {/* Image Section */}
                    {image && (
                        <View style={styles.imageSection}>
                            <Text style={styles.sectionTitle}>Image</Text>
                            <Image
                                source={{ uri: `${BASE_URL}${image}` }}
                                style={styles.predictionImage}
                                resizeMode="cover"
                            />
                        </View>
                    )}

                    {/* Results Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Results</Text>
                        {renderOutputDetails(output, type)}
                    </View>

                    {/* Confidence Section */}
                    {confidence !== null && confidence !== undefined && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Confidence Score</Text>
                            {renderConfidence(confidence)}
                        </View>
                    )}

                    {/* Input Parameters Section */}
                    {input && Object.keys(input).length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Input Parameters</Text>
                            <View style={styles.inputGrid}>
                                {Object.entries(input).map(([key, value]) => (
                                    <View key={key} style={styles.inputItem}>
                                        <Text style={styles.inputKey}>{key}</Text>
                                        <Text style={styles.inputValue}>{String(value)}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Metadata Section */}
                    {/* <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Details</Text>
                        <View style={styles.metadataContainer}>
                            <View style={styles.metadataRow}>
                                <Ionicons name="calendar" size={16} color={COLORS.textLight} />
                                <Text style={styles.metadataText}>
                                    {formatDate(createdAt, true)}
                                </Text>
                            </View>
                            <View style={styles.metadataRow}>
                                <Ionicons name="finger-print" size={16} color={COLORS.textLight} />
                                <Text style={styles.metadataText}>
                                    ID: {_id}
                                </Text>
                            </View>
                        </View>
                    </View> */}
                </ScrollView>
            </View>
        );
    }, [selectedPrediction, getTypeColor, getTypeIcon, formatDate, closeModal]);

    // Render detailed output based on type
    const renderOutputDetails = useCallback((output: any, type: string) => {
        if (!output) return null;

        switch (type) {
            case 'SOIL':
                return (
                    <View style={styles.outputDetails}>
                        <Text style={styles.detailLabel}>Soil Type</Text>
                        <Text style={styles.detailValue}>{output.class || 'N/A'}</Text>
                    </View>
                );

            case 'PLANT':
                return (
                    <View style={styles.outputDetails}>
                        <Text style={styles.detailLabel}>Plant Type</Text>
                        <Text style={styles.detailValue}>{output.plant_type || 'N/A'}</Text>
                    </View>
                );

            case 'PLANT-DISEASE':
            case 'DISEASE':
                return (
                    <View style={styles.outputDetails}>
                        <Text style={styles.detailLabel}>Disease</Text>
                        <Text style={styles.detailValue}>{output.disease || 'N/A'}</Text>
                    </View>
                );

            case 'ANALYZE-LAND':
                return (
                    <View style={styles.outputDetails}>
                        <Text style={styles.detailLabel}>Land Suitability</Text>
                        <Text style={[styles.detailValue,
                        { color: output.suitabilityPercentage === 0 ? COLORS.error : COLORS.success }
                        ]}>
                            {output.suitability || 'N/A'}
                        </Text>
                        {output.suitabilityPercentage !== undefined && (
                            <Text style={styles.detailSubtext}>
                                Score: {output.suitabilityPercentage}%
                            </Text>
                        )}
                    </View>
                );

            case 'CROP':
                return (
                    <View style={styles.outputDetails}>
                        <Text style={styles.detailLabel}>Recommended Crop</Text>
                        <Text style={styles.detailValue}>{output.recommended_crop || 'N/A'}</Text>
                        {output.top_crops && (
                            <View style={styles.topCropsContainer}>
                                <Text style={styles.detailSubtext}>Top Recommendations:</Text>
                                {output.top_crops.slice(0, 3).map((crop: any, index: number) => (
                                    <View key={index} style={styles.cropItem}>
                                        <Text style={styles.cropName}>{crop.crop}</Text>
                                        <Text style={styles.cropProbability}>{crop.probability}%</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                );

            case 'CROP-YIELD':
                return (
                    <View style={styles.outputDetails}>
                        <Text style={styles.detailLabel}>Predicted Yield</Text>
                        <Text style={styles.detailValue}>
                            {output.predicted_yield || 'N/A'} {output.unit || ''}
                        </Text>
                    </View>
                );

            default:
                return (
                    <View style={styles.outputDetails}>
                        <Text style={styles.detailLabel}>Result</Text>
                        <Text style={styles.detailValue}>
                            {JSON.stringify(output, null, 2)}
                        </Text>
                    </View>
                );
        }
    }, []);

    // Render filter buttons
    const renderFilterButton = useCallback((filter: FilterType) => (
        <TouchableOpacity
            key={filter.value}
            style={[
                styles.filterButton,
                selectedType === filter.value && styles.filterButtonActive
            ]}
            onPress={() => setSelectedType(filter.value)}
        >
            <Ionicons
                name={filter.icon}
                size={18}
                color={selectedType === filter.value ? '#FFFFFF' : COLORS.textLight}
                style={styles.filterIcon}
            />
            <Text style={[
                styles.filterButtonText,
                selectedType === filter.value && styles.filterButtonTextActive
            ]}>
                {filter.label}
            </Text>
        </TouchableOpacity>
    ), [selectedType]);

    // حساب الإحصائيات
    const stats = useMemo(() => {
        if (!predictions || !Array.isArray(predictions)) {
            return { total: 0, byType: {} };
        }

        const byType: Record<string, number> = {};
        predictions.forEach(pred => {
            if (pred.type) {
                byType[pred.type] = (byType[pred.type] || 0) + 1;
            }
        });

        return {
            total: predictions.length,
            byType
        };
    }, [predictions]);

    // Handle pull to refresh
    const onRefresh = useCallback(() => {
        fetchData(true);
    }, [fetchData]);

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading predictions...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>AI Predictions</Text>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={() => fetchData(true)}
                        disabled={refreshing}
                    >
                        <Ionicons
                            name="refresh"
                            size={20}
                            color={refreshing ? COLORS.textLight : COLORS.primary}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.total}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{filteredPredictions.length}</Text>
                        <Text style={styles.statLabel}>Filtered</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {predictions.length > 0
                                ? new Date(Math.max(...predictions.map(p => new Date(p.createdAt).getTime()))).toLocaleDateString('en-US', { month: 'short' })
                                : '--'
                            }
                        </Text>
                        <Text style={styles.statLabel}>Latest</Text>
                    </View>
                </View>
            </View>

            {/* Filter Section */}
            <View style={styles.filterContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScrollContent}
                >
                    {filterTypes.map(renderFilterButton)}
                </ScrollView>
            </View>

            {/* Content Section */}
            <View style={styles.contentContainer}>
                {error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="warning" size={64} color={COLORS.error} />
                        <Text style={styles.errorTitle}>Unable to Load Data</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.errorActionButton}
                            onPress={() => fetchData()}
                        >
                            <Text style={styles.errorActionText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : filteredPredictions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text" size={64} color={COLORS.textLight} />
                        <Text style={styles.emptyTitle}>No predictions found</Text>
                        <Text style={styles.emptyText}>
                            {selectedType === 'ALL'
                                ? 'Start by making your first AI prediction'
                                : `No ${selectedType.toLowerCase()} predictions available`
                            }
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyActionButton}
                            onPress={() => setSelectedType('ALL')}
                        >
                            <Text style={styles.emptyActionText}>View All Predictions</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={filteredPredictions}
                        renderItem={renderPredictionItem}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[COLORS.primary]}
                                tintColor={COLORS.primary}
                            />
                        }
                        ListHeaderComponent={
                            <View style={styles.listHeader}>
                                <Text style={styles.listHeaderText}>
                                    Showing {filteredPredictions.length} of {predictions.length} predictions
                                </Text>
                            </View>
                        }
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                    />
                )}
            </View>

            {/* Modal for Prediction Details */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {renderPredictionDetails()}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        marginBottom: 10
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    refreshButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: COLORS.surface,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textLight,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: COLORS.borderLight,
    },
    filterContainer: {
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
        paddingVertical: 12,
    },
    filterScrollContent: {
        paddingHorizontal: 20,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterIcon: {
        marginRight: 6,
    },
    filterButtonText: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    filterButtonTextActive: {
        color: '#FFFFFF',
    },
    contentContainer: {
        flex: 1,
    },
    listContainer: {
        padding: 20,
        paddingTop: 10,
    },
    listHeader: {
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    listHeaderText: {
        fontSize: 14,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    predictionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    typeText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: COLORS.textLight,
        marginLeft: 4,
    },
    cardBody: {
        marginBottom: 12,
    },
    previewValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
        lineHeight: 24,
    },
    previewConfidence: {
        backgroundColor: COLORS.borderLight,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    previewConfidenceText: {
        fontSize: 12,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',

        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
    previewId: {
        fontSize: 11,
        color: COLORS.textLight,
        fontFamily: 'monospace',
    },
    confidenceContainer: {
        marginVertical: 12,
    },
    confidenceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    confidenceLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    confidenceValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    confidenceBar: {
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: 3,
        overflow: 'hidden',
    },
    confidenceFill: {
        height: '100%',
        borderRadius: 3,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.textLight,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        backgroundColor: COLORS.background,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    emptyActionButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyActionText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        backgroundColor: COLORS.background,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.error,
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    errorActionButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    errorActionText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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
        height: SCREEN_HEIGHT * 0.85,
        overflow: 'hidden',
    },
    modalContent: {
        flex: 1,
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
    modalScrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    // Modal Sections
    section: {
        marginBottom: 24,
    },
    imageSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    predictionImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        backgroundColor: COLORS.borderLight,
    },
    outputDetails: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    detailLabel: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    detailSubtext: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 4,
    },
    topCropsContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
    cropItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    cropName: {
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    cropProbability: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    inputGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    inputItem: {
        width: '50%',
        padding: 4,
    },
    inputKey: {
        fontSize: 12,
        color: COLORS.textLight,
        marginBottom: 2,
        textTransform: 'capitalize',
    },
    inputValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    metadataContainer: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    metadataRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    metadataText: {
        fontSize: 14,
        color: COLORS.text,
        marginLeft: 8,
        flex: 1,
    },
}); `                                                                                                                                                                                                                                                                                                                    `