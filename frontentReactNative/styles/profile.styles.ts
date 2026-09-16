// // styles/profile.styles.ts
// import { COLORS } from "@/constants/theme";
// import { Dimensions, StyleSheet } from "react-native";

// const { width, height } = Dimensions.get("window");

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
//     borderBottomWidth: 0.5,
//     borderBottomColor: COLORS.surface,
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   username: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: 'black',

//   },
//   headerRight: {
//     flexDirection: "row",
//     gap: 16,
//   },
//   headerIcon: {
//     padding: 4,
//   },
//   profileInfo: {
//     padding: 16,
//   },
//   avatarAndStats: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   avatarContainer: {
//     marginRight: 32,
//   },
//   avatar: {
//     width: 86,
//     height: 86,
//     borderRadius: 43,
//     borderWidth: 2,
//     borderColor: COLORS.surface,
//   },
//   statsContainer: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-around",
//   },
//   statItem: {
//     alignItems: "center",
//   },
//   statNumber: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: 'black',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 13,
//     color: COLORS.grey,
//   },

//   name: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: 'black',
//     marginBottom: 4,
//     textTransform: 'capitalize'
//   },
//   bio: {
//     fontSize: 14,
//     color: 'black',
//     lineHeight: 20,
//   },
//   actionButtons: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 8,
//   },
//   editButton: {
//     flex: 1,
//     backgroundColor: COLORS.surface,
//     padding: 8,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   editButtonText: {
//     color: 'white',
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   shareButton: {
//     backgroundColor: COLORS.surface,
//     padding: 8,
//     borderRadius: 8,
//     aspectRatio: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   gridItem: {
//     flex: 1 / 3,
//     aspectRatio: 1,
//     padding: 1,
//   },
//   gridImage: {
//     flex: 1,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: COLORS.background,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     minHeight: 700,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   modalTitle: {
//     color: 'black',
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     color: COLORS.grey,
//     marginBottom: 8,
//     fontSize: 14,
//   },
//   input: {
//     backgroundColor: COLORS.surface,
//     borderRadius: 8,
//     padding: 12,
//     color: 'black',
//     fontSize: 16,
//   },
//   bioInput: {
//     height: 100,
//     textAlignVertical: "top",
//   },
//   saveButton: {
//     backgroundColor: COLORS.primary,
//     padding: 16,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   saveButtonText: {
//     color: COLORS.background,
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.9)",
//     justifyContent: "center",
//   },
//   postDetailContainer: {
//     backgroundColor: COLORS.background,
//     maxHeight: height * 0.9,
//   },
//   postDetailHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     padding: 12,
//     borderBottomWidth: 0.5,
//     borderBottomColor: COLORS.surface,
//   },
//   postDetailImage: {
//     width: width,
//     height: width,
//   },
//   followButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 24,
//     paddingVertical: 8,
//     borderRadius: 8,
//     marginTop: 16,
//   },
//   followingButton: {
//     backgroundColor: COLORS.surface,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   followButtonText: {
//     color: 'black',
//     fontSize: 14,
//     fontWeight: "600",
//     textAlign: "center",
//   },
//   followingButtonText: {
//     color: 'black',
//     textAlign: "center",
//   },
//   noPostsContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 48,
//     gap: 12,
//     flex: 1,
//   },
//   noPostsText: {
//     color: COLORS.grey,
//     fontSize: 16,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   postsGrid: {
//     flex: 1,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: 'black',
//   },
//   editProfileButton: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: COLORS.grey,
//     paddingVertical: 8,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     marginTop: 16,
//     alignSelf: 'stretch',
//     alignItems: 'center',
//   },
//   editProfileButtonText: {
//     color: 'black',
//     fontSize: 14,
//     fontFamily: 'JetBrainsMono-Medium',
//   },
// });
// import { StyleSheet } from "react-native";
// import { COLORS } from "@/constants/theme";

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
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   headerLeft: {
//     flex: 1,
//   },
//   headerRight: {
//     flexDirection: "row",
//   },
//   headerIcon: {
//     padding: 8,
//   },
//   username: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.text,
//   },
//   profileInfo: {
//     padding: 16,
//   },
//   avatarAndStats: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   avatarContainer: {
//     marginRight: 20,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   statsContainer: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-around",
//   },
//   statItem: {
//     alignItems: "center",
//   },
//   statNumber: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.text,
//   },
//   statLabel: {
//     fontSize: 14,
//     color: COLORS.grey,
//     marginTop: 4,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: COLORS.text,
//     marginBottom: 4,
//   },
//   bio: {
//     fontSize: 14,
//     color: COLORS.text,
//     lineHeight: 18,
//     marginBottom: 12,
//   },
//   actionButtons: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   editButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   editButtonText: {
//     color: "white",
//     fontWeight: "600",
//   },
//   shareButton: {
//     backgroundColor: COLORS.secondary,
//     padding: 8,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   gridItem: {
//     flex: 1,
//     aspectRatio: 1,
//     margin: 1,
//   },
//   gridImage: {
//     width: "100%",
//     height: "100%",
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: "90%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.text,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.text,
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: COLORS.text,
//   },
//   bioInput: {
//     height: 100,
//     textAlignVertical: "top",
//   },
//   saveButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   saveButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.9)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   postDetailContainer: {
//     width: "100%",
//     height: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   postDetailHeader: {
//     position: "absolute",
//     top: 60,
//     right: 20,
//     zIndex: 1,
//   },
//   postDetailImage: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "contain",
//   },
//   // الأنماط الجديدة للصورة
//   avatarEditContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   avatarActions: {
//     flexDirection: 'row',
//     marginTop: 10,
//     gap: 10,
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   avatarButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 5,
//   },
//   avatarButtonText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '500',
//   },
// });
import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: COLORS.text,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
  },
  headerIcon: {
    padding: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
  },
  profileInfo: {
    padding: 16,
  },
  avatarAndStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 16,
  },
  noBio: {
    fontSize: 14,
    color: COLORS.grey,
    fontStyle: "italic",
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  editButtonText: {
    color: "white",
    fontWeight: "600",
  },
  shareButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  // noPostsContainer: {
  //   height: 200,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginVertical: 20,
  // },
  noPostsText: {
    fontSize: 16,
    color: COLORS.grey,
    marginTop: 12,
  },
  // gridItem: {
  //   flex: 1,
  //   aspectRatio: 1,
  //   margin: 1,
  // },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  avatarEditContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 5,
  },
  avatarButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  avatarButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  postDetailContainer: {
    width: "90%",
    backgroundColor: "transparent",
    borderRadius: 12,
    overflow: "hidden",
  },
  postDetailHeader: {
    padding: 16,
    alignItems: "flex-end",
  },
  postDetailImage: {
    width: "100%",
    height: 400,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  settingsSidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '70%',
    maxWidth: 280,
    backgroundColor: 'white',
    // backgroundColor: 'black',
    paddingTop: 50,
    paddingHorizontal: 0,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    marginBottom: 10,
  },
  sidebarTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    // borderBottomColor: 'rgba(255,255,255,0.1)',
    borderBottomColor: COLORS.primary,
    // backgroundColor: COLORS.primary
  },
  sidebarItemText: {
    color: COLORS.primary,

    fontSize: 16,
    marginRight: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    // backgroundColor: '#FF3B30',
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    borderColor: '#FF3B30',
    borderWidth: 1,
    margin: 20,
  },
  logoutButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  noPostsContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    marginVertical: 40,
  },
  noPostsIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  noPostsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  noPostsSubtitle: {
    fontSize: 14,
    color: COLORS.grey,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  createPostButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createPostButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 1, // ← اجعله 2 لمسافة أفضل
    overflow: "hidden",
    borderRadius: 4,
  },
  gridImage: {
    width: "100%",
    height: "100%",
    // تأثير تمرير سلس
  },
  postOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 6,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  postStatText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  /* ================= POSTS SECTION ================= */

  postsSection: {
    marginTop: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },

  gridContainer: {
    paddingHorizontal: 2,
  },

  /* ================= POST DETAIL MODAL ================= */

  postDetailContent: {
    backgroundColor: "black",
    borderRadius: 12,
    overflow: "hidden",
  },

  backButton: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 10,
  },

  optionsButton: {
    position: "absolute",
    right: 16,
    top: 16,
  },

  postDetailInfo: {
    padding: 12,
  },

  postDetailStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  postDetailStat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },

  postDetailStatText: {
    color: "white",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },

  postDetailText: {
    marginTop: 6,
  },

  postDetailUsername: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },

  postDetailCaption: {
    color: "white",
    fontSize: 13,
    marginTop: 4,
  },

  postDetailTime: {
    color: COLORS.grey,
    fontSize: 12,
    marginTop: 6,
  },

});