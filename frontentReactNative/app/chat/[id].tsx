// import { BASE_URL } from "@/constants/Api";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authstore";
// import { useSocketStore } from "@/stores/socketStore";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect, useRef, useState } from "react";

// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,

//     StyleSheet,
//     Platform,
//     Alert,
//     Image,
//     KeyboardAvoidingView,
//     ActivityIndicator,
//     Modal,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// // أنواع البيانات
// interface Sender {
//     _id: string;
//     name: string;
//     avatarUrl?: string;
// }

// interface Message {
//     _id: string;
//     sender: Sender;
//     content: string;
//     createdAt: string;
//     edited?: boolean;
//     editedAt?: string;
//     deletedFor?: string[];
// }

// interface Participant {
//     _id: string;
//     name: string;
//     avatarUrl?: string;
// }

// interface ConversationData {
//     _id: string;
//     participant: Participant;
// }

// export default function ChatScreen() {
//     const router = useRouter();
//     const { id } = useLocalSearchParams<{ id: string }>();
//     const { token, user: currentUser } = useAuthStore();

//     const [conversation, setConversation] = useState<ConversationData | null>(null);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [editingMessage, setEditingMessage] = useState<Message | null>(null);
//     const [showMessageMenu, setShowMessageMenu] = useState(false);
//     const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
//     const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
//     const [isOnline, setIsOnline] = useState(false);

//     const flatListRef = useRef<FlatList>(null);

//     // 🌐 جلب معلومات المحادثة (للحصول على الطرف الآخر بدقة)
//     const fetchConversation = async () => {
//         if (!id || !token || !currentUser) return;

//         try {
//             const convRes = await fetch(`${BASE_URL}/api/chat/conversations/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             if (convRes.ok) {
//                 const convData = await convRes.json();
//                 const otherParticipant = convData.participants?.find(
//                     (p: any) => p._id !== currentUser.id
//                 ) || {
//                     _id: 'unknown',
//                     name: 'User',
//                     avatarUrl: undefined,
//                 };

//                 setConversation({
//                     _id: id,
//                     participant: otherParticipant,
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching conversation:', error);
//         }
//     };

//     // 📥 جلب الرسائل
//     const fetchMessages = async () => {
//         if (!id || !token) {
//             setLoading(false);
//             return;
//         }

//         try {
//             await fetchConversation();

//             const msgRes = await fetch(`${BASE_URL}/api/chat/messages/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             if (!msgRes.ok) {
//                 const err = await msgRes.json();
//                 throw new Error(err.message || 'Failed to load messages');
//             }

//             const msgData = await msgRes.json();
//             const messagesList: Message[] = msgData.messages || [];

//             const filteredMessages = messagesList.filter(
//                 msg => !msg.deletedFor?.includes(currentUser?.id || '')
//             );

//             setMessages(filteredMessages);

//             // إذا لم تُضبط conversation من fetchConversation، استخدم الرسائل
//             if (!conversation?.participant && filteredMessages.length > 0) {
//                 const otherMsg = filteredMessages.find(msg => msg.sender._id !== currentUser?.id);
//                 if (otherMsg) {
//                     setConversation({
//                         _id: id,
//                         participant: {
//                             _id: otherMsg.sender._id,
//                             name: otherMsg.sender.name,
//                             avatarUrl: otherMsg.sender.avatarUrl,
//                         },
//                     });
//                 }
//             }
//         } catch (error: any) {
//             console.error('Error loading chat:', error);
//             Alert.alert('Error', error.message || 'Could not load chat');
//             router.back();
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ التحقق من صلاحية receiverId
//     const isValidReceiverId = (id?: string): boolean => {
//         return !!id && id !== 'unknown' && id.length > 5;
//     };

//     // 💬 إرسال رسالة
//     const sendMessage = () => {
//         if (!newMessage.trim() || !id || !currentUser?.id || !isValidReceiverId(conversation?.participant._id)) {
//             Alert.alert('Error', 'Cannot send message. Missing required data.');
//             return;
//         }

//         const messageData = {
//             conversationId: id,
//             content: newMessage.trim(),
//             senderId: currentUser.id,
//             receiverId: conversation!.participant._id,
//         };

//         const tempMessage: Message = {
//             _id: 'temp-' + Date.now(),
//             sender: {
//                 _id: currentUser.id,
//                 name: currentUser.name || 'You',
//                 avatarUrl: currentUser.avatarUrl,
//             },
//             content: newMessage.trim(),
//             createdAt: new Date().toISOString(),
//         };

//         setMessages(prev => [...prev, tempMessage]);
//         setNewMessage('');

//         const socket = useSocketStore.getState().socket;
//         if (socket?.connected) {
//             socket.emit('sendMessage', messageData);

//             socket.once('sendMessageError', (error: any) => {
//                 Alert.alert('Error', error.message || 'Message not sent');
//                 setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
//             });
//         } else {
//             Alert.alert('Error', 'Not connected to chat server');
//             setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
//         }
//     };

//     // ✏️ تعديل رسالة
//     const editMessage = () => {
//         if (!editingMessage || !newMessage.trim() || !isValidReceiverId(conversation?.participant._id)) return;

//         const editData = {
//             messageId: editingMessage._id,
//             conversationId: id,
//             newContent: newMessage.trim(),
//             userId: currentUser?.id,
//             receiverId: conversation!.participant._id,
//         };

//         const socket = useSocketStore.getState().socket;
//         if (socket?.connected) {
//             socket.emit('editMessage', editData);
//             socket.once('editMessageError', (error: any) => {
//                 Alert.alert('Error', error.message || 'Failed to edit message');
//             });

//             // Optimistic update
//             setMessages(prev =>
//                 prev.map(msg =>
//                     msg._id === editingMessage._id
//                         ? { ...msg, content: newMessage.trim(), edited: true, editedAt: new Date().toISOString() }
//                         : msg
//                 )
//             );
//         }

//         setEditingMessage(null);
//         setNewMessage('');
//     };

//     // 🗑️ حذف رسالة
//     const deleteMessage = (messageId: string, deleteType: 'forMe' | 'forEveryone') => {
//         if (!isValidReceiverId(conversation?.participant._id)) return;

