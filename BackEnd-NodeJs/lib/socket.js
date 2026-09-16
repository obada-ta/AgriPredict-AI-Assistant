
// import { Server } from 'socket.io'
// import http from 'http'
// import express from 'express'
// import Message from '../models/Message.js';
// import Conversation from '../models/Conversation.js';

// const app = express();
// const server = http.createServer(app)
// const io = new Server(server, {
//     cors: {
//         origin: '*'
//     }
// });

// export function getReceiverSocketId(userId) {
//     return userSocketMap[userId]
// }

// const userSocketMap = {}

// io.on('connection', (socket) => {
//     console.log('✅ A user connected', socket.id);

//     socket.on('setup', (userId) => {
//         if (userId) {
//             userSocketMap[userId] = socket.id;
//             console.log(`Initialized userSocketMap: ${userId} -> ${socket.id}`);
//             io.emit('getOnlineUsers', Object.keys(userSocketMap));
//         }
//     });

//     // إرسال رسالة جديدة
//     socket.on('sendMessage', async (messageData) => {
//         const { conversationId, content, senderId, receiverId } = messageData;

//         try {
//             const newMessage = await Message.create({
//                 conversation: conversationId,
//                 sender: senderId,
//                 content,
//             });

//             await newMessage.populate("sender", "name avatarUrl role");

//             await Conversation.findByIdAndUpdate(conversationId, {
//                 lastMessage: content,
//                 lastMessageAt: new Date(),
//             });

//             const receiverSocketId = userSocketMap[receiverId];

//             if (receiverSocketId) {
//                 io.to(receiverSocketId).emit('receiveMessage', newMessage);
//             }

//             socket.emit('messageSent', newMessage);
//         } catch (err) {
//             console.error("Socket sendMessage error:", err);
//             socket.emit('sendMessageError', { message: err.message });
//         }
//     });

//     // تعديل رسالة
//     socket.on('editMessage', async (editData) => {
//         const { messageId, conversationId, newContent, userId, receiverId } = editData;

//         try {
//             const message = await Message.findById(messageId);

//             if (!message) {
//                 throw new Error('Message not found');
//             }

//             if (message.sender.toString() !== userId) {
//                 throw new Error('Unauthorized to edit this message');
//             }

//             // حفظ المحتوى القديم للنسخ الاحتياطي
//             const oldContent = message.content;
//             message.content = newContent;
//             message.edited = true;
//             message.editedAt = new Date();

//             await message.save();
//             await message.populate("sender", "name avatarUrl role");

//             // تحديث آخر رسالة في المحادثة إذا كانت هذه هي الأخيرة
//             const lastMessage = await Message.findOne({ 
//                 conversation: conversationId 
//             }).sort({ createdAt: -1 });

//             if (lastMessage && lastMessage._id.toString() === messageId) {
//                 await Conversation.findByIdAndUpdate(conversationId, {
//                     lastMessage: newContent,
//                     lastMessageAt: new Date(),
//                 });
//             }

//             // إرسال تحديث لجميع المشاركين في المحادثة
//             const participants = await Conversation.findById(conversationId)
//                 .select('participants')
//                 .populate('participants', '_id');

//             participants.participants.forEach(participant => {
//                 const participantSocketId = userSocketMap[participant._id];
//                 if (participantSocketId) {
//                     io.to(participantSocketId).emit('messageEdited', {
//                         messageId,
//                         conversationId,
//                         newContent,
//                         editedAt: message.editedAt,
//                         sender: message.sender
//                     });
//                 }
//             });

//         } catch (err) {
//             console.error("Socket editMessage error:", err);
//             socket.emit('editMessageError', { message: err.message });
//         }
//     });

//     // حذف رسالة
//     socket.on('deleteMessage', async (deleteData) => {
//         const { messageId, conversationId, userId, receiverId, deleteType = 'forMe' } = deleteData;

//         try {
//             const message = await Message.findById(messageId);

//             if (!message) {
//                 throw new Error('Message not found');
//             }

//             if (message.sender.toString() !== userId) {
//                 throw new Error('Unauthorized to delete this message');
//             }

//             if (deleteType === 'forEveryone') {
//                 // حذف للجميع
//                 await Message.findByIdAndDelete(messageId);

//                 // تحديث آخر رسالة في المحادثة إذا كانت هذه هي الأخيرة
//                 const lastMessage = await Message.findOne({ 
//                     conversation: conversationId 
//                 }).sort({ createdAt: -1 });

