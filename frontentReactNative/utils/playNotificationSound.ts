import { Audio } from 'expo-av';

let sound: Audio.Sound | null = null;

export const playNotificationSound = async () => {
    try {
        // تحميل الصوت مرة واحدة
        if (!sound) {
            sound = new Audio.Sound();
            await sound.loadAsync(
                require('@/assets/notification.mp3'),
                { shouldPlay: true }
            );
        } else {
            await sound.replayAsync();
        }
    } catch (error) {
        console.log('🔔 Sound error:', error);
    }
};
