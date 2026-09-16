// export const STORIES = [
//   {
//     id: "1",
//     username: "You",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
//     hasStory: false,
//   },
//   {
//     id: "2",
//     username: "sarah.k",
//     avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "3",
//     username: "alex.m",
//     avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "4",
//     username: "julia.r",
//     avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "5",
//     username: "mike.rs",
//     avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "6",
//     username: "jane.d",
//     avatar: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "7",
//     username: "claudia",
//     avatar: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "8",
//     username: "mike.rs",
//     avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
// ];

// // export const MOCK_POSTS = [
// //   {
// //     _id: "post_1",
// //     imageUrl: "https://picsum.photos/600/600?random=1",
// //     caption: "Sunset vibes 🌅",
// //     likes: 42,
// //     comments: 5,
// //     createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // قبل 30 دقيقة
// //     author: {
// //       _id: "user_1",
// //       username: "ahmad_dev",
// //       image: "https://i.pravatar.cc/150?img=1",
// //     },
// //   },
// //   {
// //     _id: "post_2",
// //     imageUrl: "https://picsum.photos/600/600?random=2",
// //     caption: "Morning coffee and code ☕",
// //     likes: 28,
// //     comments: 2,
// //     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // قبل ساعتين
// //     author: {
// //       _id: "user_2",
// //       username: "sara_design",
// //       image: "https://i.pravatar.cc/150?img=5",
// //     },
// //   },
// //   {
// //     _id: "post_3",
// //     imageUrl: "https://picsum.photos/600/600?random=3",
// //     caption: "Street photography in Damascus 📸",
// //     likes: 105,
// //     comments: 12,
// //     createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // قبل 5 ساعات
// //     author: {
// //       _id: "user_3",
// //       username: "youssef_photo",
// //       image: "https://i.pravatar.cc/150?img=12",
// //     },
// //   },
// // ];
// export const MOCK_POSTS = [
//   {
//     _id: "post_1",
//     imageUrl: "https://picsum.photos/600/600?random=1",
//     caption: "Sunset vibes 🌅",
//     likes: 42,
//     comments: 5,
//     _creationTime: Date.now() - 1000 * 60 * 30,
//     isLiked: false,
//     isBookmarked: false,
//     author: {
//       _id: "user_1",
//       username: "john_doe",
//       image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
//     },
//   },
//   {
//     _id: "post_2",
//     imageUrl: "https://picsum.photos/600/600?random=2",
//     caption: "Morning coffee and code ☕",
//     likes: 28,
//     comments: 2,
//     _creationTime: Date.now() - 1000 * 60 * 60 * 2,
//     isLiked: true,
//     isBookmarked: false,
//     author: {
//       _id: "user_2",
//       username: "sara_design",
//       image: "https://i.pravatar.cc/150?img=5",
//     },
//   },
// ];
// export const MOCK_NOTIFICATIONS = [
//   {
//     _id: "notif_1",
//     type: "like",
//     _creationTime: Date.now() - 1000 * 60 * 5,
//     sender: {
//       _id: "user_2",
//       username: "sara_design",
//       image: "https://i.pravatar.cc/150?img=5",
//     },
//     post: {
//       imageUrl: "https://picsum.photos/600/600?random=1",
//     },
//   },
//   {
//     _id: "notif_2",
//     type: "follow",
//     _creationTime: Date.now() - 1000 * 60 * 60 * 1,
//     sender: {
//       _id: "user_3",
//       username: "alex_photo",
//       image: "https://i.pravatar.cc/150?img=12",
//     },
//   },
// ];

// export const MOCK_BOOKMARKS = [
//   {
//     _id: "bookmark_1",
//     imageUrl: "https://picsum.photos/600/600?random=3",
//   },
//   {
//     _id: "bookmark_2",
//     imageUrl: "https://picsum.photos/600/600?random=4",
//   },
// ];
// أنواع TypeScript
export type UserId = "user_1" | "user_2" | "user_3" | "user_4" | "user_5";

export interface MockUser {
  _id: UserId;
  username: string;
  fullname: string;
  email: string;
  image: string;
  bio: string;
  posts: number;
  followers: number;
  following: number;
}

export interface MockPost {
  _id: string;
  imageUrl: string;
  caption?: string;
  likes: number;
  comments: number;
  _creationTime: number;
  isLiked: boolean;
  isBookmarked: boolean;
  author: MockUser;
}

export interface MockStory {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
}

export interface MockNotification {
  _id: string;
  type: "like" | "follow" | "comment";
  _creationTime: number;
  sender: MockUser;
  comment?: string;
  post?: {
    imageUrl: string;
  };
}