//                 if (lastMessage) {
//                     await Conversation.findByIdAndUpdate(conversationId, {
//                         lastMessage: lastMessage.content,
//                         lastMessageAt: lastMessage.createdAt,
//                     });
//                 } else {
//                     await Conversation.findByIdAndUpdate(conversationId, {
//                         lastMessage: '',
//                         lastMessageAt: new Date(),
//                     });
//                 }

//                 // إعلام جميع المشاركين
//                 const participants = await Conversation.findById(conversationId)
//                     .select('participants')
//                     .populate('participants', '_id');

//                 participants.participants.forEach(participant => {
//                     const participantSocketId = userSocketMap[participant._id];
//                     if (participantSocketId) {
//                         io.to(participantSocketId).emit('messageDeleted', {
//                             messageId,
//                             conversationId,
//                             deleteType: 'forEveryone'
//                         });
//                     }
//                 });
//             } else {
//                 // حذف لي فقط (Soft Delete)
//                 message.deletedFor = message.deletedFor || [];
//                 if (!message.deletedFor.includes(userId)) {
//                     message.deletedFor.push(userId);
//                     await message.save();
//                 }

//                 socket.emit('messageDeleted', {
//                     messageId,
//                     conversationId,
//                     deleteType: 'forMe'
//                 });
//             }

//         } catch (err) {
//             console.error("Socket deleteMessage error:", err);
//             socket.emit('deleteMessageError', { message: err.message });
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('❌ A user disconnected', socket.id);
//         const userId = Object.keys(userSocketMap).find(
//             key => userSocketMap[key] === socket.id
//         );
//         if (userId) {
//             delete userSocketMap[userId];
//             io.emit('getOnlineUsers', Object.keys(userSocketMap));
//         }
//     });
// });

// export { io, app, server }
// backend/socket.js
// import { Server } from 'socket.io'
// import http from 'http'
// import express from 'express'
// import Message from '../models/Message.js';
// import Conversation from '../models/Conversation.js';
// import Notification from '../models/Notification.js'; // أضف هذا

// const app = express();
// const server = http.createServer(app)
// const io = new Server(server, {
//     cors: {
//         origin: '*'
//     }
// });

// const userSocketMap = {};

// // ✅ صدّر دالة آمنة
// export const getReceiverSocketId = (userId) => {
//     return userSocketMap[userId];
// };

// // دالة مساعدة لإنشاء إشعارات
// async function createNotification(senderId, receiverId, type, data = {}) {
//     try {
//         const notification = await Notification.create({
//             senderId,
//             receiverId,
//             type,
//             data,
//             isRead: false
//         });

//         await notification.populate("senderId", "name avatarUrl role");

//         return notification;
//     } catch (error) {
//         console.error("Error creating notification:", error);
//         return null;
//     }
// }

// io.on('connection', (socket) => {
//     console.log('✅ A user connected', socket.id);

//     socket.on('setup', (userId) => {
//         if (userId) {
//             userSocketMap[userId] = socket.id;
//             console.log(`Initialized userSocketMap: ${userId} -> ${socket.id}`);
//             io.emit('getOnlineUsers', Object.keys(userSocketMap));
//         }
//     });

//     // إرسال رسالة جديدة
//     socket.on('sendMessage', async (messageData) => {
//         const { conversationId, content, senderId, receiverId } = messageData;

//         try {
//             const newMessage = await Message.create({
//                 conversation: conversationId,
//                 sender: senderId,
//                 content,
//             });

//             await newMessage.populate("sender", "name avatarUrl role");

//             await Conversation.findByIdAndUpdate(conversationId, {
//                 lastMessage: content,
//                 lastMessageAt: new Date(),
//             });

//             // إنشاء إشعار للمستلم
//             const notification = await createNotification(
//                 senderId,
//                 receiverId,
//                 'message',
//                 {
//                     conversationId,
//                     messageId: newMessage._id,
//                     content: content.length > 50 ? content.substring(0, 50) + '...' : content
//                 }
//             );

//             const receiverSocketId = userSocketMap[receiverId];

//             if (receiverSocketId) {
//                 // إرسال الرسالة
//                 io.to(receiverSocketId).emit('receiveMessage', newMessage);

//                 // إرسال الإشعار
//                 if (notification) {
//                     io.to(receiverSocketId).emit('newNotification', notification);
//                 }
//             }