//         Alert.alert(
//             'Delete Message',
//             deleteType === 'forEveryone'
//                 ? 'Delete for everyone? This cannot be undone.'
//                 : 'Delete for you only?',
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 {
//                     text: 'Delete',
//                     style: 'destructive',
//                     onPress: () => {
//                         const deleteData = {
//                             messageId,
//                             conversationId: id,
//                             userId: currentUser?.id,
//                             receiverId: conversation!.participant._id,
//                             deleteType,
//                         };

//                         const socket = useSocketStore.getState().socket;
//                         if (socket?.connected) {
//                             socket.emit('deleteMessage', deleteData);
//                             socket.once('deleteMessageError', (error: any) => {
//                                 Alert.alert('Error', error.message || 'Failed to delete message');
//                             });

//                             // Optimistic update
//                             setMessages(prev => prev.filter(msg => msg._id !== messageId));
//                         } else {
//                             Alert.alert('Error', 'Not connected to chat server');
//                         }
//                         setShowMessageMenu(false);
//                     },
//                 },
//             ]
//         );
//     };

//     const openMessageMenu = (message: Message, x: number, y: number) => {
//         setSelectedMessage(message);
//         setMenuPosition({ x, y });
//         setShowMessageMenu(true);
//     };

//     // 📡 Socket listeners
//     useEffect(() => {
//         const { socket } = useSocketStore.getState();
//         if (!socket || !id) return;

//         const handleReceiveMessage = (newMsg: any) => {
//             if (newMsg.conversation === id) {
//                 setMessages(prev => [...prev, {
//                     _id: newMsg._id,
//                     sender: newMsg.sender || { _id: 'unknown', name: 'Unknown', avatarUrl: undefined },
//                     content: newMsg.content || '',
//                     createdAt: newMsg.createdAt || new Date().toISOString(),
//                     edited: newMsg.edited,
//                     editedAt: newMsg.editedAt,
//                 }]);
//             }
//         };

//         const handleMessageEdited = (data: any) => {
//             if (data.conversationId === id) {
//                 setMessages(prev =>
//                     prev.map(msg =>
//                         msg._id === data.messageId
//                             ? { ...msg, content: data.newContent, edited: true, editedAt: data.editedAt }
//                             : msg
//                     )
//                 );
//             }
//         };

//         const handleMessageDeleted = (data: any) => {
//             if (data.conversationId === id) {
//                 setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
//             }
//         };

//         const handleOnlineUsers = (userIds: string[]) => {
//             if (conversation?.participant._id) {
//                 setIsOnline(userIds.includes(conversation.participant._id));
//             }
//         };

//         socket.on('receiveMessage', handleReceiveMessage);
//         socket.on('messageEdited', handleMessageEdited);
//         socket.on('messageDeleted', handleMessageDeleted);
//         socket.on('getOnlineUsers', handleOnlineUsers);

//         return () => {
//             socket.off('receiveMessage', handleReceiveMessage);
//             socket.off('messageEdited', handleMessageEdited);
//             socket.off('messageDeleted', handleMessageDeleted);
//             socket.off('getOnlineUsers', handleOnlineUsers);
//         };
//     }, [id, conversation?.participant?._id]);

//     useEffect(() => {
//         fetchMessages();
//     }, [id]);

//     useEffect(() => {
//         if (conversation?.participant._id) {
//             const { socket } = useSocketStore.getState();
//             socket?.emit('setup', currentUser?.id); // تأكد من تسجيل الدخول في الـ socket
//             socket?.emit('checkOnlineStatus', conversation.participant._id);
//         }
//     }, [conversation?.participant?._id]);

//     // ⏱️ تنسيق الوقت
//     const formatTime = (timestamp: string) => {
//         return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     // 💬 عرض رسالة — آمن 100%
//     const renderMessage = ({ item }: { item: Message }) => {
//         const sender = item.sender || { _id: 'unknown', name: 'Unknown', avatarUrl: undefined };
//         const isMyMessage = sender._id === currentUser?.id;
//         const isDeleted = item.deletedFor?.includes(currentUser?.id || '');

//         if (isDeleted) return null;

//         return (
//             <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.otherMessageRow]}>
//                 {!isMyMessage && (
//                     <Image
//                         source={sender.avatarUrl ? { uri: sender.avatarUrl } : require('@/assets/images/logo.png')}
//                         style={styles.avatar}
//                     />
//                 )}

//                 <TouchableOpacity
//                     activeOpacity={0.7}
//                     onLongPress={(e) => isMyMessage && openMessageMenu(item, e.nativeEvent.pageX, e.nativeEvent.pageY)}
//                     delayLongPress={500}
//                 >
//                     <View style={[styles.bubble, isMyMessage ? styles.myBubble : styles.otherBubble]}>
//                         {!isMyMessage && <Text style={styles.senderName}>{sender.name}</Text>}
//                         <Text style={[styles.text, isMyMessage ? styles.myText : styles.otherText]}>{item.content}</Text>
//                         <View style={styles.messageFooter}>
//                             <Text style={[styles.time, isMyMessage ? styles.myTime : styles.otherTime]}>
//                                 {formatTime(item.createdAt)}
//                             </Text>
//                             {item.edited && (
//                                 <Text style={[styles.editedText, isMyMessage ? styles.myEditedText : styles.otherEditedText]}>
//                                     edited
//                                 </Text>
//                             )}
//                         </View>
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     // 📋 قائمة السياق
//     const renderMessageMenu = () => (
//         <Modal
//             visible={showMessageMenu}
//             transparent
//             animationType="fade"
//             onRequestClose={() => setShowMessageMenu(false)}
//             style={{ position: "absolute", left: 0 }}
//         >
//             <TouchableOpacity style={styles.menuOverlay} onPress={() => setShowMessageMenu(false)}>
//                 <View style={[styles.messageMenu,
//                 {
//                     top: menuPosition.y,
//                     // left: Math.max(10, menuPosition.x - 100)
//                     left: "40%"
//                 }]}>
//                     {selectedMessage?.sender._id === currentUser?.id && (
//                         <>
//                             <TouchableOpacity
//                                 style={styles.menuItem}
//                                 onPress={() => {
//                                     if (selectedMessage) {
//                                         setEditingMessage(selectedMessage);
//                                         setNewMessage(selectedMessage.content);
//                                         setShowMessageMenu(false);
//                                     }
//                                 }}
//                             >
//                                 <MaterialIcons name="edit" size={20} color={COLORS.primary} />
//                                 <Text style={styles.menuText}>Edit</Text>
//                             </TouchableOpacity>

//                             {/* <TouchableOpacity
//                                 style={styles.menuItem}
//                                 onPress={() => {
//                                     if (selectedMessage) {
//                                         deleteMessage(selectedMessage._id, 'forMe');
//                                     }
//                                 }}
//                             >
//                                 <MaterialIcons name="delete-outline" size={20} color={COLORS.error} />
//                                 <Text style={[styles.menuText, styles.deleteText]}>Delete for me</Text>
//                             </TouchableOpacity> */}

//                             <TouchableOpacity
//                                 style={styles.menuItem}
//                                 onPress={() => {
//                                     if (selectedMessage) {
//                                         deleteMessage(selectedMessage._id, 'forEveryone');
//                                     }
//                                 }}
//                             >
//                                 <MaterialIcons name="delete-forever" size={20} color={COLORS.error} />
//                                 <Text style={[styles.menuText, styles.deleteText]}>Delete</Text>
//                             </TouchableOpacity>
//                         </>
//                     )}
//                     <TouchableOpacity style={[styles.menuItem, styles.cancelItem]} onPress={() => setShowMessageMenu(false)}>
//                         <MaterialIcons name="close" size={20} color={COLORS.textLight} />
//                         <Text style={styles.menuText}>Cancel</Text>
//                     </TouchableOpacity>
//                 </View>
//             </TouchableOpacity>
//         </Modal>
//     );

//     // 🌀 تحميل
//     if (loading) {
//         return (
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.center}>
//                     <ActivityIndicator size="large" color={COLORS.primary} />
//                     <Text style={styles.loadingText}>Loading chat...</Text>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     const participant = conversation?.participant || { _id: 'unknown', name: 'User', avatarUrl: undefined };

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//                     <Ionicons name="arrow-back" size={24} color={COLORS.text} />
//                 </TouchableOpacity>

//                 <View style={styles.headerUser}>
//                     <Image
//                         source={participant.avatarUrl ? { uri: participant.avatarUrl } : require('@/assets/images/logo.png')}
//                         style={styles.headerAvatar}
//                     />
//                     <View style={styles.headerInfo}>
//                         <Text style={styles.headerName} numberOfLines={1}>
//                             {participant.name}
//                         </Text>
//                         <View style={styles.statusContainer}>
//                             <View style={[styles.statusDot, { backgroundColor: isOnline ? COLORS.success : COLORS.textLight }]} />
//                             <Text style={[styles.headerStatus, { color: isOnline ? COLORS.success : COLORS.textLight }]}>
//                                 {isOnline ? 'Online' : 'Offline'}
//                             </Text>
//                         </View>
//                     </View>
//                 </View>

//                 <View style={styles.headerActions}>
//                     <TouchableOpacity style={styles.headerAction}>
//                         <Ionicons name="videocam-outline" size={24} color={COLORS.primary} />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.headerAction}>
//                         <Ionicons name="call-outline" size={20} color={COLORS.primary} />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             {/* Messages */}
//             <KeyboardAvoidingView
//                 style={styles.keyboardView}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//             >
//                 <FlatList
//                     ref={flatListRef}
//                     data={messages}
//                     renderItem={renderMessage}
//                     keyExtractor={(item) => item._id}
//                     contentContainerStyle={styles.messagesContainer}
//                     showsVerticalScrollIndicator={false}
//                     onContentSizeChange={() => messages.length > 0 && flatListRef.current?.scrollToEnd({ animated: false })}
//                     ListEmptyComponent={
//                         <View style={styles.emptyContainer}>
//                             <Ionicons name="chatbubble-ellipses-outline" size={64} color={COLORS.textLight} />
//                             <Text style={styles.emptyText}>No messages yet</Text>
//                             <Text style={styles.emptySubText}>Start the conversation by sending a message</Text>
//                         </View>
//                     }
//                 />

