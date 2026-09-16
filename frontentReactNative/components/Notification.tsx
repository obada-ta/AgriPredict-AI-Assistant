
// components/Notification.js
// import { NotificationType } from '@/stores/notificationStore';
// import { COLORS } from '@/constants/theme';
// import { Ionicons } from '@expo/vector-icons';
// import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
// import { useNotificationStore } from '@/stores/notificationStore';
// import { useAuthStore } from '@/stores/authstore';
// import { router } from 'expo-router';

// interface Props {
//   notification: NotificationType;
// }

// export default function Notification({ notification }: Props) {
//   const token = useAuthStore(s => s.token);
//   const { markAsRead, deleteNotification } = useNotificationStore();

//   const handlePress = () => {
//     // Mark as read if unread
//     if (!notification.isRead && token) {
//       markAsRead(notification._id, token);
//     }

//     // Navigate based on notification type
//     if (notification.type === 'message' || notification.type === 'message_edited') {
//       router.push(`/chat/${notification.data.conversationId}`);
//     }
//   };

//   const handleDelete = () => {
//     Alert.alert(
//       'Delete Notification',
//       'Are you sure you want to delete this notification?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             if (token) {
//               try {
//                 await deleteNotification(notification._id, token);
//               } catch (error) {
//                 Alert.alert('Error', 'Failed to delete notification');
//               }
//             }
//           },
//         },
//       ]
//     );
//   };

