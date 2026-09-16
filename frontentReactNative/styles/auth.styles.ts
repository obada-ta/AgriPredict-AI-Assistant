// // styles/auth.styles.ts
// import { COLORS } from "@/constants/theme";
// import { Dimensions, StyleSheet } from "react-native";

// const { width, height } = Dimensions.get("window");

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   brandSection: {
//     alignItems: "center",
//     marginTop: height * 0.12,
//   },
//   logoContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 18,
//     backgroundColor: "rgba(74, 222, 128, 0.15)",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   appName: {
//     fontSize: 42,
//     fontWeight: "700",
//     fontFamily: "JetBrainsMono-Medium",
//     color: COLORS.primary,
//     letterSpacing: 0.5,
//     marginBottom: 8,
//   },
//   tagline: {
//     fontSize: 16,
//     color: COLORS.grey,
//     letterSpacing: 1,
//     textTransform: "lowercase",
//   },
//   illustrationContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 40,
//   },
//   illustration: {
//     width: width * 0.75,
//     height: width * 0.75,
//     maxHeight: 280,
//   },
//   loginSection: {
//     width: "100%",
//     paddingHorizontal: 24,
//     paddingBottom: 40,
//     alignItems: "center",
//   },
//   googleButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.white,
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     borderRadius: 14,
//     marginBottom: 20,
//     width: "100%",
//     maxWidth: 300,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   login: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.white,
//     padding: 10,
//     borderRadius: 14,
//     marginBottom: 20,
//     width: "100%",
//     maxWidth: 300,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   googleIconContainer: {
//     width: 24,
//     height: 24,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   googleButtonText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: COLORS.surface,
//   },
//   termsText: {
//     textAlign: "center",
//     fontSize: 12,
//     color: COLORS.grey,
//     maxWidth: 280,
//   },
// });
// styles/auth.styles.ts
// styles/auth.styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // خلفية شبه شفافة للقراءة
  },
  brandSection: {
    alignItems: 'center',
    // paddingTop: 5,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
      paddingHorizontal: 10,
    minHeight: 100,
  },
  illustration: {
    
    width: '50%',
    height: 200,
  },
  loginSection: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  // Input Fields
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
    padding: 4,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  focusedInput: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  // Buttons
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.textLight,
    opacity: 0.6,
  },
  loginButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Additional Links
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  termsText: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 24,
    lineHeight: 16,
  },
});