//                 {/* Input */}
//                 <View style={styles.inputContainer}>
//                     {editingMessage ? (
//                         <View style={styles.editHeader}>
//                             <Text style={styles.editTitle}>Editing message</Text>
//                             <TouchableOpacity onPress={() => { setEditingMessage(null); setNewMessage(''); }}>
//                                 <Ionicons name="close-circle" size={20} color={COLORS.error} />
//                             </TouchableOpacity>
//                         </View>
//                     ) : (
//                         <TouchableOpacity style={styles.attachmentButton}>
//                             <Ionicons name="add-circle" size={28} color={COLORS.primary} />
//                         </TouchableOpacity>
//                     )}

//                     <TextInput
//                         style={styles.input}
//                         value={newMessage}
//                         onChangeText={setNewMessage}
//                         placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
//                         placeholderTextColor={COLORS.textLight}
//                         multiline
//                         maxLength={1000}
//                     />

//                     <View style={styles.inputActions}>
//                         {newMessage.trim() ? (
//                             <TouchableOpacity
//                                 style={styles.sendButton}
//                                 onPress={editingMessage ? editMessage : sendMessage}
//                                 disabled={!newMessage.trim()}
//                             >
//                                 <Ionicons
//                                     name={editingMessage ? "checkmark-circle" : "send"}
//                                     size={24}
//                                     color={COLORS.white}
//                                 />
//                             </TouchableOpacity>
//                         ) : (
//                             <>
//                                 <TouchableOpacity style={styles.iconButton}>
//                                     <Ionicons name="mic-outline" size={24} color={COLORS.primary} />
//                                 </TouchableOpacity>
//                                 <TouchableOpacity style={styles.iconButton}>
//                                     <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
//                                 </TouchableOpacity>
//                             </>
//                         )}
//                     </View>
//                 </View>
//             </KeyboardAvoidingView>

//             {renderMessageMenu()}
//         </SafeAreaView>
//     );
// }

// // ✨ الأنماط — مأخوذة من النسخة المُحسّنة
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.background
//     },
//     center: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//     loadingText: {
//         marginTop: 12, color: COLORS.textLight, fontSize: 16
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: COLORS.surface,
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         borderBottomColor: COLORS.border
//     },
//     headerUser: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
//     headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
//     headerInfo: { flex: 1 },
//     headerName: { fontSize: 17, fontWeight: '600', color: COLORS.text },
//     statusContainer: {
//         flexDirection: 'row', alignItems: 'center',
//         marginTop: 2
//     },
//     statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
//     headerStatus: { fontSize: 13 },
//     headerActions: { flexDirection: 'row', alignItems: 'center' },
//     headerAction: { padding: 8, marginLeft: 8 },
//     backButton: { padding: 4 },
//     keyboardView: { flex: 1 },
//     messagesContainer: { paddingHorizontal: 16, paddingVertical: 8, flexGrow: 1 },
//     messageRow: {
//         flexDirection: 'row',
//         marginVertical: 4,
//         alignItems: 'flex-end',
//         // backgroundColor: 'red'
//     },
//     myMessageRow: {
//         justifyContent: 'flex-end',
//     },
//     otherMessageRow: { justifyContent: 'flex-start' },
//     avatar: { width: 'auto', height: 'auto', borderRadius: 18, marginRight: 8 },
//     bubble: { maxWidth: '100%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
//     myBubble: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
//     otherBubble: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 4, borderWidth: StyleSheet.hairlineWidth, borderColor: COLORS.borderLight },
//     senderName: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
//     text: { fontSize: 16, lineHeight: 22 },
//     myText: { color: COLORS.white },
//     otherText: { color: COLORS.text },
//     messageFooter: {
//         flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
//         marginTop: 4
//     },
//     time: { fontSize: 11, marginRight: 6 },
//     myTime: { color: 'rgba(255,255,255,0.8)' },
//     otherTime: { color: COLORS.textLight },
//     editedText: { fontSize: 10, fontStyle: 'italic' },
//     myEditedText: { color: 'rgba(255,255,255,0.7)' },
//     otherEditedText: { color: COLORS.textLight },
//     inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.surface, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.border },
//     editHeader: { position: 'absolute', top: -40, left: 0, right: 0, backgroundColor: COLORS.warning + '20', paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.warning },
//     editTitle: { fontSize: 14, color: COLORS.warning, fontWeight: '500' },
//     attachmentButton: { padding: 6, marginRight: 8 },
//     input: { flex: 1, backgroundColor: COLORS.background, borderRadius: 24, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 12 : 10, fontSize: 16, color: COLORS.text, maxHeight: 100, borderWidth: 1, borderColor: COLORS.borderLight },
//     inputActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
//     iconButton: { padding: 8, marginLeft: 4 },
//     sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
//     menuOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.2)'
//     },
//     messageMenu: {
//         position: 'absolute',
//         backgroundColor: COLORS.surface,
//         borderRadius: 12,
//         // padding: 8,
//         minWidth: 180,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25, shadowRadius: 3.84,
//         // elevation: 100
//         left: '50%'
//     },
//     menuItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         borderRadius: 8
//     },
//     cancelItem: {
//         borderTopWidth: 1,
//         borderTopColor: COLORS.border,
//         marginTop: 4
//     },
//     menuText: {
//         fontSize: 15,
//         color: COLORS.text,
//         marginLeft: 12
//     },
//     deleteText: { color: COLORS.error },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: 100
//     },
//     emptyText: {
//         fontSize: 20,
//         fontWeight: '600',
//         color: COLORS.text,
//         marginTop: 20,
//         marginBottom: 8
//     },
//     emptySubText: {
//         fontSize: 15,
//         color: COLORS.textLight,
//         textAlign: 'center',
//         paddingHorizontal: 40
//     },
// });

// import { BASE_URL } from "@/constants/Api";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authstore";
// import { useSocketStore } from "@/stores/socketStore";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,

//     StyleSheet,
//     Platform,
//     Alert,
//     Image,
//     KeyboardAvoidingView,
//     ActivityIndicator,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Toast from 'react-native-toast-message'; // ✅ Added

// // أنواع البيانات
// interface Sender {
//     _id: string;
//     name: string;
//     avatarUrl?: string;
// }
// interface Message {
//     _id: string;
//     sender: Sender;
//     content: string;
//     createdAt: string;
// }
// interface Participant {
//     _id: string;
//     name: string;
//     avatarUrl?: string;
// }
// interface ConversationData {
//     _id: string;
//     participant: Participant;
// }

// export default function ChatScreen() {
//     const router = useRouter();
//     const { id } = useLocalSearchParams<{ id: string }>();
//     const { token, user: currentUser } = useAuthStore();

//     const [conversation, setConversation] = useState<ConversationData | null>(null);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [loading, setLoading] = useState(true);
//     const flatListRef = useRef<FlatList>(null);

//     // 🌐 جلب الرسائل عند تحميل الصفحة
//     const fetchMessages = async () => {
//         if (!id || !token) {
//             setLoading(false);
//             return;
//         }
//         try {
//             const msgRes = await fetch(`${BASE_URL}/api/chat/messages/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!msgRes.ok) {
//                 const err = await msgRes.json();
//                 throw new Error(err.message || 'Failed to load messages');
//             }
//             const msgData = await msgRes.json();
//             const messagesList: Message[] = msgData.messages || [];
//             setMessages(messagesList);

