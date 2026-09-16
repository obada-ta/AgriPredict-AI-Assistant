// import React, { useState, useRef, useEffect } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     ScrollView,
//     KeyboardAvoidingView,
//     Platform,
//     Keyboard,
//     TouchableWithoutFeedback,
//     Dimensions,
//     FlatList,
//     NativeScrollEvent,
//     NativeSyntheticEvent,
// } from 'react-native';

// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { SafeAreaView } from 'react-native-safe-area-context';

// interface Message {
//     text: string;
//     sender: 'user' | 'bot';
//     timestamp: Date;
// }

// const apiobad = "http://192.168.168.84:5000"
// const ChatbotScreen: React.FC = () => {
//     const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
//     const { height } = Dimensions.get('window');

//     const navigation = useNavigation<NavigationProp<any>>();

//     const [messages, setMessages] = useState<Message[]>([
//         {
//             text: "Hello! I'm your agriculture assistant. How can I help you today?",
//             sender: 'bot',
//             timestamp: new Date(),
//         },
//     ]);

//     const [inputText, setInputText] = useState<string>('');
//     const [isTyping, setIsTyping] = useState<boolean>(false);

//     const flatListRef = useRef<FlatList<Message>>(null);

//     const getBotResponse = async (question: string): Promise<string> => {
//         try {
//             const response = await fetch(
//                 `${apiobad}/api/chat-llm`,
//                 {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Accept: 'application/json',
//                     },
//                     body: JSON.stringify({ question }),
//                 }
//             );

//             const data = await response.json();
//             return data.answer || 'No answer found';
//         } catch (error) {
//             console.error('API Error:', error);
//             return 'Connection error. Please try again.';
//         }
//     };

//     const handleSend = async (): Promise<void> => {
//         if (!inputText.trim()) return;

//         const userMsg: Message = {
//             text: inputText,
//             sender: 'user',
//             timestamp: new Date(),
//         };

//         setMessages(prev => [...prev, userMsg]);
//         setInputText('');
//         setIsTyping(true);

//         const botResponse = await getBotResponse(inputText);

//         const botMsg: Message = {
//             text: botResponse,
//             sender: 'bot',
//             timestamp: new Date(),
//         };

//         setMessages(prev => [...prev, botMsg]);
//         setIsTyping(false);
//     };

//     const handleQuickQuestion = async (question: string): Promise<void> => {
//         const userMsg: Message = {
//             text: question,
//             sender: 'user',
//             timestamp: new Date(),
//         };

//         setMessages(prev => [...prev, userMsg]);
//         setIsTyping(true);

//         const botResponse = await getBotResponse(question);

//         const botMsg: Message = {
//             text: botResponse,
//             sender: 'bot',
//             timestamp: new Date(),
//         };

//         setMessages(prev => [...prev, botMsg]);
//         setIsTyping(false);
//     };

//     useEffect(() => {
//         flatListRef.current?.scrollToEnd({ animated: true });
//     }, [messages]);

//     const quickQuestions: string[] = [
//         'What is sustainable agriculture?',
//         'Best crops for clay soil',
//         'How to improve soil fertility',
//         'Organic farming benefits',
//         'When to harvest wheat',
//     ];

//     return (
//         <SafeAreaView
//             // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={{ flex: 1 }}
//         // keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
//         >

//             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                 <View style={styles.container}>

