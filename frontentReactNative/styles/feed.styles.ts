// import { COLORS } from "@/constants/theme";
// import { Dimensions, Platform, StyleSheet } from "react-native";

// const { width } = Dimensions.get("window");

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     // borderBottomWidth: 1,
//     // borderBottomColor: COLORS.surface,

//   },
//   headerTitle: {
//     fontSize: 24,
//     fontFamily: "JetBrainsMono-Medium",
//     color: COLORS.primary,
//   },
//   storiesContainer: {
//     paddingVertical: 12,
//     // borderBottomWidth: 1,
//     borderBottomColor: COLORS.surface,
//   },
//   storyWrapper: {
//     alignItems: "center",
//     marginHorizontal: 8,
//     width: 72,
//   },
//   storyRing: {
//     width: 68,
//     height: 68,
//     borderRadius: 34,
//     padding: 2,
//     backgroundColor: COLORS.background,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//     marginBottom: 4,
//   },
//   noStory: {
//     borderColor: COLORS.grey,
//   },
//   storyAvatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     borderWidth: 2,
//     borderColor: COLORS.background,
//   },
//   storyUsername: {
//     fontSize: 11,
//     color: COLORS.white,
//     textAlign: "center",
//   },
//   post: {
//     marginBottom: 16,
//     borderBottomColor: COLORS.primary,
//     borderBottomWidth: 1
//   },
//   postHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 12,
//   },
//   postHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10
//   },
//   postAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     marginRight: 8,
//   },
//   postUsername: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.white,
//   },
//   postImage: {
//     width: width,
//     height: width,
//   },
//   postActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//   },
//   postActionsLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 16,
//   },
//   postInfo: {
//     paddingHorizontal: 12,
//   },
//   likesText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.white,
//     marginBottom: 6,
//   },
//   captionContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginBottom: 6,
//   },
//   captionUsername: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.white,
//     marginRight: 6,
//   },
//   captionText: {
//     fontSize: 14,
//     color: COLORS.white,
//     flex: 1,
//   },
//   commentsText: {
//     fontSize: 14,
//     color: COLORS.grey,
//     marginBottom: 4,
//   },
//   timeAgo: {
//     fontSize: 12,
//     color: COLORS.grey,
//     marginBottom: 8,
//   },
//   modalContainer: {
//     backgroundColor: COLORS.background,
//     marginBottom: Platform.OS === "ios" ? 44 : 0,
//     flex: 1,
//     marginTop: Platform.OS === "ios" ? 44 : 0,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     height: 56,
//     borderBottomWidth: 0.5,
//     borderBottomColor: COLORS.surface,
//   },
//   modalTitle: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   commentsList: {
//     flex: 1,
//   },
//   commentContainer: {
//     flexDirection: "row",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 0.5,
//     borderBottomColor: COLORS.surface,
//   },
//   commentAvatar: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     marginRight: 12,
//   },
//   commentContent: {
//     flex: 1,
//   },
//   commentUsername: {
//     color: COLORS.white,
//     fontWeight: "500",
//     marginBottom: 4,
//   },
//   commentText: {
//     color: COLORS.white,
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   commentTime: {
//     color: COLORS.grey,
//     fontSize: 12,
//     marginTop: 4,
//   },
//   commentInput: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 0.5,
//     borderTopColor: COLORS.surface,
//     backgroundColor: COLORS.background,
//   },
//   input: {
//     flex: 1,
//     color: COLORS.white,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     marginRight: 12,
//     backgroundColor: COLORS.surface,
//     borderRadius: 20,
//     fontSize: 14,
//   },
//   postButton: {
//     color: COLORS.primary,
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   postButtonDisabled: {
//     opacity: 0.5,
//   },
//   centered: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noCommentsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   noCommentsText: {
//     color: COLORS.white,
//     fontSize: 18,
//     marginTop: 16,
//     fontFamily: 'JetBrainsMono-Medium',
//   },

//   noCommentsSubtext: {
//     color: COLORS.grey,
//     fontSize: 14,
//     marginTop: 8,
//   },
// });

import { COLORS } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "JetBrainsMono-Medium",
    color: COLORS.primary,
  },
  storiesContainer: {
    paddingVertical: 12,
    borderBottomColor: COLORS.surface,
  },
  storyWrapper: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 72,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 4,

  },
  noStory: {
    borderColor: COLORS.grey,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  storyUsername: {
    fontSize: 11,
    color: COLORS.white,
    textAlign: "center",
  },
  post: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginHorizontal: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.primary
  },
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingBottom: 10,

  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  companyBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 3,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  nameContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    fontFamily: 'JetBrainsMono-Medium',
  },
  companyIcon: {
    marginLeft: 6,
  },
  ownerName: {
    fontSize: 13,
    color: COLORS.textLight,
    fontFamily: 'JetBrainsMono-Regular',
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  postImage: {
    width: '100%',
    height: width,
    backgroundColor: COLORS.surface,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  postActionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  postInfo: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: COLORS.success
  },
  likesText: {
    fontSize: 12,
    fontWeight: "600",
    color: 'white',
    marginBottom: 8,
    fontFamily: 'JetBrainsMono-Medium',
  },
  captionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  captionUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: 'white',
    marginRight: 6,
  },
  captionText: {
    fontSize: 15,
    color: 'white',
    lineHeight: 22,
    fontFamily: 'JetBrainsMono-Regular',
  },
  commentsText: {
    fontSize: 14,
    color: COLORS.grey,
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 13,
    color: COLORS.white,
    marginTop: 10,
    fontFamily: 'JetBrainsMono-Regular',
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    marginBottom: Platform.OS === "ios" ? 44 : 0,
    flex: 1,
    marginTop: Platform.OS === "ios" ? 44 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  commentsList: {
    flex: 1,
  },
  commentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: COLORS.white,
    fontWeight: "500",
    marginBottom: 4,
  },
  commentText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
  },
  commentTime: {
    color: COLORS.grey,
    fontSize: 12,
    marginTop: 4,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.surface,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    fontSize: 14,
  },
  postButton: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  noCommentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noCommentsText: {
    color: COLORS.white,
    fontSize: 18,
    marginTop: 16,
    fontFamily: 'JetBrainsMono-Medium',
  },
  noCommentsSubtext: {
    color: COLORS.grey,
    fontSize: 14,
    marginTop: 8,
  },
});