//             socket.emit('messageSent', newMessage);
//         } catch (err) {
//             console.error("Socket sendMessage error:", err);
//             socket.emit('sendMessageError', { message: err.message });
//         }
//     });

//     // تعديل رسالة مع إشعار
//     socket.on('editMessage', async (editData) => {
//         const { messageId, conversationId, newContent, userId, receiverId } = editData;

//         try {
//             const message = await Message.findById(messageId);

//             if (!message) {
//                 throw new Error('Message not found');
//             }

//             if (message.sender.toString() !== userId) {
//                 throw new Error('Unauthorized to edit this message');
//             }

//             const oldContent = message.content;
//             message.content = newContent;
//             message.edited = true;
//             message.editedAt = new Date();

//             await message.save();
//             await message.populate("sender", "name avatarUrl role");

//             // إنشاء إشعار للتعديل
//             if (receiverId && receiverId !== userId) {
//                 const notification = await createNotification(
//                     userId,
//                     receiverId,
//                     'message_edited',
//                     {
//                         conversationId,
//                         messageId,
//                         oldContent,
//                         newContent: newContent.length > 50 ? newContent.substring(0, 50) + '...' : newContent
//                     }
//                 );

//                 const receiverSocketId = userSocketMap[receiverId];
//                 if (receiverSocketId && notification) {
//                     io.to(receiverSocketId).emit('newNotification', notification);
//                 }
//             }

//             // تحديث آخر رسالة في المحادثة
//             const lastMessage = await Message.findOne({ 
//                 conversation: conversationId 
//             }).sort({ createdAt: -1 });

//             if (lastMessage && lastMessage._id.toString() === messageId) {
//                 await Conversation.findByIdAndUpdate(conversationId, {
//                     lastMessage: newContent,
//                     lastMessageAt: new Date(),
//                 });
//             }

//             // إرسال تحديث لجميع المشاركين
//             const participants = await Conversation.findById(conversationId)
//                 .select('participants')
//                 .populate('participants', '_id');

//             participants.participants.forEach(participant => {
//                 const participantSocketId = userSocketMap[participant._id];
//                 if (participantSocketId) {
//                     io.to(participantSocketId).emit('messageEdited', {
//                         messageId,
//                         conversationId,
//                         newContent,
//                         editedAt: message.editedAt,
//                         sender: message.sender
//                     });
//                 }
//             });

//         } catch (err) {
//             console.error("Socket editMessage error:", err);
//             socket.emit('editMessageError', { message: err.message });
//         }
//     });

//     // حذف رسالة مع إشعار
//     socket.on('deleteMessage', async (deleteData) => {
//         const { messageId, conversationId, userId, receiverId, deleteType = 'forMe' } = deleteData;

//         try {
//             const message = await Message.findById(messageId);

//             if (!message) {
//                 throw new Error('Message not found');
//             }

//             if (message.sender.toString() !== userId) {
//                 throw new Error('Unauthorized to delete this message');
//             }

//             if (deleteType === 'forEveryone') {
//                 // إنشاء إشعار للحذف
//                 if (receiverId && receiverId !== userId) {
//                     const notification = await createNotification(
//                         userId,
//                         receiverId,
//                         'message_deleted',
//                         {
//                             conversationId,
//                             messageId
//                         }
//                     );

//                     const receiverSocketId = userSocketMap[receiverId];
//                     if (receiverSocketId && notification) {
//                         io.to(receiverSocketId).emit('newNotification', notification);
//                     }
//                 }

//                 await Message.findByIdAndDelete(messageId);

//                 // تحديث آخر رسالة
//                 const lastMessage = await Message.findOne({ 
//                     conversation: conversationId 
//                 }).sort({ createdAt: -1 });

//                 if (lastMessage) {
//                     await Conversation.findByIdAndUpdate(conversationId, {
//                         lastMessage: lastMessage.content,
//                         lastMessageAt: lastMessage.createdAt,
//                     });
//                 } else {
//                     await Conversation.findByIdAndUpdate(conversationId, {
//                         lastMessage: '',
//                         lastMessageAt: new Date(),
//                     });
//                 }

//                 // إعلام جميع المشاركين
//                 const participants = await Conversation.findById(conversationId)
//                     .select('participants')
//                     .populate('participants', '_id');