//                     {/* Header */}
//                     <View style={styles.header}>
//                         <TouchableOpacity onPress={() => navigation.goBack()}>
//                             <Ionicons name="arrow-back" size={24} color="#2a5c2a" />
//                         </TouchableOpacity>
//                         <Text style={styles.headerTitle}>Agriculture Assistant</Text>
//                     </View>{/* Chat Area */}
//                     <FlatList
//                         ref={flatListRef}
//                         data={messages}
//                         keyExtractor={(_, index) => index.toString()}
//                         renderItem={({ item }) => (
//                             <View
//                                 style={[
//                                     styles.messageBubble,
//                                     item.sender === 'user'
//                                         ? styles.userBubble
//                                         : styles.botBubble,
//                                 ]}
//                             >
//                                 <Text
//                                     style={[
//                                         styles.messageText,
//                                         item.sender === 'user'
//                                             ? styles.userText
//                                             : styles.botText,
//                                     ]}
//                                 >
//                                     {item.text}
//                                 </Text>
//                                 <Text style={styles.timestamp}>
//                                     {item.timestamp.toLocaleTimeString([], {
//                                         hour: '2-digit',
//                                         minute: '2-digit',
//                                     })}
//                                 </Text>
//                             </View>
//                         )}
//                         contentContainerStyle={styles.chatContainer}
//                         keyboardShouldPersistTaps="handled"
//                         ListFooterComponent={
//                             isTyping ? (
//                                 <View style={[styles.messageBubble, styles.botBubble]}>
//                                     <Text style={styles.typingText}>Typing...</Text>
//                                 </View>
//                             ) : null
//                         }
//                         onScroll={(
//                             event: NativeSyntheticEvent<NativeScrollEvent>
//                         ) => {
//                             setShowScrollTop(event.nativeEvent.contentOffset.y > 300);
//                         }}
//                     />

//                     {/* Scroll To Top */}
//                     {showScrollTop && (
//                         <TouchableOpacity
//                             style={styles.scrollTopButton}
//                             onPress={() =>
//                                 flatListRef.current?.scrollToOffset({
//                                     offset: 0,
//                                     animated: true,
//                                 })
//                             }
//                         >
//                             <Ionicons name="chevron-up" size={24} color="white" />
//                         </TouchableOpacity>
//                     )}

//                     {/* Quick Questions */}
//                     <ScrollView
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         style={styles.quickActions}
//                     >
//                         {quickQuestions.map((q, i) => (
//                             <TouchableOpacity
//                                 key={i}
//                                 style={styles.quickButton}
//                                 onPress={() => handleQuickQuestion(q)}
//                             >
//                                 <Text style={styles.quickText}>{q}</Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>

//                     {/* Input */}
//                     <View style={styles.inputContainer}>
//                         <TextInput
//                             style={styles.input}
//                             value={inputText}
//                             onChangeText={setInputText}
//                             placeholder="Ask about crops, soil, pests..."
//                             placeholderTextColor="#888"
//                             multiline
//                         />
//                         <TouchableOpacity
//                             style={styles.sendButton}
//                             onPress={handleSend}
//                             disabled={!inputText.trim()}
//                         >
//                             <Ionicons
//                                 name="send"
//                                 size={24}
//                                 color={inputText.trim() ? '#2a5c2a' : '#ccc'}
//                             />
//                         </TouchableOpacity>
//                     </View>

//                 </View>
//             </TouchableWithoutFeedback>

//         </SafeAreaView>

//     );
// };

// export default ChatbotScreen;
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//         paddingBottom: Platform.OS === 'android' ? 20 : 0,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 15,
//         backgroundColor: '#edf5ec',
//         borderBottomWidth: 1,
//         borderColor: '#d0e3ce',
//         height: 60,
//     },
//     headerTitle: {
//         flex: 1,
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#2a5c2a',
//         textAlign: 'center',
//         marginHorizontal: 10,
//     },
//     chatContainer: {
//         flexGrow: 1,
//         padding: 15,
//         paddingBottom: 100,
//     },
//     messageBubble: {
//         maxWidth: '80%',
//         padding: 12,
//         borderRadius: 12,
//         marginBottom: 10,
//         marginHorizontal: 5,
//     },
//     botBubble: {
//         alignSelf: 'flex-start',
//         backgroundColor: '#e3f2e1',
//         borderBottomLeftRadius: 0,
//     },
//     userBubble: {
//         alignSelf: 'flex-end',
//         backgroundColor: '#24954f',
//         borderBottomRightRadius: 0,
//     },
//     messageText: {
//         fontSize: 16,
//     },
//     botText: {
//         color: '#333',
//     },
//     userText: {
//         color: '#ffffff',
//     },
//     timestamp: {
//         fontSize: 10,
//         color: '#666',
//         marginTop: 5,
//         textAlign: 'right',
//     },
//     typingText: {
//         color: '#666',
//         fontStyle: 'italic',
//     },
//     quickActions: {
//         paddingVertical: 8,
//         backgroundColor: '#f0f7ef',
//         maxHeight: 50,
//     },
//     quickButton: {
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         backgroundColor: '#5d9c5a',
//         borderRadius: 16,
//         marginHorizontal: 4,
//         height: 34,
//         justifyContent: 'center',
//     },
//     quickText: {
//         color: 'white',
//         fontSize: 13,
//         fontWeight: '500',
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         backgroundColor: '#ffffff',
//         borderTopWidth: 1,
//         borderColor: '#ddd',
//         paddingBottom: Platform.OS === 'ios' ? 25 : 10,
//     },
//     input: {
//         flex: 1,
//         minHeight: 40,
//         maxHeight: 100,
//         paddingHorizontal: 15,
//         backgroundColor: '#f0f0f0',
//         borderRadius: 20,
//         fontSize: 16,
//         paddingVertical: Platform.OS === 'ios' ? 10 : 5,
//         textAlignVertical: 'center',
//         marginBottom: Platform.OS === 'ios' ? 5 : 0,
//     },
//     sendButton: {
//         marginLeft: 10,
//         padding: 8,
//     },
//     scrollTopButton: {
//         position: 'absolute',
//         bottom: 100,
//         right: 20,
//         backgroundColor: '#24954f',
//         padding: 12,
//         borderRadius: 30,
//         elevation: 3,
//         zIndex: 999,
//     },
// });
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from 'react-native';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const apiobad = "http://192.168.169.134:5000"

