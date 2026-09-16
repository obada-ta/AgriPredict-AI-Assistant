import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

/** 🟢 إنشاء محادثة بين مستخدمين (أو الحصول عليها إن كانت موجودة) */
// export const createOrGetConversation = async (req, res) => {
//   try {
//     const { receiverId } = req.body;
//     const senderId = req.user.id;

//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] }
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({ participants: [senderId, receiverId] });
//     }

//     res.json(conversation);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /** 💬 إرسال رسالة */
// export const sendMessage = async (req, res) => {
//   try {
//     const { conversationId, content } = req.body;

//     const message = await Message.create({
//       conversation: conversationId,
//       sender: req.user.id,
//       content,
//     });

//     await message.populate("sender", "name role");

//     res.status(201).json({ message: "Message sent", data: message });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /** 📜 جلب جميع الرسائل في محادثة */
// export const getMessages = async (req, res) => {
//   try {
//     const { conversationId } = req.params;

//     const messages = await Message.find({ conversation: conversationId })
//       .populate("sender", "name role")
//       .sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// controllers/chatController.js
// import Conversation from "../models/Conversation.js";
// import Message from "../models/Message.js";
import User from "../models/User.js";

/** 🟢 إنشاء محادثة بين مستخدمين (أو الحصول عليها إن كانت موجودة) */
export const createOrGetConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("participants", "name email avatarUrl bio role");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
      await conversation.populate("participants", "name email avatarUrl bio role");
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** 💬 إرسال رسالة */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.id,
      content,
    });

    await message.populate("sender", "name avatarUrl role");

    // تحديث آخر رسالة في المحادثة
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Message sent",
      data: message
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** 📜 جلب جميع الرسائل في محادثة */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name avatarUrl role avatar")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages: messages
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/** 📋 جلب جميع محادثات المستخدم */
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate("participants", "name email avatarUrl bio role avatar")
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    // إضافة معلومات إضافية لكل محادثة
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const otherParticipant = conversation.participants.find(
          participant => participant._id.toString() !== userId
        );

        // جلب عدد الرسائل غير المقروءة (يمكنك تطوير هذا الجزء لاحقاً)
        const unreadCount = await Message.countDocuments({
          conversation: conversation._id,
          sender: { $ne: userId },
          readBy: { $ne: userId }
        });

        return {
          _id: conversation._id,
          participant: otherParticipant,
          lastMessage: conversation.lastMessage || "No messages yet",
          lastMessageAt: conversation.lastMessageAt || conversation.createdAt,
          unreadCount: unreadCount,
          createdAt: conversation.createdAt
        };
      })
    );

    res.json({
      success: true,
      conversations: conversationsWithDetails
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFollowingForChat = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("following", "_id name email avatar avatarUrl bio role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // التحقق من وجود محادثات مع كل مستخدم
    const followingWithConversations = await Promise.all(
      user.following.map(async (followedUser) => {
        const existingConversation = await Conversation.findOne({
          participants: { $all: [userId, followedUser._id] }
        });

        return {
          _id: followedUser._id,
          name: followedUser.name,
          email: followedUser.email,
          avatar: followedUser.avatar,
          avatarUrl: followedUser.avatarUrl,
          bio: followedUser.bio,
          role: followedUser.role,
          hasExistingConversation: !!existingConversation,
          conversationId: existingConversation?._id || null
        };
      })
    );

    res.json({
      success: true,
      following: followingWithConversations
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      _id: id,
      participants: userId
    }).populate("participants", "name email avatarUrl bio role");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const otherParticipant = conversation.participants.find(
      p => p._id.toString() !== userId
    );

    res.json({
      _id: conversation._id,
      participant: otherParticipant
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};  