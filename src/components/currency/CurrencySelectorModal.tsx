import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  StyleSheet,
  SectionList,
  type ListRenderItemInfo,
  type SectionListData,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks";
import { useI18n } from "@/hooks/useI18n";
import { useCurrencyDomainStore } from "@/zustand/currencyDomainStore";
import { useCurrencyHistoryStore } from "@/zustand/currencyHistoryStore";
import {
  getLocalCurrencyCode,
  buildSuggestedCurrencyCodes,
  buildSuggestions,
  filterCurrencies,
  sortCurrenciesAlpha,
} from "@/utils/currency";
import type { Currency } from "@/utils/currency";
import CurrencyRow from "./CurrencyRow";

const DEFAULT_SUGGESTED = ["EUR", "USD", "GBP", "JPY"];

type Section = {
  title: string;
  data: Currency[];
  kind: "suggestions" | "letter";
};

export interface CurrencySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  value?: string;
  onSelect: (code: string) => void;
}

export default function CurrencySelectorModal({
  visible,
  onClose,
  onSelect,
}: CurrencySelectorModalProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { allSupported } = useCurrencyDomainStore();
  const { history, record } = useCurrencyHistoryStore();

  const [query, setQuery] = useState("");
  const [localCode, setLocalCode] = useState("");

  React.useEffect(() => {
    if (visible) getLocalCurrencyCode().then(setLocalCode);
  }, [visible]);

  const suggestedCodes = buildSuggestedCurrencyCodes(
    localCode,
    history,
    DEFAULT_SUGGESTED,
  );
  const suggestions = buildSuggestions(allSupported, suggestedCodes);
  const filteredAll = filterCurrencies(
    sortCurrenciesAlpha(allSupported),
    query,
  );

  const { sections, indexTitles, letterSectionIndex } = useMemo(() => {
    const letterSections: Section[] = [];
    let currentLetter = "";

    for (const currency of filteredAll) {
      const nextLetter = currency.name.trim().charAt(0).toUpperCase() || "#";
      if (nextLetter !== currentLetter) {
        currentLetter = nextLetter;
        letterSections.push({
          title: currentLetter,
          data: [],
          kind: "letter",
        });
      }
      letterSections[letterSections.length - 1].data.push(currency);
    }

    const out: SectionListData<Currency, Section>[] = [];
    if (suggestions.length > 0) {
      out.push({
        title: t("currency_selector.suggestions"),
        data: suggestions,
        kind: "suggestions",
      });
    }
    out.push(...letterSections);

    const titles = letterSections.map((s) => s.title);
    const indexMap = new Map<string, number>();
    out.forEach((section, idx) => {
      if (section.kind === "letter") {
        indexMap.set(section.title, idx);
      }
    });

    return { sections: out, indexTitles: titles, letterSectionIndex: indexMap };
  }, [filteredAll, suggestions, t]);

  const handleSelect = useCallback(
    (currency: Currency) => {
      onSelect(currency.code);
      record(currency.code);
      onClose();
    },
    [onSelect, record, onClose],
  );

  const renderItem = useCallback(
    ({
      item,
      index,
      section,
    }: ListRenderItemInfo<Currency> & { section: Section }) => {
      const isFirst = index === 0;
      const isLast = index === section.data.length - 1;
      return (
        <Pressable
          style={({ pressed }) => [
            styles.rowWrap,
            isFirst && styles.rowWrapFirst,
            isLast && styles.rowWrapLast,
            !isLast && styles.rowWrapDivider,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => handleSelect(item)}
        >
          <CurrencyRow currency={item} />
        </Pressable>
      );
    },
    [colors.border, colors.surface, handleSelect],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => {
      const isFirstLetter =
        section.kind === "letter" &&
        indexTitles.length > 0 &&
        section.title === indexTitles[0];
      return (
        <View
          style={[styles.sectionHeaderWrap, { borderColor: colors.border }]}
        >
          {section.kind === "letter" &&
            isFirstLetter &&
            suggestions.length > 0 && <View style={{ height: 16 }} />}
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {section.title}
          </Text>
        </View>
      );
    },
    [colors, indexTitles, suggestions.length],
  );

  const keyExtractor = useCallback((item: Currency) => item.code, []);

  const noResults = query.trim() && filteredAll.length === 0;
  const showIndex = !noResults && indexTitles.length > 0;
  const listRef = React.useRef<SectionList<Currency, Section>>(null);

  const handleIndexPress = useCallback(
    (title: string) => {
      const sectionIndex = letterSectionIndex.get(title);
      if (sectionIndex == null) return;
      listRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        viewPosition: 0,
      });
    },
    [letterSectionIndex],
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header: fixed padding (modal not full-screen, so no safe-area top) */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              paddingTop: 12,
              paddingBottom: 12,
            },
          ]}
        >
          <Pressable onPress={onClose} style={styles.backButton} hitSlop={8}>
            <Text style={{ color: colors.primary, fontSize: 17 }}>
              {t("common.cancel")}
            </Text>
          </Pressable>
          <View style={styles.titleWrap}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t("currency_selector.title")}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search */}
        <TextInput
          style={[
            styles.search,
            {
              backgroundColor: colors.searchBarBackground,
              borderColor: colors.searchBarBackground,
              color: colors.text,
            },
          ]}
          placeholder={t("currency_selector.search_placeholder")}
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />

        {noResults ? (
          <View style={styles.emptyWrap}>
            {/* No results message */}
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t("currency_selector.no_results")}
            </Text>
            {/* Clear search button */}
            <Pressable onPress={() => setQuery("")} style={styles.clearButton}>
              <Text style={{ color: colors.primary }}>
                {t("currency_selector.clear_search")}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.listWrap}>
            {/* Section list */}
            <SectionList
              ref={listRef}
              sections={sections}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              stickySectionHeadersEnabled={false}
              contentContainerStyle={[
                styles.listContent,
                {
                  paddingBottom: insets.bottom + 24,
                  paddingRight: 6,
                },
              ]}
              style={{ backgroundColor: colors.background }}
              onScrollToIndexFailed={() => {
                // Best effort; the list will recover on next layout.
              }}
            />
            {/* Alphabetical index */}
            {showIndex && (
              <View
                style={[
                  styles.indexWrap,
                  { paddingRight: Math.max(2, insets.right) },
                ]}
                pointerEvents="box-none"
              >
                <View style={styles.indexColumn}>
                  {indexTitles.map((title) => (
                    <Pressable
                      key={title}
                      onPress={() => handleIndexPress(title)}
                      style={styles.indexItem}
                    >
                      <Text
                        style={[styles.indexText, { color: colors.primary }]}
                      >
                        {title}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  titleWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 76,
  },
  search: {
    height: 36,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 0,
  },
  listWrap: {
    flex: 1,
    position: "relative",
  },
  sectionHeaderWrap: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  rowWrap: {
    minHeight: 36,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  rowWrapFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowWrapLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  rowWrapDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  indexWrap: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  indexColumn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: "transparent",
  },
  indexItem: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  indexText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
  },
  clearButton: {
    padding: 12,
  },
});