//                 participants.participants.forEach(participant => {
//                     const participantSocketId = userSocketMap[participant._id];
//                     if (participantSocketId) {
//                         io.to(participantSocketId).emit('messageDeleted', {
//                             messageId,
//                             conversationId,
//                             deleteType: 'forEveryone'
//                         });
//                     }
//                 });
//             } else {
//                 // حذف لي فقط
//                 message.deletedFor = message.deletedFor || [];
//                 if (!message.deletedFor.includes(userId)) {
//                     message.deletedFor.push(userId);
//                     await message.save();
//                 }

//                 socket.emit('messageDeleted', {
//                     messageId,
//                     conversationId,
//                     deleteType: 'forMe'
//                 });
//             }

//         } catch (err) {
//             console.error("Socket deleteMessage error:", err);
//             socket.emit('deleteMessageError', { message: err.message });
//         }
//     });

//     // استماع لإشعارات المكالمات أو أنواع أخرى
//     socket.on('callNotification', async (notificationData) => {
//         const { receiverId, senderId, callType, callId } = notificationData;

//         try {
//             const notification = await createNotification(
//                 senderId,
//                 receiverId,
//                 'call',
//                 {
//                     callType,
//                     callId,
//                     timestamp: new Date()
//                 }
//             );

//             const receiverSocketId = userSocketMap[receiverId];
//             if (receiverSocketId && notification) {
//                 io.to(receiverSocketId).emit('newNotification', notification);
//             }
//         } catch (error) {
//             console.error("Call notification error:", error);
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('❌ A user disconnected', socket.id);
//         const userId = Object.keys(userSocketMap).find(
//             key => userSocketMap[key] === socket.id
//         );
//         if (userId) {
//             delete userSocketMap[userId];
//             io.emit('getOnlineUsers', Object.keys(userSocketMap));
//         }
//     });
// });

// export { io, app, server, getReceiverSocketId };
// lib/socket.js
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import Notification from '../models/Notification.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

const userSocketMap = {};

// ✅ دالة آمنة للحصول على socket ID من userId
const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};
console.log('//////////////////////////');
console.log(userSocketMap);
console.log('//////////////////////////');