//   const getIconAndTitle = () => {
//     switch (notification.type) {
//       case 'message':
//         return { icon: 'chatbubble-outline', title: 'New Message' };
//       case 'message_edited':
//         return { icon: 'create-outline', title: 'Message Edited' };
//       case 'message_deleted':
//         return { icon: 'trash-outline', title: 'Message Deleted' };
//       case 'follow':
//         return { icon: 'person-add-outline', title: 'New Follower' };
//       case 'call':
//         return { icon: 'call-outline', title: 'Incoming Call' };
//       case 'like':
//         return { icon: 'heart-outline', title: 'New Like' };
//       case 'comment':
//         return { icon: 'chatbubble-ellipses-outline', title: 'New Comment' };
//       default:
//         return { icon: 'notifications-outline', title: 'Notification' };
//     }
//   };

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) {
//       return 'Just now';
//     } else if (diffMins < 60) {
//       return `${diffMins}m ago`;
//     } else if (diffHours < 24) {
//       return `${diffHours}h ago`;
//     } else if (diffDays < 7) {
//       return `${diffDays}d ago`;
//     } else {
//       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     }
//   };

//   const { icon, title } = getIconAndTitle();

//   return (
//     <TouchableOpacity
//       style={[
//         styles.container,
//         { backgroundColor: notification.isRead ? COLORS.surface : '#e8f4fd' }
//       ]}
//       onPress={handlePress}
//       activeOpacity={0.7}
//     >


//       {/* Notification Type Icon */}
//       <View style={styles.typeIconContainer}>
//         {/* <Ionicons
//           name={icon as any}
//           size={22}
//           color={notification.isRead ? COLORS.primary : COLORS.background}
//         /> */}
//         <Image source={{ uri: notification.senderId.avatarUrl }} />
//       </View>

//       {/* Notification Content */}
//       <View>
//         <Image source={{ uri: notification.senderId.avatarUrl }} style={{ width: 100, height: 100 }} />
//       </View>

//       <View style={styles.content}>
//         <View style={styles.header}>
//           <Text style={[styles.senderName, { fontWeight: notification.isRead ? '500' : '700' }]}>
//             {notification.senderId?.name || 'User'}
//           </Text>
//           {/* <Text style={styles.notificationType}>{title}</Text> */}
//         </View>

//         <Text style={styles.message} numberOfLines={2}>
//           {
//             notification.data?.content ||
//             notification.data?.message ||
//             notification.data?.callType ||
//             `${notification.type} notification`}
//         </Text>

//         <View style={styles.footer}>
//           <Text style={styles.time}>{formatTime(notification.createdAt)}</Text>

//           {/* Read Status */}
//           {!notification.isRead && (
//             <View style={styles.unreadContainer}>
//               <View style={styles.unreadDot} />
//               <Text style={styles.unreadText}>New</Text>
//             </View>
//           )}
//         </View>
//       </View >

//       {/* Delete Button */}
//       <TouchableOpacity
//         onPress={handleDelete}
//         style={styles.deleteButton}
//         hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//       >
//         <Ionicons name="trash-outline" size={20} color={COLORS.error} />
//       </TouchableOpacity >


//     </TouchableOpacity >
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     padding: 16,
//     borderRadius: 12,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//     alignItems: 'flex-start',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   typeIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(52, 152, 219, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   content: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   senderName: {
//     fontSize: 15,
//     color: COLORS.text,
//   },
//   notificationType: {
//     fontSize: 12,
//     color: COLORS.primary,
//     fontWeight: '500',
//   },
//   message: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     marginBottom: 8,
//     lineHeight: 18,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   time: {
//     fontSize: 12,
//     color: COLORS.primary,
//   },
//   unreadContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   unreadDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: COLORS.primary,
//   },
//   unreadText: {
//     fontSize: 11,
//     color: COLORS.primary,
//     fontWeight: '600',
//   },
//   deleteButton: {
//     padding: 8,
//     marginLeft: 8,
//   },
// });

// // Alternative simpler version if you prefer
// export function SimpleNotification({ notification }: Props) {
//   const token = useAuthStore(s => s.token);
//   const { deleteNotification } = useNotificationStore();

//   const handleDelete = () => {
//     if (token) {
//       deleteNotification(notification._id, token);
//     }
//   };

//   return (
//     <View style={simpleStyles.container}>
//       <View style={simpleStyles.leftSection}>
//         <View style={simpleStyles.iconContainer}>
//           <Ionicons
//             name="notifications-outline"
//             size={18}
//             color={notification.isRead ? COLORS.textLight : COLORS.primary}
//           />
//         </View>
//         <View style={simpleStyles.content}>
//           <Text style={simpleStyles.text}>
//             {notification.senderId?.name}: {notification.data?.content || notification.type}
//           </Text>
//           <Text style={simpleStyles.time}>
//             {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </Text>
//         </View>
//       </View>
//       <TouchableOpacity onPress={handleDelete} style={simpleStyles.deleteBtn}>
//         <Ionicons name="trash" size={18} color={COLORS.error} />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const simpleStyles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: COLORS.surface,
//     borderRadius: 8,
//     marginVertical: 4,
//     marginHorizontal: 16,
//   },
//   leftSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   iconContainer: {
//     marginRight: 12,
//   },
//   content: {
//     flex: 1,
//   },
//   text: {
//     fontSize: 14,
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   time: {
//     fontSize: 12,
//     color: COLORS.textLight,
//   },
//   deleteBtn: {
//     padding: 8,
//   },
// });

// import { NotificationType } from '@/stores/notificationStore';
// import { COLORS } from '@/constants/theme';
// import { Ionicons } from '@expo/vector-icons';
// import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Modal } from 'react-native';
// import { useNotificationStore } from '@/stores/notificationStore';
// import { useAuthStore } from '@/stores/authstore';
// import { router } from 'expo-router';
// import { useState } from 'react';

// interface Props {
//   notification: NotificationType;
// }

// export default function Notification({ notification }: Props) {
//   const token = useAuthStore(s => s.token);
//   const { markAsRead, deleteNotification } = useNotificationStore();
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);


//   const confirmDeleteUser = (user: any) => {
//     // منع حذف المستخدم الحالي


//     // setUserToDelete(user);

//     setDeleteModalVisible(true);
//   };
//   const handlePress = () => {
//     // Mark as read if unread
//     if (!notification.isRead && token) {
//       markAsRead(notification._id, token);
//     }

//     // Navigate based on notification type
//     if (notification.type === 'message' || notification.type === 'message_edited') {
//       router.push(`/chat/${notification.data.conversationId}`);
//     }
//   }


//   const handleDelete =async () => {
//     // Alert.alert(
//     //   'Delete Notification',
//     //   'Are you sure you want to delete this notification?',
//     //   [
//     //     {
//     //       text: 'Cancel',
//     //       style: 'cancel',
//     //     },
//     //     {
//     //       text: 'Delete',
//     //       style: 'destructive',
//     //       onPress: async () => {
//     if (token) {
//       try {
//         await deleteNotification(notification._id, token);
//       } catch (error) {
//         Alert.alert('Error', 'Failed to delete notification');
//       }
//     }
//     //         }
//     //       },
//     //     },
//     //   ]
//     // );
//   };


//   const getIconAndTitle = () => {
//     switch (notification.type) {
//       case 'message':
//         return { icon: 'chatbubble-outline', title: 'New Message', color: COLORS.primary };
//       case 'message_edited':
//         return { icon: 'create-outline', title: 'Message Edited', color: COLORS.warning };
//       case 'message_deleted':
//         return { icon: 'trash-outline', title: 'Message Deleted', color: COLORS.error };
//       case 'follow':
//         return { icon: 'person-add-outline', title: 'New Follower', color: COLORS.success };
//       case 'call':
//         return { icon: 'call-outline', title: 'Incoming Call', color: COLORS.primary }
//       case 'like':
//         return { icon: 'heart-outline', title: 'New Like', color: COLORS.error };
//       case 'comment':
//         return { icon: 'chatbubble-ellipses-outline', title: 'New Comment', color: COLORS.primary };
//       default:
//         return { icon: 'notifications-outline', title: 'Notification', color: COLORS.primary };
//     }
//   };

//   const getNotificationMessage = () => {
//     const { type, data } = notification;

//     switch (type) {
//       case 'message':
//         return data?.content || 'New message';

//       case 'message_edited':
//         return `Message edited: "${data?.oldContent || ''}" → "${data?.newContent || ''}"`;

//       case 'message_deleted':
//         return data?.deleteMessage
//           ? `"${data.deleteMessage}" was deleted`
//           : 'A message was deleted';

//       case 'follow':
//         return 'Started following you';

//       case 'call':
//         return data?.callType ? `${data.callType} call` : 'Incoming call';

//       case 'like':
//         return 'Liked your post';

//       case 'comment':
//         return 'Commented on your post';

//       default:
//         return `${type} notification`;
//     }
//   };

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) {
//       return 'Just now';
//     } else if (diffMins < 60) {
//       return `${diffMins}m ago`;
//     } else if (diffHours < 24) {
//       return `${diffHours}h ago`;
//     } else if (diffDays < 7) {
//       return `${diffDays}d ago`;
//     } else {
//       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     }
//   };

//   const { icon, title, color } = getIconAndTitle();

//   return (
//     <TouchableOpacity
//       style={[
//         styles.container,
//         {
//           backgroundColor: notification.isRead ? COLORS.surface : '#e8f4fd',
//           borderLeftWidth: 4,
//           borderLeftColor: notification.isRead ? 'transparent' : color
//         }
//       ]}
//       onPress={handlePress}
//       activeOpacity={0.7}
//     >
//       {/* Avatar and Icon Container */}
//       <View style={styles.avatarIconContainer}>
//         {/* User Avatar */}
//         <View style={styles.avatarContainer}>
//           <Image
//             source={{ uri: notification.senderId.avatarUrl }}
//             style={styles.avatar}
//           />
//         </View>

//         {/* Notification Type Icon Overlay */}
//         <View style={[styles.iconOverlay, { backgroundColor: color }]}>
//           <Ionicons
//             name={icon as any}
//             size={14}
//             color={COLORS.background}
//           />
//         </View>
//       </View>

//       {/* Notification Content */}
//       <View style={styles.content}>
//         <View style={styles.header}>
//           <View style={styles.titleRow}>
//             <Text style={[styles.senderName, { fontWeight: notification.isRead ? '500' : '700' }]}>
//               {notification.senderId?.name || 'User'}
//             </Text>
//             <Text style={[styles.notificationType, { color }]}>
//               {title}
//             </Text>
//           </View>
//         </View>

//         <Text style={styles.message} numberOfLines={2}>
//           {/* {notification.data?.content ||
//             notification.data?.message ||
//             notification.data?.callType ||
//             `Message edited: "${notification.data?.oldContent}" → "${notification.data?.newContent}"` ||
//             (notification.data?.deleteMessage ? 'Message deleted' : null) ||
//             `${notification.type} notification`} */}
//           {getNotificationMessage()}
//         </Text>

//         <View style={styles.footer}>
//           <Text style={styles.time}>{formatTime(notification.createdAt)}</Text>

//           {/* Read Status */}
//           {!notification.isRead && (
//             <View style={styles.unreadContainer}>
//               <View style={[styles.unreadDot, { backgroundColor: color }]} />
//               <Text style={[styles.unreadText, { color }]}>New</Text>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* Delete Button */}
//       <TouchableOpacity
//         onPress={confirmDeleteUser}
//         style={styles.deleteButton}
//         hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//       >
//         <Ionicons name="close-outline" size={22} color={COLORS.textLight} />
//       </TouchableOpacity>

//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={deleteModalVisible}
//         onRequestClose={() => setDeleteModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.deleteModalHeader}>
//               <Ionicons name="warning" size={50} color="#dc2626" />
//               <Text style={styles.deleteModalTitle}>Delete User</Text>
//               <Text style={styles.deleteModalText}>
//                 Are you sure you want to delete notification
//               </Text>
//             </View>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setDeleteModalVisible(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.modalButton, styles.deleteConfirmButton]}
//                 onPress={handleDelete}
//               >
//                 <Text style={styles.deleteButtonText}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     padding: 16,
//     borderRadius: 12,
//     marginHorizontal: 16,
//     marginVertical: 6,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//     alignItems: 'flex-start',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   avatarIconContainer: {
//     position: 'relative',
//     marginRight: 12,
//   },
//   avatarContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: '#f0f0f0',
//   },
//   avatar: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   iconOverlay: {
//     position: 'absolute',
//     bottom: -2,
//     right: -2,
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: COLORS.background,
//   },
//   content: {
//     flex: 1,
//     marginRight: 8,
//   },
//   header: {
//     marginBottom: 4,
//   },
//   titleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     flexWrap: 'wrap',
//   },
//   senderName: {
//     fontSize: 16,
//     color: COLORS.text,
//     flex: 1,
//     marginRight: 8,
//   },
//   notificationType: {
//     fontSize: 12,
//     fontWeight: '600',
//     textTransform: 'uppercase',
//   },
//   message: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     marginBottom: 8,
//     lineHeight: 18,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   time: {
//     fontSize: 12,
//     color: COLORS.textLight,
//   },
//   unreadContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   unreadDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//   },
//   unreadText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   deleteButton: {
//     padding: 4,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 24,
//     width: '100%',
//     maxWidth: 400,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1f2937',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 24,
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#f3f4f6',
//   },
//   cancelButtonText: {
//     color: '#6b7280',
//     fontWeight: '600',
//   },
//   deleteModalText: {
//     textAlign: 'center',
//     color: '#6b7280',
//     marginTop: 8,
//     lineHeight: 20,
//   },
//   deleteConfirmButton: {
//     backgroundColor: '#dc2626',
//   },
//   deleteButtonText: {
//     color: 'white',
//     fontWeight: '600',
//   },
//   deleteModalHeader: {
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   deleteModalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#dc2626',
//     marginTop: 16,
//   },
// });
import { NotificationType } from '@/stores/notificationStore';
import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Modal } from 'react-native';
import { useNotificationStore } from '@/stores/notificationStore';
import { useAuthStore } from '@/stores/authstore';
import { router } from 'expo-router';
import { useState } from 'react';

