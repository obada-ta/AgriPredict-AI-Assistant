import React, { useRef, useState } from 'react';
import {
    View,
    TouchableOpacity,
    PanResponder,
    Animated,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/theme';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DraggableChatbotIcon = () => {
    const router = useRouter();
    const pan = useRef(new Animated.ValueXY()).current;
    const [position, setPosition] = useState({
        x: SCREEN_WIDTH - 80,
        y: SCREEN_HEIGHT / 2 - 30,
    });
    const isDragging = useRef(false);

    // إنشاء PanResponder للسحب
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: (evt, gestureState) => {
                isDragging.current = false;
            },

            onPanResponderMove: (evt, gestureState) => {
                // إذا تحرك المستخدم أكثر من 10 بكسل، نعتبره سحباً
                if (Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10) {
                    isDragging.current = true;
                }
                Animated.event(
                    [
                        null,
                        { dx: pan.x, dy: pan.y }
                    ],
                    { useNativeDriver: false }
                )(evt, gestureState);
            },

            onPanResponderRelease: (e, gestureState) => {
                pan.flattenOffset();

                // حساب الموضع النهائي مع حدود الشاشة
                const finalX = position.x + gestureState.dx;
                const finalY = position.y + gestureState.dy;

                // التأكد من بقاء الأيقونة داخل حدود الشاشة
                const boundedX = Math.max(
                    10,
                    Math.min(finalX, SCREEN_WIDTH - 70)
                );
                const boundedY = Math.max(
                    50,
                    Math.min(finalY, SCREEN_HEIGHT - 130)
                );

                // تحديث الموضع
                setPosition({ x: boundedX, y: boundedY });

                // إعادة تعيين قيمة pan للحركة التالية
                pan.setValue({ x: 0, y: 0 });

                // إذا لم يكن سحباً، ندع onPress يعمل
                if (!isDragging.current) {
                    handlePress();
                }
            },

            onPanResponderTerminate: () => {
                pan.flattenOffset();
            },
        })
    ).current;

    // عند الضغط على الأيقونة للانتقال إلى الشات
    const handlePress = () => {
        router.push('/Chatbot');
    };

    return (
        <Animated.View
            style={[
                styles.draggableIcon,
                {
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y },
                    ],
                },
                {
                    position: 'absolute',
                    left: position.x,
                    top: position.y,
                }
            ]}
            {...panResponder.panHandlers}
        >
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.8}
                style={styles.iconButton}
            >
                <View style={styles.iconContainer}>
                    <FontAwesome6
                        name="robot"
                        size={32}
                        color="white"
                    />
                    {/* تأثير النبض */}
                    <View style={styles.pulseEffect} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};
const styles = StyleSheet.create({
    draggableIcon: {
        zIndex: 9999,
        elevation: 10,
    },
    iconButton: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 2,
        borderColor: 'white',
    },
    pulseEffect: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.primary,
        opacity: 0.3,
        zIndex: -1,
    },
});

export default DraggableChatbotIcon;