export interface MockBookmark {
  _id: string;
  imageUrl: string;
  postId: string;
}

export interface MockComment {
  _id: string;
  content: string;
  _creationTime: number;
  user: MockUser;
}

// البيانات الوهمية
export const STORIES: MockStory[] = [
  {
    id: "1",
    username: "You",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    hasStory: false,
  },
  {
    id: "2",
    username: "sarah.k",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    hasStory: true,
  },
  {
    id: "3",
    username: "alex.m",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    hasStory: true,
  },
  {
    id: "4",
    username: "julia.r",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
    hasStory: true,
  },
  {
    id: "5",
    username: "mike.rs",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
    hasStory: true,
  },
  {
    id: "6",
    username: "jane.d",
    avatar: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=400&h=400&fit=crop",
    hasStory: true,
  },
  {
    id: "7",
    username: "claudia",
    avatar: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=400&h=400&fit=crop",
    hasStory: true,
  },
  {
    id: "8",
    username: "tom.w",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
    hasStory: true,
  },
];

export const MOCK_USER: MockUser = {
  _id: "user_1",
  username: "john_doe",
  fullname: "John Doe",
  email: "john@example.com",
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  bio: "Digital creator | Photography enthusiast 🌅 | Exploring the world one shot at a time",
  posts: 24,
  followers: 1248,
  following: 356,
};

export const MOCK_USERS: MockUser[] = [
  MOCK_USER,
  {
    _id: "user_2",
    username: "sara_design",
    fullname: "Sara Johnson",
    email: "sara@example.com",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    bio: "UI/UX Designer • Art lover 🎨 • Creating beautiful experiences",
    posts: 15,
    followers: 892,
    following: 210,
  },
  {
    _id: "user_3",
    username: "alex_photo",
    fullname: "Alex Chen",
    email: "alex@example.com",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    bio: "Professional Photographer 📸 | Portrait & Landscape | Available for bookings",
    posts: 42,
    followers: 2156,
    following: 189,
  },
  {
    _id: "user_4",
    username: "emma_travel",
    fullname: "Emma Wilson",
    email: "emma@example.com",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
    bio: "Travel Blogger ✈️ | Adventure seeker | 50+ countries and counting",
    posts: 67,
    followers: 3450,
    following: 420,
  },
  {
    _id: "user_5",
    username: "mike_dev",
    fullname: "Mike Rodriguez",
    email: "mike@example.com",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
    bio: "Full-stack developer 💻 | Open source enthusiast | Coffee addict",
    posts: 18,
    followers: 567,
    following: 198,
  }
];

export const MOCK_POSTS: MockPost[] = [
  {
    _id: "post_1",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
    caption: "Sunset vibes 🌅 There's something magical about golden hour that makes everything look better.",
    likes: 42,
    comments: 5,
    _creationTime: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    isLiked: false,
    isBookmarked: false,
    author: MOCK_USERS[0],
  },
  {
    _id: "post_2",
    imageUrl: "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=600&h=600&fit=crop",
    caption: "Morning coffee and code ☕ Starting the day right with some React Native development.",
    likes: 28,
    comments: 2,
    _creationTime: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    isLiked: true,
    isBookmarked: false,
    author: MOCK_USERS[4],
  },
  {
    _id: "post_3",
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop",
    caption: "Street photography in downtown 📸 Capturing the soul of the city one frame at a time.",
    likes: 105,
    comments: 12,
    _creationTime: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    isLiked: false,
    isBookmarked: true,
    author: MOCK_USERS[2],
  },
  {
    _id: "post_4",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    caption: "Portrait session today! Loving the natural light in this studio. ✨",
    likes: 89,
    comments: 8,
    _creationTime: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
    isLiked: true,
    isBookmarked: false,
    author: MOCK_USERS[2],
  },
  {
    _id: "post_5",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop",
    caption: "Mountain views from today's hike 🏔️ Nature always has a way of putting things in perspective.",
    likes: 156,
    comments: 15,
    _creationTime: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    isLiked: false,
    isBookmarked: true,
    author: MOCK_USERS[3],
  },
  {
    _id: "post_6",
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=600&fit=crop",
    caption: "Forest bathing 🌲 Sometimes you need to disconnect to reconnect.",
    likes: 203,
    comments: 23,
    _creationTime: Date.now() - 1000 * 60 * 60 * 36, // 1.5 days ago
    isLiked: true,
    isBookmarked: false,
    author: MOCK_USERS[3],
  }
];

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    _id: "notif_1",
    type: "like",
    _creationTime: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    sender: MOCK_USERS[1],
    post: {
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop",
    },
  },
  {
    _id: "notif_2",
    type: "follow",
    _creationTime: Date.now() - 1000 * 60 * 60 * 1, // 1 hour ago
    sender: MOCK_USERS[2],
  },
  {
    _id: "notif_3",
    type: "comment",
    _creationTime: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    sender: MOCK_USERS[3],
    comment: "Love this shot! The lighting is perfect 👌",
    post: {
      imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop",
    },
  },
  {
    _id: "notif_4",
    type: "like",
    _creationTime: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
    sender: MOCK_USERS[4],
    post: {
      imageUrl: "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=600&h=600&fit=crop",
    },
  },
  {
    _id: "notif_5",
    type: "follow",
    _creationTime: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
    sender: MOCK_USERS[1],
  },
  {
    _id: "notif_6",
    type: "comment",
    _creationTime: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    sender: MOCK_USERS[2],
    comment: "Amazing composition! Where was this taken?",
    post: {
      imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=600&fit=crop",
    },
  }
];