interface Props {
  notification: NotificationType;
}

export default function Notification({ notification }: Props) {
  const token = useAuthStore(s => s.token);
  const { markAsRead, deleteNotification } = useNotificationStore();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // التحقق من وجود senderId بشكل آمن
  const sender = notification.senderId || null;
  const senderName = sender?.name || 'Unknown User';
  const senderAvatarUrl = sender?.avatarUrl || null;

  const confirmDelete = () => {
    setDeleteModalVisible(true);
  };

  const handlePress = () => {
    // Mark as read if unread
    if (!notification.isRead && token) {
      markAsRead(notification._id, token);
    }

    // Navigate based on notification type
    if (notification.type === 'message' || notification.type === 'message_edited') {
      const conversationId = notification.data?.conversationId;
      if (conversationId) {
        router.push(`/chat/${conversationId}`);
      }
    }
  };

  const handleDelete = async () => {
    if (token) {
      try {
        await deleteNotification(notification._id, token);
        setDeleteModalVisible(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to delete notification');
      }
    }
  };

  const getIconAndTitle = () => {
    switch (notification.type) {
      case 'message':
        return { icon: 'chatbubble-outline', title: 'New Message', color: COLORS.primary };
      case 'message_edited':
        return { icon: 'create-outline', title: 'Message Edited', color: COLORS.warning };
      case 'message_deleted':
        return { icon: 'trash-outline', title: 'Message Deleted', color: COLORS.error };
      case 'follow':
        return { icon: 'person-add-outline', title: 'New Follower', color: COLORS.success };
      case 'call':
        return { icon: 'call-outline', title: 'Incoming Call', color: COLORS.primary };
      case 'like':
        return { icon: 'heart-outline', title: 'New Like', color: COLORS.error };
      case 'comment':
        return { icon: 'chatbubble-ellipses-outline', title: 'New Comment', color: COLORS.primary };
      default:
        return { icon: 'notifications-outline', title: 'Notification', color: COLORS.primary };
    }
  };

  const getNotificationMessage = () => {
    const { type, data } = notification;

    switch (type) {
      case 'message':
        return data?.content || 'New message';

      case 'message_edited':
        return `Message edited: "${data?.oldContent || ''}" → "${data?.newContent || ''}"`;

      case 'message_deleted':
        return data?.deleteMessage
          ? `"${data.deleteMessage}" was deleted`
          : 'A message was deleted';

      case 'follow':
        return 'Started following you';

      case 'call':
        return data?.callType ? `${data.callType} call` : 'Incoming call';

      case 'like':
        return 'Liked your post';

      case 'comment':
        return 'Commented on your post';

      default:
        return `${type} notification`;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) {
        return 'Just now';
      } else if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch {
      return 'Just now';
    }
  };

  const { icon, title, color } = getIconAndTitle();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: notification.isRead ? COLORS.surface : '#e8f4fd',
          borderLeftWidth: 4,
          borderLeftColor: notification.isRead ? 'transparent' : color
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Avatar and Icon Container */}
      <View style={styles.avatarIconContainer}>
        {/* User Avatar */}
        <View style={styles.avatarContainer}>
          {senderAvatarUrl ? (
            <Image
              source={{ uri: senderAvatarUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {senderName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Notification Type Icon Overlay */}
        <View style={[styles.iconOverlay, { backgroundColor: color }]}>
          <Ionicons
            name={icon as any}
            size={14}
            color={COLORS.background}
          />
        </View>
      </View>

      {/* Notification Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.senderName, { fontWeight: notification.isRead ? '500' : '700' }]}>
              {senderName}
            </Text>
            <Text style={[styles.notificationType, { color }]}>
              {title}
            </Text>
          </View>
        </View>

        <Text style={styles.message} numberOfLines={2}>
          {getNotificationMessage()}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.time}>{formatTime(notification.createdAt)}</Text>

          {/* Read Status */}
          {!notification.isRead && (
            <View style={styles.unreadContainer}>
              <View style={[styles.unreadDot, { backgroundColor: color }]} />
              <Text style={[styles.unreadText, { color }]}>New</Text>
            </View>
          )}
        </View>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={confirmDelete}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close-outline" size={22} color={COLORS.textLight} />
      </TouchableOpacity>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.deleteModalHeader}>
              <Ionicons name="warning" size={50} color="#dc2626" />
              <Text style={styles.deleteModalTitle}>Delete Notification</Text>
              <Text style={styles.deleteModalText}>
                Are you sure you want to delete this notification?
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  header: {
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  senderName: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  notificationType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  message: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  unreadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  deleteModalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#dc2626',
    marginTop: 16,
  },
  deleteModalText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 8,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  deleteConfirmButton: {
    backgroundColor: '#dc2626',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});