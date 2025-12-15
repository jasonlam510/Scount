import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useI18n, useTheme } from "@/hooks";

export default function CheckEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { t } = useI18n();
  const { colors } = useTheme();

  // Resend timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOTPError = (error: any) => {
    // Handle specific error cases
    if (
      error?.message?.includes("expired") ||
      error?.message?.includes("Token has expired")
    ) {
      console.log("EXPECTED ERROR: OTP token has expired");
      Alert.alert(t("common.error"), "Token has expired or is invalid!");
    } else if (
      error?.message?.includes("invalid") ||
      error?.message?.includes("is invalid")
    ) {
      console.log("EXPECTED ERROR: OTP token is invalid");
      Alert.alert(t("common.error"), "Token has expired or is invalid!");
    } else if (error?.message?.includes("Invalid login credentials")) {
      console.log("EXPECTED ERROR: Invalid login credentials");
      Alert.alert(t("common.error"), "Token has expired or is invalid!");
    } else {
      console.error("UNEXPECTED ERROR: OTP verification failed", error);
      // For Supabase errors, show the error message, for other errors show generic message
      Alert.alert(
        t("common.error"),
        error?.message || t("auth.somethingWrong"),
      );
    }
  };

  const handleVerifyOTP = async () => {
    // Validate OTP input
    if (!otpCode.trim()) {
      Alert.alert(t("common.error"), "Please enter the OTP code");
      return;
    }

    if (otpCode.length !== 6) {
      Alert.alert(t("common.error"), "OTP code must be 6 digits");
      return;
    }

    // Check if OTP contains only numbers
    if (!/^\d{6}$/.test(otpCode)) {
      Alert.alert(t("common.error"), "OTP code must contain only numbers");
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email!,
        token: otpCode,
        type: "email",
      });

      if (error) {
        console.log("OTP verification returned error:", error);
        handleOTPError(error);
      } else {
        console.log("OTP verification successful");
        // AuthContext will handle the session and navigation
        // Router will automatically redirect to tabs due to auth state change
      }
    } catch (error: any) {
      console.error(
        "UNEXPECTED ERROR: OTP verification threw exception:",
        error,
      );
      handleOTPError(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email!.trim(),
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error("Resend OTP error:", error);
        Alert.alert(t("common.error"), error.message);
      } else {
        Alert.alert(t("common.success"), t("auth.otpSentAgain"));
        setResendTimer(60); // 1 minute timer
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      Alert.alert(t("common.error"), t("auth.somethingWrong"));
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {/* Mail Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="mail" size={80} color={colors.primary} />
        </View>

        {/* Main Message */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t("auth.otpSentTo")}
        </Text>
        <Text style={[styles.email, { color: colors.primary }]}>{email}</Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <Text style={[styles.otpLabel, { color: colors.text }]}>
            {t("auth.enterOTP")}
          </Text>
          <TextInput
            style={[
              styles.otpInput,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={otpCode}
            onChangeText={(text) => {
              // Only allow numeric input
              const numericText = text.replace(/[^0-9]/g, "");
              setOtpCode(numericText);
            }}
            placeholder="_ _ _ _ _ _"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            maxLength={6}
            textAlign="center"
            autoFocus
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.verifyButton,
              {
                backgroundColor: colors.primary,
              },
              (isVerifying || otpCode.length !== 6) && styles.buttonDisabled,
            ]}
            onPress={handleVerifyOTP}
            disabled={isVerifying || otpCode.length !== 6}
          >
            <Text style={[styles.verifyButtonText, { color: colors.surface }]}>
              {isVerifying ? t("auth.verifying") : t("auth.verifyOTP")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.resendButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.primary,
              },
              (isResending || resendTimer > 0) && styles.buttonDisabled,
            ]}
            onPress={handleResendOTP}
            disabled={isResending || resendTimer > 0}
          >
            <Ionicons name="refresh" size={20} color={colors.primary} />
            <Text style={[styles.resendButtonText, { color: colors.primary }]}>
              {resendTimer > 0
                ? `${t("auth.resendIn")} ${resendTimer}s`
                : isResending
                  ? t("auth.sending")
                  : t("auth.resendOTP")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={handleBackToLogin}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.backButtonText, { color: colors.textSecondary }]}
            >
              {t("auth.backToLogin")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <View
          style={[
            styles.helpContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.helpTitle, { color: colors.text }]}>
            {t("auth.didntReceive")}
          </Text>
          <Text style={[styles.helpText, { color: colors.textSecondary }]}>
            {t("auth.checkSpam")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  email: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 32,
    textAlign: "center",
  },
  otpContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 32,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  otpInput: {
    fontSize: 24,
    fontWeight: "600",
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    textAlign: "center",
    letterSpacing: 4,
  },
  verifyButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  instructionsContainer: {
    width: "100%",
    maxWidth: 350,
    marginBottom: 32,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    marginTop: 16,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 32,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  helpContainer: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