//             let otherParticipant: Participant = {
//                 _id: 'unknown',
//                 name: 'User',
//                 avatarUrl: undefined,
//             };
//             const otherMsg = messagesList.find(
//                 (msg) => msg.sender._id !== currentUser?.id
//             );
//             if (otherMsg) {
//                 otherParticipant = {
//                     _id: otherMsg.sender._id,
//                     name: otherMsg.sender.name,
//                     avatarUrl: otherMsg.sender.avatarUrl,
//                 };
//             }
//             setConversation({
//                 _id: id,
//                 participant: otherParticipant,
//             });
//         } catch (error: any) {
//             console.error('Error loading chat:', error);
//             Alert.alert('Error', error.message || 'Could not load chat');
//             router.back();
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 💬 إرسال رسالة عبر Socket.IO
//     const sendMessage = () => {
//         if (!newMessage.trim() || !id || !currentUser?.id || !conversation?.participant._id) return;

//         const messageData = {
//             conversationId: id,
//             content: newMessage.trim(),
//             senderId: currentUser.id,
//             receiverId: conversation.participant._id,
//         };

//         const tempMessage: Message = {
//             _id: 'temp-' + Date.now(),
//             sender: {
//                 _id: currentUser.id,
//                 name: currentUser.name || 'You',
//                 avatarUrl: currentUser.avatarUrl,
//             },
//             content: newMessage.trim(),
//             createdAt: new Date().toISOString(),
//         };

//         setMessages(prev => [...prev, tempMessage]);
//         setNewMessage('');

//         const socket = useSocketStore.getState().socket;
//         if (socket) {
//             socket.emit('sendMessage', messageData);
//             socket.once('sendMessageError', (error: any) => {
//                 Alert.alert('Error', error.message || 'Message not sent');
//             });
//         } else {
//             Alert.alert('Error', 'Not connected to chat server');
//         }
//     };

//     // 📥 استقبال الرسائل الفورية + الإشعارات
//     useEffect(() => {
//         const { socket } = useSocketStore.getState();
//         if (!socket || !id) return;

//         const handleReceiveMessage = (newMessage: any) => {
//             if (newMessage.conversation === id) {
//                 setMessages(prev => [...prev, {
//                     _id: newMessage._id,
//                     sender: newMessage.sender,
//                     content: newMessage.content,
//                     createdAt: newMessage.createdAt,
//                 }]);

//                 // ✅ إشعار عند استلام رسالة جديدة
//                 if (newMessage.sender?._id !== currentUser?.id) {
//                     Toast.show({
//                         type: 'success',
//                         text1: 'New message',
//                         text2: `${newMessage.sender?.name || 'User'}: ${newMessage.content?.substring(0, 30)}${(newMessage.content?.length || 0) > 30 ? '...' : ''}`,
//                         visibilityTime: 2500,
//                     });
//                 }
//             }
//         };

//         socket.on('receiveMessage', handleReceiveMessage);
//         return () => {
//             socket.off('receiveMessage', handleReceiveMessage);
//         };
//     }, [id, currentUser?.id]);

//     useEffect(() => {
//         fetchMessages();
//     }, [id]);

//     const formatTime = (timestamp: string) => {
//         return new Date(timestamp).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const renderMessage = ({ item }: { item: Message }) => {
//         const sender = item.sender || {
//             _id: 'unknown',
//             name: 'Unknown',
//             avatarUrl: undefined,
//         };
//         const isMyMessage = sender._id === currentUser?.id;

//         return (
//             <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.otherMessageRow]}>
//                 {!isMyMessage && (
//                     <>
//                         {sender.avatarUrl ? (
//                             <Image
//                                 source={{ uri: sender.avatarUrl }}
//                                 style={styles.avatar}
//                             />
//                         ) : (
//                             <Image
//                                 source={require('@/assets/images/logo.png')}
//                                 style={styles.avatar}
//                             />
//                         )}
//                     </>
//                 )}
//                 <View style={[styles.bubble, isMyMessage ? styles.myBubble : styles.otherBubble]}>
//                     {!isMyMessage && (
//                         <Text style={styles.senderName}>{sender.name || 'Unknown'}</Text>
//                     )}
//                     <Text style={[styles.text, isMyMessage ? styles.myText : styles.otherText]}>
//                         {item.content || ''}
//                     </Text>
//                     <Text style={[styles.time, isMyMessage ? styles.myTime : styles.otherTime]}>
//                         {formatTime(item.createdAt)}
//                     </Text>
//                 </View>
//             </View>
//         );
//     };

//     if (loading) {
//         return (
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.center}>
//                     <ActivityIndicator size="large" color={COLORS.primary} />
//                     <Text style={styles.loadingText}>Loading chat...</Text>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Header */}
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity
//                     onPress={() => router.back()}
//                     hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                     style={styles.backButton}
//                 >
//                     <Ionicons name="arrow-back" size={24} color={COLORS.text} />
//                 </TouchableOpacity>

//                 {/* Avatar of the other user */}
//                 <TouchableOpacity style={styles.avatarContainer}>
//                     {conversation?.participant.avatarUrl ? (
//                         <Image
//                             source={{ uri: conversation.participant.avatarUrl }}
//                             style={styles.headerAvatar}
//                             onError={(e) => console.log("Avatar load error:", e.nativeEvent.error)}
//                         />
//                     ) : (
//                         <Image
//                             source={require('@/assets/images/logo.png')} // أو أي صورة افتراضية
//                             style={styles.headerAvatar}
//                         />
//                     )}
//                 </TouchableOpacity>

//                 <View style={styles.headerInfo}>
//                     <Text style={styles.headerName}>{conversation?.participant.name}</Text>
//                     <Text style={styles.headerStatus}>Online</Text>
//                 </View>

//                 <View style={styles.headerActions}>
//                     <TouchableOpacity style={styles.headerAction}>
//                         <Ionicons name="videocam-outline" size={24} color={COLORS.text} />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.headerAction}>
//                         <Ionicons name="call-outline" size={20} color={COLORS.text} />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             {/* Messages */}
//             <KeyboardAvoidingView
//                 style={styles.keyboardView}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//             >
//                 <FlatList
//                     ref={flatListRef}
//                     data={messages}
//                     renderItem={renderMessage}
//                     keyExtractor={(item) => item._id}
//                     contentContainerStyle={styles.messagesContainer}
//                     showsVerticalScrollIndicator={false}
//                     onContentSizeChange={() => {
//                         if (messages.length > 0) {
//                             flatListRef.current?.scrollToEnd({ animated: false });
//                         }
//                     }}
//                     ListEmptyComponent={
//                         <View style={styles.emptyContainer}>
//                             <Ionicons name="chatbubble-ellipses-outline" size={64} color={COLORS.textLight} />
//                             <Text style={styles.emptyText}>No messages yet</Text>
//                             <Text style={styles.emptySubText}>Start the conversation by sending a message</Text>
//                         </View>
//                     }
//                 />

//                 {/* Input */}
//                 <View style={styles.inputContainer}>
//                     <TouchableOpacity style={styles.attachmentButton}>
//                         <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
//                     </TouchableOpacity>
//                     <TextInput
//                         style={styles.input}
//                         value={newMessage}
//                         onChangeText={setNewMessage}
//                         placeholder="Type a message..."
//                         placeholderTextColor={COLORS.textLight}
//                         multiline
//                         maxLength={1000}
//                     />
//                     <TouchableOpacity
//                         style={[styles.sendButton, (!newMessage.trim()) && styles.sendDisabled]}
//                         onPress={sendMessage}
//                         disabled={!newMessage.trim()}
//                     >
//                         <Ionicons
//                             name="send"
//                             size={18}
//                             color={newMessage.trim() ? COLORS.white : COLORS.textLight}
//                         />
//                     </TouchableOpacity>
//                 </View>
//             </KeyboardAvoidingView>

//             {/* ✅ Toast هنا */}
//             <Toast />
//         </SafeAreaView>
//     );
// }