export const MOCK_BOOKMARKS: MockBookmark[] = [
  {
    _id: "bookmark_1",
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=600&fit=crop",
    postId: "post_3",
  },
  {
    _id: "bookmark_2",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop",
    postId: "post_5",
  },
  {
    _id: "bookmark_3",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    postId: "post_4",
  },
  {
    _id: "bookmark_4",
    imageUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=600&fit=crop",
    postId: "post_6",
  },
];

export const MOCK_USER_POSTS: Record<UserId, MockPost[]> = {
  "user_1": MOCK_POSTS.filter(post => post.author._id === "user_1"),
  "user_2": [
    {
      _id: "post_7",
      imageUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop",
      caption: "Working on a new design system today! 🎨",
      likes: 34,
      comments: 4,
      _creationTime: Date.now() - 1000 * 60 * 60 * 4,
      isLiked: false,
      isBookmarked: false,
      author: MOCK_USERS[1],
    },
    {
      _id: "post_8",
      imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=600&fit=crop",
      caption: "Color palette inspiration for the new project 🌈",
      likes: 67,
      comments: 7,
      _creationTime: Date.now() - 1000 * 60 * 60 * 48,
      isLiked: false,
      isBookmarked: false,
      author: MOCK_USERS[1],
    }
  ],
  "user_3": MOCK_POSTS.filter(post => post.author._id === "user_3"),
  "user_4": MOCK_POSTS.filter(post => post.author._id === "user_4"),
  "user_5": MOCK_POSTS.filter(post => post.author._id === "user_5"),
};

export const MOCK_COMMENTS: Record<string, MockComment[]> = {
  "post_1": [
    {
      _id: "comment_1",
      content: "Beautiful sunset! 😍",
      _creationTime: Date.now() - 1000 * 60 * 25,
      user: MOCK_USERS[1],
    },
    {
      _id: "comment_2",
      content: "The colors are amazing!",
      _creationTime: Date.now() - 1000 * 60 * 20,
      user: MOCK_USERS[2],
    }
  ],
  "post_3": [
    {
      _id: "comment_3",
      content: "Great street photography!",
      _creationTime: Date.now() - 1000 * 60 * 60 * 4,
      user: MOCK_USERS[0],
    },
    {
      _id: "comment_4",
      content: "Love the composition 👏",
      _creationTime: Date.now() - 1000 * 60 * 60 * 3,
      user: MOCK_USERS[3],
    }
  ],
  "post_5": [
    {
      _id: "comment_5",
      content: "Wow! Where is this?",
      _creationTime: Date.now() - 1000 * 60 * 60 * 20,
      user: MOCK_USERS[1],
    },
    {
      _id: "comment_6",
      content: "Nature at its finest 🌿",
      _creationTime: Date.now() - 1000 * 60 * 60 * 18,
      user: MOCK_USERS[4],
    }
  ]
};

// دوال مساعدة آمنة مع TypeScript
export const getPostComments = (postId: string): MockComment[] => {
  return MOCK_COMMENTS[postId] || [];
};

export const getUserPosts = (userId: string): MockPost[] => {
  return MOCK_USER_POSTS[userId as UserId] || [];
};

export const findUserById = (userId: string): MockUser | undefined => {
  return MOCK_USERS.find(user => user._id === userId);
};

export const getBookmarkedPosts = (): MockBookmark[] => {
  return MOCK_BOOKMARKS;
};

export const getNotifications = (): MockNotification[] => {
  return MOCK_NOTIFICATIONS;
};

export const getStories = (): MockStory[] => {
  return STORIES;
};

export const getFeedPosts = (): MockPost[] => {
  return MOCK_POSTS;
};