// دالة مساعدة لإنشاء إشعارات
async function createNotification(senderId, receiverId, type, data = {}) {
    try {
        const notification = await Notification.create({
            senderId,
            receiverId,
            type,
            data,
            isRead: false
        });

        await notification.populate("senderId", "name avatarUrl role");
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
}

io.on('connection', (socket) => {
    console.log('✅ A user connected', socket.id);

    socket.on('setup', (userId) => {
        if (userId) {
            userSocketMap[userId] = socket.id;
            console.log(`Intialized userSocketMap: ${userId} -> ${socket.id}`);
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        }
    });

    // إرسال رسالة جديدة
    socket.on('sendMessage', async (messageData) => {
        const { conversationId, content, senderId, receiverId } = messageData;

        try {
            const newMessage = await Message.create({
                conversation: conversationId,
                sender: senderId,
                content,
            });

            await newMessage.populate("sender", "name avatarUrl role");

            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: content,
                lastMessageAt: new Date(),
            });

            const notification = await createNotification(
                senderId,
                receiverId,
                'message',
                {
                    conversationId,
                    messageId: newMessage._id,
                    content: content.length > 50 ? content.substring(0, 50) + '...' : content
                }
            );

            const receiverSocketId = userSocketMap[receiverId];

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receiveMessage', newMessage);
                if (notification) {
                    io.to(receiverSocketId).emit('newNotification', notification);
                }
            }

            socket.emit('messageSent', newMessage);
        } catch (err) {
            console.error("Socket sendMessage error:", err);
            socket.emit('sendMessageError', { message: err.message });
        }
    });

    // تعديل رسالة
    socket.on('editMessage', async (editData) => {
        const { messageId, conversationId, newContent, userId, receiverId } = editData;

        try {
            const message = await Message.findById(messageId);
            if (!message) throw new Error('Message not found');
            if (message.sender.toString() !== userId) throw new Error('Unauthorized');

            const oldContent = message.content;
            message.content = newContent;
            message.edited = true;
            message.editedAt = new Date();
            await message.save();
            await message.populate("sender", "name avatarUrl role");

            if (receiverId && receiverId !== userId) {
                const notification = await createNotification(
                    userId,
                    receiverId,
                    'message_edited',
                    {
                        conversationId,
                        messageId,
                        oldContent,
                        newContent: newContent.length > 50 ? newContent.substring(0, 50) + '...' : newContent
                    }
                );

                const receiverSocketId = userSocketMap[receiverId];
                if (receiverSocketId && notification) {
                    io.to(receiverSocketId).emit('newNotification', notification);
                }
            }

            const lastMessage = await Message.findOne({ conversation: conversationId }).sort({ createdAt: -1 });
            if (lastMessage && lastMessage._id.toString() === messageId) {
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: newContent,
                    lastMessageAt: new Date(),
                });
            }

            const participants = await Conversation.findById(conversationId)
                .select('participants')
                .populate('participants', '_id');

            participants.participants.forEach(participant => {
                const participantSocketId = userSocketMap[participant._id];
                if (participantSocketId) {
                    io.to(participantSocketId).emit('messageEdited', {
                        messageId,
                        conversationId,
                        newContent,
                        editedAt: message.editedAt,
                        sender: message.sender
                    });
                }
            });
        } catch (err) {
            console.error("Socket editMessage error:", err);
            socket.emit('editMessageError', { message: err.message });
        }
    });

    // حذف رسالة
    socket.on('deleteMessage', async (deleteData) => {
        const { messageId, conversationId, userId, receiverId, deleteType = 'forMe' } = deleteData;

        try {
            const message = await Message.findById(messageId);
            const deleteContent = message.content;
            if (!message) throw new Error('Message not found');
            if (message.sender.toString() !== userId) throw new Error('Unauthorized');

            if (deleteType === 'forEveryone') {
                if (receiverId && receiverId !== userId) {
                    const notification = await createNotification(
                        userId,
                        receiverId,
                        'message_deleted',
                        {
                            conversationId,
                            messageId,
                            deleteMessage: deleteContent

                        }
                    );

                    const receiverSocketId = userSocketMap[receiverId];
                    if (receiverSocketId && notification) {
                        io.to(receiverSocketId).emit('newNotification', notification);
                    }
                }

                await Message.findByIdAndDelete(messageId);

                const lastMessage = await Message.findOne({ conversation: conversationId }).sort({ createdAt: -1 });
                if (lastMessage) {
                    await Conversation.findByIdAndUpdate(conversationId, {
                        lastMessage: lastMessage.content,
                        lastMessageAt: lastMessage.createdAt,
                    });
                } else {
                    await Conversation.findByIdAndUpdate(conversationId, {
                        lastMessage: '',
                        lastMessageAt: new Date(),
                    });
                }

                const participants = await Conversation.findById(conversationId)
                    .select('participants')
                    .populate('participants', '_id');

                participants.participants.forEach(participant => {
                    const participantSocketId = userSocketMap[participant._id];
                    if (participantSocketId) {
                        io.to(participantSocketId).emit('messageDeleted', {
                            messageId,
                            conversationId,
                            deleteType: 'forEveryone'
                        });
                    }
                });
            } else {
                message.deletedFor = message.deletedFor || [];
                if (!message.deletedFor.includes(userId)) {
                    message.deletedFor.push(userId);
                    await message.save();
                }
                socket.emit('messageDeleted', { messageId, conversationId, deleteType: 'forMe' });
            }
        } catch (err) {
            console.error("Socket deleteMessage error:", err);
            socket.emit('deleteMessageError', { message: err.message });
        }
    });

    // إشعار مكالمة
    socket.on('callNotification', async (notificationData) => {
        const { receiverId, senderId, callType, callId } = notificationData;
        try {
            const notification = await createNotification(
                senderId,
                receiverId,
                'call',
                { callType, callId, timestamp: new Date() }
            );

            const receiverSocketId = userSocketMap[receiverId];
            if (receiverSocketId && notification) {
                io.to(receiverSocketId).emit('newNotification', notification);
            }
        } catch (error) {
            console.error("Call notification error:", error);
        }
    });
    socket.on("joinPost", (postId) => {
        socket.join(`post_${postId}`);
    });

    // الخروج من الغرفة
    socket.on("leavePost", (postId) => {
        socket.leave(`post_${postId}`);
    });
    // عند انقطاع الاتصال
    socket.on('disconnect', () => {
        console.log('❌ A user disconnected', socket.id);
        const userId = Object.keys(userSocketMap).find(
            key => userSocketMap[key] === socket.id
        );
        if (userId) {
            delete userSocketMap[userId];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        }
    });
});

// ✅ تصدير مرة واحدة فقط
export { io, app, server, getReceiverSocketId };