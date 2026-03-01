import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme, useUser } from "@/hooks";
import { useProfile } from "@/powersync/hooks/useProfile";
import { Alert, ActionSheet } from "@/components";
import {
  Modal,
  ModalCard,
  ModalDivider,
  ModalPrimaryButton,
  ModalRow,
  ModalSectionTitle,
  ModalTextField,
  useInvalidShake,
} from "@/components/Modal";
import CurrencySelectorModal from "@/components/currency/CurrencySelectorModal";
import { CURRENCIES_SNAPSHOT } from "@/constants/currencies";
import { GroupService } from "@/db/group";
import Badge from "@/components/Badge/Badge";
import { useCurrencyDomainStore } from "@/zustand/currencyDomainStore";
import { useCurrencyHistoryStore } from "@/zustand/currencyHistoryStore";
import {
  getLocalCurrencyCode,
  buildSuggestedCurrencyCodes,
  buildSuggestions,
} from "@/utils/currency";

interface ParticipantState {
  id: string;
  display_name: string;
  user_id: string | null;
}

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
}

const DEFAULT_SUGGESTED = ["EUR", "USD", "GBP", "JPY"];

export default function CreateGroupModal({
  visible,
  onClose,
}: CreateGroupModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { currentUserUuid } = useUser();
  const { profile } = useProfile();
  const { allSupported } = useCurrencyDomainStore();
  const { history, record } = useCurrencyHistoryStore();

  const [name, setName] = useState("");
  const [currencyCode, setCurrencyCode] = useState<string>("HKD");
  const [selectorModalVisible, setSelectorModalVisible] = useState(false);
  const [quickMenuVisible, setQuickMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState<ParticipantState[]>([]);
  const [localCode, setLocalCode] = useState<string>("");
  const { animatedStyle, shakeMany, clear } = useInvalidShake();

  React.useEffect(() => {
    if (participants.length === 0 && (profile?.name || currentUserUuid)) {
      setParticipants([
        {
          id: Math.random().toString(36).substring(7),
          display_name: profile?.name || "Me",
          user_id: currentUserUuid || null,
        },
      ]);
    }
  }, [profile?.name, currentUserUuid, participants.length]);

  React.useEffect(() => {
    getLocalCurrencyCode().then(setLocalCode);
  }, []);

  React.useEffect(() => {
    if (!visible) {
      setName("");
      setCurrencyCode("HKD");
      setSelectorModalVisible(false);
      setQuickMenuVisible(false);
      setParticipants([]);
    }
  }, [visible]);

  const currencyName =
    CURRENCIES_SNAPSHOT[currencyCode]?.name || `${currencyCode} Currency`;
  const suggestedCodes = buildSuggestedCurrencyCodes(
    localCode,
    history,
    DEFAULT_SUGGESTED,
  );
  const suggestedCurrencies = buildSuggestions(allSupported, suggestedCodes);
  const quickOptions = [
    ...suggestedCurrencies.map((c) => `${c.emoji} ${c.name}`),
    "More",
    "Cancel",
  ];
  const moreIndex = suggestedCurrencies.length;
  const cancelIndex = suggestedCurrencies.length + 1;

  const handleAddParticipant = useCallback(() => {
    const emptyParticipants = participants.filter(
      (p) =>
        p.user_id !== currentUserUuid && p.display_name.trim().length === 0,
    );

    if (emptyParticipants.length > 0) {
      shakeMany(emptyParticipants.map((participant) => participant.id));
      return;
    }

    setParticipants((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        display_name: "",
        user_id: null,
      },
    ]);
  }, [currentUserUuid, participants, shakeMany]);

  const handleRemoveParticipant = useCallback(
    (id: string) => {
      clear(id);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    },
    [clear],
  );

  const handleParticipantNameChange = useCallback(
    (id: string, text: string) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === id ? { ...p, display_name: text } : p)),
      );
    },
    [],
  );

  const handleCreateGroup = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a title.");
      return;
    }

    const filteredParticipants = participants.filter(
      (p) => p.display_name.trim() !== "",
    );

    if (filteredParticipants.length === 0) {
      Alert.alert("Error", "Please add at least one participant.");
      return;
    }

    try {
      setIsLoading(true);

      await GroupService.createGroup({
        title: name,
        currency: currencyCode,
        participants: filteredParticipants.map((p) => ({
          display_name: p.display_name,
          user_id: p.user_id,
        })),
      });

      onClose();
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", "Failed to create tricount.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Create Group sheet */}
      <Modal visible={visible} onClose={onClose} title="Add tricount">
        {/* Keyboard-aware content */}
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 4 : 0}
        >
          {/* Form */}
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {/* Name field */}
            <ModalSectionTitle>Title</ModalSectionTitle>
            <ModalTextField
              variant="form"
              placeholder="E.g. City Trip"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoFocus
            />

            {/* Options */}
            <ModalSectionTitle>Options</ModalSectionTitle>
            <ModalCard>
              <ModalRow onPress={() => setQuickMenuVisible(true)}>
                {/* Currency label/value */}
                <Text style={[styles.rowLabel, { color: colors.text }]}>
                  Currency
                </Text>
                <View style={styles.rowRight}>
                  <Text
                    style={[styles.rowValue, { color: colors.textSecondary }]}
                  >
                    {currencyName}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={colors.textSecondary}
                  />
                </View>
              </ModalRow>
            </ModalCard>

            {/* Participants */}
            <ModalSectionTitle>Participants</ModalSectionTitle>
            <ModalCard>
              {/* Existing participants */}
              {participants.map((participant, index) => {
                const isMe = participant.user_id === currentUserUuid;
                const showDivider = index < participants.length - 1;

                if (isMe) {
                  return (
                    <React.Fragment key={participant.id}>
                      {/* Current user row */}
                      <ModalRow>
                        <Text
                          style={[styles.rowLabel, { color: colors.text }]}
                          numberOfLines={1}
                        >
                          {participant.display_name || "Me"}
                        </Text>
                        <Badge label="Me" />
                      </ModalRow>
                      {showDivider && <ModalDivider />}
                    </React.Fragment>
                  );
                }

                return (
                  <React.Fragment key={participant.id}>
                    {/* Editable participant row */}
                    <Animated.View style={animatedStyle(participant.id)}>
                      <ModalRow>
                        <TextInput
                          style={[
                            styles.participantInput,
                            { color: colors.text },
                          ]}
                          placeholder="Participant Name"
                          placeholderTextColor={colors.textSecondary}
                          value={participant.display_name}
                          onChangeText={(text) =>
                            handleParticipantNameChange(participant.id, text)
                          }
                          autoCapitalize="words"
                        />
                        <Pressable
                          onPress={() =>
                            handleRemoveParticipant(participant.id)
                          }
                          style={styles.removeIconButton}
                          hitSlop={8}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color={colors.secondary}
                          />
                        </Pressable>
                      </ModalRow>
                    </Animated.View>
                    {showDivider && <ModalDivider />}
                  </React.Fragment>
                );
              })}

              {/* Add participant action */}
              <ModalDivider />
              <ModalRow
                onPress={handleAddParticipant}
                style={styles.addParticipantButton}
              >
                <Text
                  style={[styles.addParticipantText, { color: colors.primary }]}
                >
                  Add Another Participant
                </Text>
              </ModalRow>
            </ModalCard>

            {/* Submit */}
            <ModalPrimaryButton
              label="Create tricount"
              onPress={handleCreateGroup}
              disabled={isLoading}
              loading={isLoading}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* Currency picker modal */}
      <CurrencySelectorModal
        visible={selectorModalVisible}
        onClose={() => setSelectorModalVisible(false)}
        value={currencyCode}
        onSelect={(code) => setCurrencyCode(code)}
      />

      {/* Currency quick suggestions */}
      <ActionSheet
        visible={quickMenuVisible}
        title="Suggestions"
        options={quickOptions}
        cancelButtonIndex={cancelIndex}
        onSelect={(buttonIndex) => {
          setQuickMenuVisible(false);
          if (buttonIndex === cancelIndex) return;
          if (buttonIndex === moreIndex) {
            setSelectorModalVisible(true);
            return;
          }
          const picked = suggestedCurrencies[buttonIndex];
          if (!picked) return;
          setCurrencyCode(picked.code);
          record(picked.code);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "600",
    flexShrink: 1,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 12,
  },
  rowValue: {
    fontSize: 17,
  },
  participantInput: {
    flex: 1,
    fontSize: 17,
    height: "100%",
    paddingVertical: 0,
  },
  removeIconButton: {
    marginLeft: 8,
  },
  addParticipantButton: {
    justifyContent: "flex-start",
  },
  addParticipantText: {
    fontSize: 17,
    fontWeight: "600",
  },
});