// // ... الأنماط بدون تغيير
// const styles = StyleSheet.create({
//     // ... نفس الأنماط من الكود الأول
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.background,
//     },
//     center: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     loadingText: {
//         marginTop: 12,
//         color: COLORS.textLight,
//         fontSize: 16,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: COLORS.surface,
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         borderBottomColor: COLORS.border,
//     },
//     backButton: {
//         padding: 4,
//     },
//     headerInfo: {
//         flex: 1,
//         marginLeft: 12,
//     },
//     headerName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.text,
//     },
//     headerStatus: {
//         fontSize: 12,
//         color: COLORS.success,
//         marginTop: 2,
//     },
//     headerActions: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     headerAction: {
//         padding: 8,
//         marginLeft: 8,
//     },
//     keyboardView: {
//         flex: 1,
//     },
//     messagesContainer: {
//         padding: 16,
//         flexGrow: 1,
//     },
//     messageRow: {
//         flexDirection: 'row',
//         marginVertical: 4,
//         alignItems: 'flex-end',
//     },
//     myMessageRow: {
//         justifyContent: 'flex-end',
//     },
//     otherMessageRow: {
//         justifyContent: 'flex-start',
//     },
//     avatar: {
//         width: 32,
//         height: 32,
//         borderRadius: 16,
//         marginRight: 8,
//     },
//     bubble: {
//         maxWidth: '75%',
//         paddingHorizontal: 14,
//         paddingVertical: 10,
//         borderRadius: 18,
//         ...Platform.select({
//             ios: {
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 2,
//             },
//             android: {
//                 elevation: 1,
//             },
//         }),
//     },
//     myBubble: {
//         backgroundColor: COLORS.primary,
//         borderBottomRightRadius: 6,
//     },
//     otherBubble: {
//         backgroundColor: COLORS.surface,
//         borderBottomLeftRadius: 6,
//         borderWidth: StyleSheet.hairlineWidth,
//         borderColor: COLORS.border,
//     },
//     senderName: {
//         fontSize: 12,
//         color: COLORS.primary,
//         fontWeight: '600',
//         marginBottom: 2,
//     },
//     text: {
//         fontSize: 16,
//         lineHeight: 20,
//     },
//     myText: {
//         color: COLORS.white,
//     },
//     otherText: {
//         color: COLORS.text,
//     },
//     time: {
//         fontSize: 11,
//         marginTop: 4,
//     },
//     myTime: {
//         color: 'rgba(255,255,255,0.7)',
//         textAlign: 'right',
//     },
//     otherTime: {
//         color: COLORS.textLight,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'flex-end',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: COLORS.surface,
//         borderTopWidth: StyleSheet.hairlineWidth,
//         borderTopColor: COLORS.border,
//     },
//     attachmentButton: {
//         padding: 8,
//         marginRight: 8,
//     },
//     input: {
//         flex: 1,
//         backgroundColor: COLORS.background,
//         borderRadius: 20,
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         fontSize: 16,
//         color: COLORS.text,
//         maxHeight: 100,
//         borderWidth: StyleSheet.hairlineWidth,
//         borderColor: COLORS.border,
//     },
//     sendButton: {
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//         backgroundColor: COLORS.primary,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginLeft: 8,
//     },
//     sendDisabled: {
//         backgroundColor: COLORS.textLight,
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: 60,
//     },
//     emptyText: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: COLORS.text,
//         marginTop: 16,
//         marginBottom: 8,
//     },
//     emptySubText: {
//         fontSize: 14,
//         color: COLORS.textLight,
//         textAlign: 'center',
//         paddingHorizontal: 40,
//     },
//     avatarContainer: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         overflow: 'hidden',
//         marginRight: 12,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     headerAvatar: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 20,
//     },
// });


// import { BASE_URL } from "@/constants/Api";
// import { COLORS } from "@/constants/theme";
// import { useAuthStore } from "@/stores/authstore";
// import { useSocketStore } from "@/stores/socketStore";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect, useRef, useState } from "react";
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     StyleSheet,
//     Platform,
//     Alert,
//     Image,
//     KeyboardAvoidingView,
//     ActivityIndicator,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Toast from 'react-native-toast-message'; // ✅ Added

// // أنواع البيانات
// interface Sender {
//     _id: string;
//     name: string;
//     avatarUrl?: string;
// }
// interface Message {
//     _id: string;
//     sender: Sender;
//     content: string;
//     createdAt: string;
// }
// interface Participant {
//     _id: string;
//     name: string;
//     avatarUrl?: string;
// }
// interface ConversationData {
//     _id: string;
//     participant: Participant;
// }

// export default function ChatScreen() {
//     const router = useRouter();
//     const { id } = useLocalSearchParams<{ id: string }>();
//     const { token, user: currentUser } = useAuthStore();

//     const [conversation, setConversation] = useState<ConversationData | null>(null);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [loading, setLoading] = useState(true);
//     const flatListRef = useRef<FlatList>(null);

//     // 🌐 جلب الرسائل عند تحميل الصفحة
//     const fetchMessages = async () => {
//         if (!id || !token) {
//             setLoading(false);
//             return;
//         }
//         try {
//             const msgRes = await fetch(`${BASE_URL}/api/chat/messages/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!msgRes.ok) {
//                 const err = await msgRes.json();
//                 throw new Error(err.message || 'Failed to load messages');
//             }
//             const msgData = await msgRes.json();
//             const messagesList: Message[] = msgData.messages || [];
//             setMessages(messagesList);

//             let otherParticipant: Participant = {
//                 _id: 'unknown',
//                 name: 'User',
//                 avatarUrl: undefined,
//             };
//             const otherMsg = messagesList.find(
//                 (msg) => msg.sender._id !== currentUser?.id
//             );
//             if (otherMsg) {
//                 otherParticipant = {
//                     _id: otherMsg.sender._id,
//                     name: otherMsg.sender.name,
//                     avatarUrl: otherMsg.sender.avatarUrl,
//                 };
//             }
//             setConversation({
//                 _id: id,
//                 participant: otherParticipant,
//             });
//         } catch (error: any) {
//             console.error('Error loading chat:', error);
//             Alert.alert('Error', error.message || 'Could not load chat');
//             router.back();
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 💬 إرسال رسالة عبر Socket.IO
//     const sendMessage = () => {
//         if (!newMessage.trim() || !id || !currentUser?.id || !conversation?.participant._id) return;

//         const messageData = {
//             conversationId: id,
//             content: newMessage.trim(),
//             senderId: currentUser.id,
//             receiverId: conversation.participant._id,
//         };

//         const tempMessage: Message = {
//             _id: 'temp-' + Date.now(),
//             sender: {
//                 _id: currentUser.id,
//                 name: currentUser.name || 'You',
//                 avatarUrl: currentUser.avatarUrl,
//             },
//             content: newMessage.trim(),
//             createdAt: new Date().toISOString(),
//         };

//         setMessages(prev => [...prev, tempMessage]);
//         setNewMessage('');

//         const socket = useSocketStore.getState().socket;
//         if (socket) {
//             socket.emit('sendMessage', messageData);
//             socket.once('sendMessageError', (error: any) => {
//                 Alert.alert('Error', error.message || 'Message not sent');
//             });
//         } else {
//             Alert.alert('Error', 'Not connected to chat server');
//         }
//     };

//     // 📥 استقبال الرسائل الفورية + الإشعارات
//     useEffect(() => {
//         const { socket } = useSocketStore.getState();
//         if (!socket || !id) return;

//         const handleReceiveMessage = (newMessage: any) => {
//             if (newMessage.conversation === id) {
//                 setMessages(prev => [...prev, {
//                     _id: newMessage._id,
//                     sender: newMessage.sender,
//                     content: newMessage.content,
//                     createdAt: newMessage.createdAt,
//                 }]);

//                 // ✅ إشعار عند استلام رسالة جديدة
//                 if (newMessage.sender?._id !== currentUser?.id) {
//                     Toast.show({
//                         type: 'success',
//                         text1: 'New message',
//                         text2: `${newMessage.sender?.name || 'User'}: ${newMessage.content?.substring(0, 30)}${(newMessage.content?.length || 0) > 30 ? '...' : ''}`,
//                         visibilityTime: 2500,
//                     });
//                 }
//             }
//         };

//         socket.on('receiveMessage', handleReceiveMessage);
//         return () => {
//             socket.off('receiveMessage', handleReceiveMessage);
//         };
//     }, [id, currentUser?.id]);

//     useEffect(() => {
//         fetchMessages();
//     }, [id]);

//     const formatTime = (timestamp: string) => {
//         return new Date(timestamp).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };
// console.log(conversation);

