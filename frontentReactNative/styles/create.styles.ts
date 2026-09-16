import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  shareButtonDisabled: {
    opacity: 0.6,
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: COLORS.grey,
    fontSize: 18,
    marginTop: 12,
    textAlign: "center",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  changeButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  changeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  inputSection: {
    padding: 16,
  },
  captionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 8,
    textAlignVertical: "top",
  },
  charCount: {
    color: COLORS.grey,
    fontSize: 12,
    textAlign: "right",
    marginTop: 6,
    marginRight: 8,
  },
});