const ChatbotScreen: React.FC = () => {
    const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
    const navigation = useNavigation<NavigationProp<any>>();

    const [messages, setMessages] = useState<Message[]>([
        {
            text: "Hello! I'm your agriculture assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);

    const [inputText, setInputText] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const flatListRef = useRef<FlatList<Message>>(null);

    const getBotResponse = async (question: string): Promise<string> => {
        try {
            const response = await fetch(
                `${apiobad}/api/chat-llm`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({ question }),
                }
            );

            const data = await response.json();
            return data.answer || 'No answer found';
        } catch (error) {
            console.error('API Error:', error);
            return 'Connection error. Please try again.';
        }
    };

    const handleSend = async (): Promise<void> => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        const botResponse = await getBotResponse(inputText);

        const botMsg: Message = {
            text: botResponse,
            sender: 'bot',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
    };

    const handleQuickQuestion = async (question: string): Promise<void> => {
        const userMsg: Message = {
            text: question,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        const botResponse = await getBotResponse(question);

        const botMsg: Message = {
            text: botResponse,
            sender: 'bot',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const quickQuestions: string[] = [
        'What is sustainable agriculture?',
        // 'Best crops for clay soil',
        'How to improve soil fertility',
        'Organic farming benefits',
        'When to harvest wheat',
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flexOne}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.backButton}
                            >
                                <Ionicons name="arrow-back" size={24} color="#2a5c2a" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Agriculture Assistant</Text>
                            <View style={styles.headerSpacer} />
                        </View>

                        {/* Chat Area */}
                        <View style={styles.chatArea}>
                            <FlatList
                                ref={flatListRef}
                                data={messages}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    const isUser = item.sender === 'user';
                                    const isFirstOfType = index === 0 || messages[index - 1].sender !== item.sender;
                                    const isLastOfType = index === messages.length - 1 || messages[index + 1].sender !== item.sender;

                                    return (
                                        <View
                                            style={[
                                                styles.messageContainer,
                                                isUser ? styles.userContainer : styles.botContainer,
                                                isFirstOfType && (isUser ? styles.userFirst : styles.botFirst),
                                                isLastOfType && (isUser ? styles.userLast : styles.botLast),
                                            ]}
                                        >
                                            {/* Bot Avatar */}
                                            {!isUser && (
                                                <View style={styles.botAvatar}>
                                                    <Ionicons name="leaf" size={16} color="#2a5c2a" />
                                                </View>
                                            )}

                                            <View style={styles.messageContent}>
                                                {/* Message Bubble */}
                                                <View style={[
                                                    styles.messageBubble,
                                                    isUser ? styles.userBubble : styles.botBubble,
                                                    isFirstOfType && (isUser ? styles.userBubbleFirst : styles.botBubbleFirst),
                                                    isLastOfType && (isUser ? styles.userBubbleLast : styles.botBubbleLast),
                                                ]}>
                                                    <Text style={[
                                                        styles.messageText,
                                                        isUser ? styles.userText : styles.botText,
                                                    ]}>
                                                        {item.text}
                                                    </Text>

                                                    {/* Message Tail */}
                                                    {isLastOfType && (
                                                        <View style={[
                                                            styles.messageTail,
                                                            isUser ? styles.userTail : styles.botTail,
                                                        ]} />
                                                    )}
                                                </View>

                                                {/* Timestamp and Status */}
                                                <View style={[
                                                    styles.messageFooter,
                                                    isUser ? styles.userFooter : styles.botFooter,
                                                ]}>
                                                    <Text style={[
                                                        styles.timestamp,
                                                        isUser ? styles.userTimestamp : styles.botTimestamp,
                                                    ]}>
                                                        {item.timestamp.toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </Text>

                                                    {/* User message status */}
                                                    {isUser && isLastOfType && (
                                                        <View style={styles.statusContainer}>
                                                            <Ionicons
                                                                name="checkmark-done"
                                                                size={12}
                                                                color="#24954f"
                                                                style={styles.statusIcon}
                                                            />
                                                        </View>
                                                    )}
                                                </View>
                                            </View>

                                            {/* User Avatar */}
                                            {isUser && (
                                                <View style={styles.userAvatar}>
                                                    <Ionicons name="person" size={16} color="white" />
                                                </View>
                                            )}
                                        </View>
                                    );
                                }}

                                // استبدل الـ ListFooterComponent بالكود التالي:
                                ListFooterComponent={
                                    isTyping ? (
                                        <View style={styles.typingContainer}>
                                            <View style={styles.typingAvatar}>
                                                <Ionicons name="leaf" size={16} color="#2a5c2a" />
                                            </View>
                                            <View style={styles.typingBubble}>
                                                <View style={styles.typingDots}>
                                                    <View style={[styles.typingDot, styles.typingDot1]} />
                                                    <View style={[styles.typingDot, styles.typingDot2]} />
                                                    <View style={[styles.typingDot, styles.typingDot3]} />
                                                </View>
                                            </View>
                                        </View>
                                    ) : null
                                }
                                onScroll={(
                                    event: NativeSyntheticEvent<NativeScrollEvent>
                                ) => {
                                    setShowScrollTop(event.nativeEvent.contentOffset.y > 300);
                                }}
                            />

                            {/* Scroll To Top */}
                            {showScrollTop && (
                                <TouchableOpacity
                                    style={styles.scrollTopButton}
                                    onPress={() =>
                                        flatListRef.current?.scrollToOffset({
                                            offset: 0,
                                            animated: true,
                                        })
                                    }
                                >
                                    <Ionicons name="chevron-up" size={24} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Quick Questions */}
                        <View style={styles.quickQuestionsContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.quickQuestionsContent}
                            >
                                {quickQuestions.map((q, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={styles.quickButton}
                                        onPress={() => handleQuickQuestion(q)}
                                    >
                                        <Text style={styles.quickText} numberOfLines={1}>
                                            {q}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Input Container */}
                        <View style={styles.inputWrapper}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={inputText}
                                    onChangeText={setInputText}
                                    placeholder="Ask about crops, soil, pests..."
                                    placeholderTextColor="#888"
                                    multiline
                                    maxLength={500}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => {
                                        if (inputText.trim()) {
                                            handleSend();
                                        }
                                    }}
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.sendButton,
                                        !inputText.trim() && styles.sendButtonDisabled
                                    ]}
                                    onPress={handleSend}
                                    disabled={!inputText.trim()}
                                >
                                    <Ionicons
                                        name="send"
                                        size={22}
                                        color={inputText.trim() ? '#2a5c2a' : '#ccc'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    flexOne: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: '#edf5ec',
        borderBottomWidth: 1,
        borderColor: '#d0e3ce',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2a5c2a',
        textAlign: 'center',
        flex: 1,
        marginHorizontal: 10,
    },
    headerSpacer: {
        width: 32,
    },
    chatArea: {
        flex: 1,
        position: 'relative',
    },
    typingText: {
        color: '#666',
        fontStyle: 'italic',
        fontSize: 14,
    },

    quickQuestionsContent: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        alignItems: 'center',
    },
 
    inputWrapper: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 25 : 15,
        paddingHorizontal: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#f0f0f0',
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 8 : 4,
        minHeight: 48,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        maxHeight: 100,
        paddingTop: Platform.OS === 'ios' ? 8 : 4,
        paddingBottom: Platform.OS === 'ios' ? 8 : 4,
        textAlignVertical: 'center',
    },
    sendButton: {
        marginLeft: 8,
        marginBottom: Platform.OS === 'ios' ? 4 : 2,
        padding: 6,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    scrollTopButton: {
        position: 'absolute',
        bottom: 20,
        right: 15,
        backgroundColor: '#24954f',
        padding: 10,
        borderRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 2,
        paddingHorizontal: 12,
        alignItems: 'flex-end',
    },
    userContainer: {
        justifyContent: 'flex-end',
    },
    botContainer: {
        justifyContent: 'flex-start',
    },
    userFirst: {
        marginTop: 12,
    },
    botFirst: {
        marginTop: 12,
    },
    userLast: {
        marginBottom: 4,
    },
    botLast: {
        marginBottom: 4,
    },

    // Avatars
    botAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e3f2e1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        borderWidth: 2,
        borderColor: '#d0e3ce',
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#24954f',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        borderWidth: 2,
        borderColor: '#1d7a3d',
    },

    // Message Content
    messageContent: {
        maxWidth: '75%',
        flex: 1,
    },

    // Message Bubble
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        position: 'relative',
    },
    botBubble: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    botBubbleFirst: {
        borderTopLeftRadius: 20,
    },
    botBubbleLast: {
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: '#24954f',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    userBubbleFirst: {
        borderTopRightRadius: 20,
    },
    userBubbleLast: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 4,
    },

    // Message Tail
    messageTail: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderWidth: 8,
        borderStyle: 'solid',
        bottom: 0,
    },
    botTail: {
        left: -8,
        borderTopColor: 'transparent',
        borderRightColor: '#ffffff',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightWidth: 10,
    },
    userTail: {
        right: -8,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: '#24954f',
        borderLeftWidth: 10,
    },

    // Message Text
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        letterSpacing: 0.2,
    },
    botText: {
        color: '#1a1a1a',
    },
    userText: {
        color: '#ffffff',
    },

    // Message Footer
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    botFooter: {
        justifyContent: 'flex-start',
        paddingLeft: 12,
    },
    userFooter: {
        justifyContent: 'flex-end',
        paddingRight: 12,
    },
    timestamp: {
        fontSize: 11,
        opacity: 0.6,
    },
    botTimestamp: {
        color: '#666666',
    },
    userTimestamp: {
        color: '#ffffff',
    },
    statusContainer: {
        marginLeft: 4,
    },
    statusIcon: {
        opacity: 0.8,
    },

    // Typing Indicator
    typingContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 4,
        paddingHorizontal: 12,
    },
    typingAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e3f2e1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        borderWidth: 2,
        borderColor: '#d0e3ce',
    },
    typingBubble: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    typingDots: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
    },
    typingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#666666',
        marginHorizontal: 2,
    },
    typingDot1: {
        opacity: 0.4,
        transform: [{ scale: 0.8 }],
    },
    typingDot2: {
        opacity: 0.6,
        transform: [{ scale: 0.9 }],
    },
    typingDot3: {
        opacity: 0.8,
        transform: [{ scale: 1 }],
    },

    // Quick Questions (تعديل بسيط)
    quickQuestionsContainer: {
        backgroundColor: '#f8fcf8',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#d0e3ce',
        maxHeight: 60,
        minHeight: 52,
    },
    quickButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(36, 149, 79, 0.1)',
        borderRadius: 20,
        marginHorizontal: 6,
        borderWidth: 1,
        borderColor: 'rgba(36, 149, 79, 0.3)',
        maxWidth: 220,
    },
    quickText: {
        color: '#24954f',
        fontSize: 13,
        fontWeight: '500',
    },

    // Chat Container
    chatContainer: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        paddingBottom: 20,
    },
});