//     const renderMessage = ({ item }: { item: Message }) => {
//         const sender = item.sender || {
//             _id: 'unknown',
//             name: 'Unknown',
//             avatarUrl: undefined,
//         };
//         const isMyMessage = sender._id === currentUser?.id;

//         return (
//             <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.otherMessageRow]}>
//                 {!isMyMessage && (
//                     <>
//                         {sender.avatarUrl ? (
//                             <Image
//                                 source={{ uri: sender.avatarUrl }}
//                                 style={styles.avatar}
//                             />
//                         ) : (
//                             <Image
//                                 source={require('@/assets/images/logo.png')}
//                                 style={styles.avatar}
//                             />
//                         )}
//                     </>
//                 )}
//                 <View style={[styles.bubble, isMyMessage ? styles.myBubble : styles.otherBubble]}>
//                     {!isMyMessage && (
//                         <Text style={styles.senderName}>{sender.name || 'Unknown'}</Text>
//                     )}
//                     <Text style={[styles.text, isMyMessage ? styles.myText : styles.otherText]}>
//                         {item.content || ''}
//                     </Text>
//                     <Text style={[styles.time, isMyMessage ? styles.myTime : styles.otherTime]}>
//                         {formatTime(item.createdAt)}
//                     </Text>
//                 </View>
//             </View>
//         );
//     };

//     if (loading) {
//         return (
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.center}>
//                     <ActivityIndicator size="large" color={COLORS.primary} />
//                     <Text style={styles.loadingText}>Loading chat...</Text>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Header */}
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity
//                     onPress={() => router.back()}
//                     hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                     style={styles.backButton}
//                 >
//                     <Ionicons name="arrow-back" size={24} color={COLORS.text} />
//                 </TouchableOpacity>

//                 {/* Avatar of the other user */}
//                 <TouchableOpacity style={styles.avatarContainer}>
//                     {conversation?.participant.avatarUrl ? (
//                         <Image
//                             source={{ uri: conversation.participant.avatarUrl }}
//                             style={styles.headerAvatar}
//                             onError={(e) => console.log("Avatar load error:", e.nativeEvent.error)}
//                         />
//                     ) : (
//                         <Image
//                             source={require('@/assets/images/logo.png')} // أو أي صورة افتراضية
//                             style={styles.headerAvatar}
//                         />
//                     )}
//                 </TouchableOpacity>

//                 <View style={styles.headerInfo}>
//                     <Text style={styles.headerName}>{conversation?.participant.name}</Text>
//                     <Text style={styles.headerStatus}>Online</Text>
//                 </View>

//                 <View style={styles.headerActions}>
//                     <TouchableOpacity style={styles.headerAction}>
//                         <Ionicons name="videocam-outline" size={24} color={COLORS.text} />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.headerAction}>
//                         <Ionicons name="call-outline" size={20} color={COLORS.text} />
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             {/* Messages */}
//             <KeyboardAvoidingView
//                 style={styles.keyboardView}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//             >
//                 <FlatList
//                     ref={flatListRef}
//                     data={messages}
//                     renderItem={renderMessage}
//                     keyExtractor={(item) => item._id}
//                     contentContainerStyle={styles.messagesContainer}
//                     showsVerticalScrollIndicator={false}
//                     onContentSizeChange={() => {
//                         if (messages.length > 0) {
//                             flatListRef.current?.scrollToEnd({ animated: false });
//                         }
//                     }}
//                     ListEmptyComponent={
//                         <View style={styles.emptyContainer}>
//                             <Ionicons name="chatbubble-ellipses-outline" size={64} color={COLORS.textLight} />
//                             <Text style={styles.emptyText}>No messages yet</Text>
//                             <Text style={styles.emptySubText}>Start the conversation by sending a message</Text>
//                         </View>
//                     }
//                 />

//                 {/* Input */}
//                 <View style={styles.inputContainer}>
//                     <TouchableOpacity style={styles.attachmentButton}>
//                         <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
//                     </TouchableOpacity>
//                     <TextInput
//                         style={styles.input}
//                         value={newMessage}
//                         onChangeText={setNewMessage}
//                         placeholder="Type a message..."
//                         placeholderTextColor={COLORS.textLight}
//                         multiline
//                         maxLength={1000}
//                     />
//                     <TouchableOpacity
//                         style={[styles.sendButton, (!newMessage.trim()) && styles.sendDisabled]}
//                         onPress={sendMessage}
//                         disabled={!newMessage.trim()}
//                     >
//                         <Ionicons
//                             name="send"
//                             size={18}
//                             color={newMessage.trim() ? COLORS.white : COLORS.textLight}
//                         />
//                     </TouchableOpacity>
//                 </View>
//             </KeyboardAvoidingView>

//             {/* ✅ Toast هنا */}
//             <Toast />
//         </SafeAreaView>
//     );
// }

// // ... الأنماط بدون تغيير
// const styles = StyleSheet.create({
//     // ... نفس الأنماط من الكود الأول
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.background,
//     },
//     center: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     loadingText: {
//         marginTop: 12,
//         color: COLORS.textLight,
//         fontSize: 16,
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: COLORS.surface,
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         borderBottomColor: COLORS.border,
//     },
//     backButton: {
//         padding: 4,
//     },
//     headerInfo: {
//         flex: 1,
//         marginLeft: 12,
//     },
//     headerName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.text,
//     },
//     headerStatus: {
//         fontSize: 12,
//         color: COLORS.success,
//         marginTop: 2,
//     },
//     headerActions: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     headerAction: {
//         padding: 8,
//         marginLeft: 8,
//     },
//     keyboardView: {
//         flex: 1,
//     },
//     messagesContainer: {
//         padding: 16,
//         flexGrow: 1,
//     },
//     messageRow: {
//         flexDirection: 'row',
//         marginVertical: 4,
//         alignItems: 'flex-end',
//     },
//     myMessageRow: {
//         justifyContent: 'flex-end',
//     },
//     otherMessageRow: {
//         justifyContent: 'flex-start',
//     },
//     avatar: {
//         width: 32,
//         height: 32,
//         borderRadius: 16,
//         marginRight: 8,
//     },
//     bubble: {
//         maxWidth: '75%',
//         paddingHorizontal: 14,
//         paddingVertical: 10,
//         borderRadius: 18,
//         ...Platform.select({
//             ios: {
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 2,
//             },
//             android: {
//                 elevation: 1,
//             },
//         }),
//     },
//     myBubble: {
//         backgroundColor: COLORS.primary,
//         borderBottomRightRadius: 6,
//     },
//     otherBubble: {
//         backgroundColor: COLORS.surface,
//         borderBottomLeftRadius: 6,
//         borderWidth: StyleSheet.hairlineWidth,
//         borderColor: COLORS.border,
//     },
//     senderName: {
//         fontSize: 12,
//         color: COLORS.primary,
//         fontWeight: '600',
//         marginBottom: 2,
//     },
//     text: {
//         fontSize: 16,
//         lineHeight: 20,
//     },
//     myText: {
//         color: COLORS.white,
//     },
//     otherText: {
//         color: COLORS.text,
//     },
//     time: {
//         fontSize: 11,
//         marginTop: 4,
//     },
//     myTime: {
//         color: 'rgba(255,255,255,0.7)',
//         textAlign: 'right',
//     },
//     otherTime: {
//         color: COLORS.textLight,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'flex-end',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         backgroundColor: COLORS.surface,
//         borderTopWidth: StyleSheet.hairlineWidth,
//         borderTopColor: COLORS.border,
//     },
//     attachmentButton: {
//         padding: 8,
//         marginRight: 8,
//     },
//     input: {
//         flex: 1,
//         backgroundColor: COLORS.background,
//         borderRadius: 20,
//         paddingHorizontal: 16,
//         paddingVertical: 10,
//         fontSize: 16,
//         color: COLORS.text,
//         maxHeight: 100,
//         borderWidth: StyleSheet.hairlineWidth,
//         borderColor: COLORS.border,
//     },
//     sendButton: {
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//         backgroundColor: COLORS.primary,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginLeft: 8,
//     },
//     sendDisabled: {
//         backgroundColor: COLORS.textLight,
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: 60,
//     },
//     emptyText: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: COLORS.text,
//         marginTop: 16,
//         marginBottom: 8,
//     },
//     emptySubText: {
//         fontSize: 14,
//         color: COLORS.textLight,
//         textAlign: 'center',
//         paddingHorizontal: 40,
//     },
//     avatarContainer: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         overflow: 'hidden',
//         marginRight: 12,
//         borderWidth: 1,
//         borderColor: COLORS.border,
//     },
//     headerAvatar: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 20,
//     },
// });

import { BASE_URL } from "@/constants/Api";
import { COLORS } from "@/constants/theme";
import { useAuthStore } from "@/stores/authstore";
import { useSocketStore } from "@/stores/socketStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Platform,
    Alert,
    Image,
    KeyboardAvoidingView,
    ActivityIndicator,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

// أنواع البيانات
interface Sender {
    _id: string;
    name: string;
    avatarUrl?: string;
}
interface Message {
    _id: string;
    sender: Sender;
    content: string;
    createdAt: string;
    edited?: boolean;
    editedAt?: string;
    deletedFor?: string[];
}
interface Participant {
    _id: string;
    name: string;
    avatarUrl?: string;
}
interface ConversationData {
    _id: string;
    participant: Participant;
}

export default function ChatScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { token, user: currentUser } = useAuthStore();

    const [conversation, setConversation] = useState<ConversationData | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const [showMessageMenu, setShowMessageMenu] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const flatListRef = useRef<FlatList>(null);

    // 🌐 جلب الرسائل عند تحميل الصفحة
    const fetchMessages = async () => {
        if (!id || !token) {
            setLoading(false);
            return;
        }
        try {
            const msgRes = await fetch(`${BASE_URL}/api/chat/messages/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!msgRes.ok) {
                const err = await msgRes.json();
                throw new Error(err.message || 'Failed to load messages');
            }
            const msgData = await msgRes.json();
            const messagesList: Message[] = msgData.messages || [];
            const filteredMessages = messagesList.filter(
                msg => !msg.deletedFor?.includes(currentUser?.id || '')
            );
            setMessages(filteredMessages);

            let otherParticipant: Participant = {
                _id: 'unknown',
                name: 'User',
                avatarUrl: undefined,
            };
            const otherMsg = filteredMessages.find(
                (msg) => msg.sender._id !== currentUser?.id
            );
            if (otherMsg) {
                otherParticipant = {
                    _id: otherMsg.sender._id,
                    name: otherMsg.sender.name,
                    avatarUrl: otherMsg.sender.avatarUrl,
                };
            }
            setConversation({
                _id: id,
                participant: otherParticipant,
            });
        } catch (error: any) {
            console.error('Error loading chat:', error);
            Alert.alert('Error', error.message || 'Could not load chat');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    // ✅ التحقق من صلاحية receiverId
    // const isValidReceiverId = (id?: string): boolean => {
    //     return !!id && id !== 'unknown' && id.length > 5;
    // };

    // 💬 إرسال رسالة
    const sendMessage = () => {
        if (!newMessage.trim() || !id || !currentUser?.id
            // || !isValidReceiverId(conversation?.participant._id)
        ) {
            Alert.alert('Error', 'Cannot send message. Missing required data.');
            return;
        }

        const messageData = {
            conversationId: id,
            content: newMessage.trim(),
            senderId: currentUser.id,
            receiverId: conversation!.participant._id,
        };

        const tempMessage: Message = {
            _id: 'temp-' + Date.now(),
            sender: {
                _id: currentUser.id,
                name: currentUser.name || 'You',
                avatarUrl: currentUser.avatarUrl,
            },
            content: newMessage.trim(),
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage('');

        const socket = useSocketStore.getState().socket;
        if (socket) {
            socket.emit('sendMessage', messageData);
            socket.once('sendMessageError', (error: any) => {
                Alert.alert('Error', error.message || 'Message not sent');
                setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
            });
        } else {
            Alert.alert('Error', 'Not connected to chat server');
            setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
        }
    };

    // ✏️ تعديل رسالة
    const editMessage = () => {
        if (!editingMessage || !newMessage.trim()) return;
        // !isValidReceiverId(conversation?.participant._id)) 

        const editData = {
            messageId: editingMessage._id,
            conversationId: id,
            newContent: newMessage.trim(),
            userId: currentUser?.id,
            receiverId: conversation!.participant._id,
        };

        const socket = useSocketStore.getState().socket;
        if (socket) {
            socket.emit('editMessage', editData);
            socket.once('editMessageError', (error: any) => {
                Alert.alert('Error', error.message || 'Failed to edit message');
            });
            // Optimistic update
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === editingMessage._id
                        ? { ...msg, content: newMessage.trim(), edited: true, editedAt: new Date().toISOString() }
                        : msg
                )
            );
        }
        setEditingMessage(null);
        setNewMessage('');
    };

    // 🗑️ حذف رسالة
    const deleteMessage = (messageId: string, deleteType: 'forMe' | 'forEveryone') => {
        // if (!isValidReceiverId(conversation?.participant._id)) return;

        const deleteData = {
            messageId,
            conversationId: id,
            userId: currentUser?.id,
            receiverId: conversation!.participant._id,
            deleteType,
        };
        const socket = useSocketStore.getState().socket;
        if (socket) {
            socket.emit('deleteMessage', deleteData);
            socket.once('deleteMessageError', (error: any) => {
                Alert.alert('Error', error.message || 'Failed to delete message');
            });

            setMessages(prev => prev.filter(msg => msg._id !== messageId));
            Toast.show({
                type: 'success',
                text1: `delete message successfully`,
                position: 'top',
                visibilityTime: 2000,
            });
        } else {
            Alert.alert('Error', 'Not connected to chat server');
        }
        setShowMessageMenu(false);

    }


    const openMessageMenu = (message: Message, x: number, y: number) => {
        setSelectedMessage(message);
        setMenuPosition({ x, y });
        setShowMessageMenu(true);
    };

    // 📥 Socket listeners
    useEffect(() => {
        const { socket } = useSocketStore.getState();
        if (!socket || !id) return;

        const handleReceiveMessage = (newMsg: any) => {
            if (newMsg.conversation === id) {
                if (!newMsg.deletedFor?.includes(currentUser?.id)) {
                    setMessages(prev => [...prev, {
                        _id: newMsg._id,
                        sender: newMsg.sender || { _id: 'unknown', name: 'Unknown' },
                        content: newMsg.content || '',
                        createdAt: newMsg.createdAt || new Date().toISOString(),
                        edited: newMsg.edited,
                        editedAt: newMsg.editedAt,
                        deletedFor: newMsg.deletedFor,
                    }]);
                }
                if (newMsg.sender?._id !== currentUser?.id) {
                    Toast.show({
                        type: 'success',
                        text1: 'New message',
                        text2: `${newMsg.sender?.name || 'User'}: ${newMsg.content?.substring(0, 30)}${(newMsg.content?.length || 0) > 30 ? '...' : ''}`,
                        visibilityTime: 2500,
                    });
                }
            }
        };

        const handleMessageEdited = (data: any) => {
            if (data.conversationId === id) {
                setMessages(prev =>
                    prev.map(msg =>
                        msg._id === data.messageId
                            ? { ...msg, content: data.newContent, edited: true, editedAt: data.editedAt }
                            : msg
                    )
                );
            }
        };

        const handleMessageDeleted = (data: any) => {
            if (data.conversationId === id) {
                if (data.deleteType === 'forEveryone' || (data.deleteType === 'forMe' && data.userId === currentUser?.id)) {
                    setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
                }
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);
        socket.on('messageEdited', handleMessageEdited);
        socket.on('messageDeleted', handleMessageDeleted);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.off('messageEdited', handleMessageEdited);
            socket.off('messageDeleted', handleMessageDeleted);
        };
    }, [id, currentUser?.id]);

    useEffect(() => {
        fetchMessages();
    }, [id]);

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isDeleted = item.deletedFor?.includes(currentUser?.id || '');
        if (isDeleted) return null;

        const sender = item.sender || {
            _id: 'unknown',
            name: 'Unknown',
            avatarUrl: undefined,
        };
        const isMyMessage = sender._id === currentUser?.id;

        return (
            <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.otherMessageRow]}>
                {!isMyMessage && (
                    <Image
                        source={sender.avatarUrl ? { uri: sender.avatarUrl } : require('@/assets/images/logo.png')}
                        style={styles.avatar}
                    />
                )}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onLongPress={(e) => isMyMessage && openMessageMenu(item, e.nativeEvent.pageX, e.nativeEvent.pageY)}
                    delayLongPress={500}
                >
                    <View style={[styles.bubble, isMyMessage ? styles.myBubble : styles.otherBubble]}>
                        {!isMyMessage && <Text style={styles.senderName}>{sender.name}</Text>}
                        <Text style={[styles.text, isMyMessage ? styles.myText : styles.otherText]}>{item.content}</Text>
                        <View style={styles.messageFooter}>
                            <Text style={[styles.time, isMyMessage ? styles.myTime : styles.otherTime]}>
                                {formatTime(item.createdAt)}
                            </Text>
                            {item.edited && (
                                <Text style={[styles.editedText, isMyMessage ? styles.myEditedText : styles.otherEditedText]}>
                                    edited
                                </Text>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    // 📋 قائمة السياق
    const renderMessageMenu = () => (
        <Modal
            visible={showMessageMenu}
            transparent
            animationType="fade"
            onRequestClose={() => setShowMessageMenu(false)}
        >
            <TouchableOpacity style={styles.menuOverlay} onPress={() => setShowMessageMenu(false)}>
                <View style={[styles.messageMenu, { top: menuPosition.y, left: '40%' }]}>
                    {selectedMessage?.sender._id === currentUser?.id && (
                        <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
                            <TouchableOpacity
                                style={[styles.menuItem, { backgroundColor: COLORS.primary }]}
                                onPress={() => {
                                    if (selectedMessage) {
                                        setEditingMessage(selectedMessage);
                                        setNewMessage(selectedMessage.content);
                                        setShowMessageMenu(false);
                                    }
                                }}
                            >
                                <MaterialIcons name="edit" size={20} color={'white'} />
                                {/* <Text style={styles.menuText}>Edit</Text> */}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.menuItem, { backgroundColor: COLORS.error }]}
                                onPress={() => {
                                    if (selectedMessage) {
                                        deleteMessage(selectedMessage._id, 'forEveryone');
                                    }
                                }}
                            >
                                <MaterialIcons name="delete-forever" size={20} color={'white'} />
                                {/* <Text style={[styles.menuText, styles.deleteText]}>Delete</Text> */}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuItem
                                ,
                            // styles.cancelItem
                            { backgroundColor: COLORS.textLight }

                            ]} onPress={() => setShowMessageMenu(false)}>
                                <MaterialIcons name="close" size={20} color={'white'} />
                                {/* <Text style={styles.menuText}>Cancel</Text> */}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading chat...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const participant = conversation?.participant || { _id: 'unknown', name: 'User', avatarUrl: undefined };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push(`/user/${participant._id}`)}>
                    {participant.avatarUrl ? (
                        <Image
                            source={{ uri: participant.avatarUrl }}
                            style={styles.headerAvatar}
                        />
                    ) : (
                        <View
                            style={[
                                styles.avatar,
                                { justifyContent: "center", alignItems: "center" },
                            ]}
                        >
                            <Ionicons name="person" size={36} color={COLORS.grey} />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{participant.name}</Text>
                    <Text style={styles.headerStatus}>Online</Text>
                </View>

                {/* <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerAction}>
                        <Ionicons name="videocam-outline" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerAction}>
                        <Ionicons name="call-outline" size={20} color={COLORS.text} />
                    </TouchableOpacity>
                </View> */}
            </View>

            {/* Messages */}
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.messagesContainer}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => {
                        if (messages.length > 0) {
                            flatListRef.current?.scrollToEnd({ animated: false });
                        }
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="chatbubble-ellipses-outline" size={64} color={COLORS.textLight} />
                            <Text style={styles.emptyText}>No messages yet</Text>
                            <Text style={styles.emptySubText}>Start the conversation by sending a message</Text>
                        </View>
                    }
                />

                {/* Input */}
                <View style={styles.inputContainer}>
                    {editingMessage ? (
                        <View style={styles.editHeader}>
                            <Text style={styles.editTitle}>Editing message</Text>
                            <TouchableOpacity onPress={() => { setEditingMessage(null); setNewMessage(''); }}>
                                <Ionicons name="close-circle" size={20} color={COLORS.error} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.attachmentButton}>
                            <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    )}
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
                        placeholderTextColor={COLORS.textLight}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!newMessage.trim()) && styles.sendDisabled]}
                        onPress={editingMessage ? editMessage : sendMessage}
                        disabled={!newMessage.trim()}
                    >
                        <Ionicons
                            name={editingMessage ? "checkmark-circle" : "send"}
                            size={18}
                            color={newMessage.trim() ? COLORS.white : COLORS.textLight}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {renderMessageMenu()}
            <Toast position="top" />
        </SafeAreaView>
    );
}

// ✨ الأنماط — متوافقة مع النسخة الحالية + إضافات القائمة
// // ✨ الأنماط — مأخوذة من النسخة المُحسّنة
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 12,
        color: COLORS.textLight,
        fontSize: 16
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.surface,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.border
    },
    headerUser: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12
    },
    headerInfo: { flex: 1 },
    headerName: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.text
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6
    },
    headerStatus: { fontSize: 13 },
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    headerAction: {
        padding: 8,
        marginLeft: 8
    },
    backButton: { padding: 4 },
    keyboardView: { flex: 1 },
    messagesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexGrow: 1
    },
    messageRow: {
        flexDirection: 'row',
        marginVertical: 4,
        alignItems: 'flex-end',
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    otherMessageRow: { justifyContent: 'flex-start' },
    avatar: {
        width: 'auto',
        height: 'auto',
        borderRadius: 18,
        marginRight: 8
    },
    bubble: {
        maxWidth: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20
    },
    myBubble: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4
    },
    otherBubble: {
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.borderLight
    },
    senderName: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: 4
    },
    text: { fontSize: 16, lineHeight: 22 },
    myText: { color: 'white' },
    otherText: { color: COLORS.text },
    messageFooter: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
        marginTop: 4
    },
    time: { fontSize: 11, marginRight: 6 },
    myTime: { color: 'rgba(255,255,255,0.8)' },
    otherTime: { color: COLORS.textLight },
    editedText: { fontSize: 10, fontStyle: 'italic' },
    myEditedText: { color: 'rgba(255,255,255,0.7)' },
    otherEditedText: { color: COLORS.textLight },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.surface,
        borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.border
    },
    editHeader: {
        position: 'absolute', top: -40,
        left: 0,
        right: 0,
        backgroundColor: COLORS.warning + '20',
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1, borderBottomColor: COLORS.warning
    },
    editTitle: { fontSize: 14, color: COLORS.warning, fontWeight: '500' },
    attachmentButton: { padding: 6, marginRight: 8 },
    input: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 12 : 10,
        fontSize: 16,
        color: COLORS.text,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: COLORS.borderLight
    },
    inputActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
    iconButton: { padding: 8, marginLeft: 4 },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center', alignItems: 'center',
        marginLeft: 8
    },
    menuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    messageMenu: {
        position: 'absolute',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 8,
        minWidth: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 100,
        left: '50%'
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8
    },
    cancelItem: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        marginTop: 4
    },
    menuText: {
        fontSize: 15,
        color: COLORS.text,
        marginLeft: 12
    },
    deleteText: { color: COLORS.error },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: 20,
        marginBottom: 8
    },
    emptySubText: {
        fontSize: 15,
        color: COLORS.textLight,
        textAlign: 'center',
        paddingHorizontal: 40
    },
    sendDisabled: {
        backgroundColor: COLORS.textLight,
    },
    avatarContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        overflow: 'hidden',
        marginHorizontal: 10,
    },
});
