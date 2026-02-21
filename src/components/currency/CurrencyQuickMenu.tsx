import React, { useEffect, useState } from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { useI18n } from "@/hooks/useI18n";
import { useTheme } from "@/hooks";
import { useCurrencyDomainStore } from "@/zustand/currencyDomainStore";
import { useCurrencyHistoryStore } from "@/zustand/currencyHistoryStore";
import {
  getLocalCurrencyCode,
  buildSuggestedCurrencyCodes,
  buildSuggestions,
} from "@/utils/currency";
import type { Currency } from "@/utils/currency";

const DEFAULT_SUGGESTED = ["EUR", "USD", "GBP", "JPY"];

function optionTitle(currency: Currency): string {
  return `${currency.emoji}  ${currency.name}`;
}

export interface CurrencyQuickMenuProps {
  value?: string;
  onChange: (code: string) => void;
  onOpenFullSelector: () => void;
  children: React.ReactElement;
}

export default function CurrencyQuickMenu({
  onChange,
  onOpenFullSelector,
  children,
}: CurrencyQuickMenuProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const { allSupported } = useCurrencyDomainStore();
  const { history, record } = useCurrencyHistoryStore();
  const [localCode, setLocalCode] = useState<string>("");

  useEffect(() => {
    getLocalCurrencyCode().then(setLocalCode);
  }, []);

  const suggestedCodes = buildSuggestedCurrencyCodes(
    localCode,
    history,
    DEFAULT_SUGGESTED,
  );
  const suggestedCurrencies = buildSuggestions(allSupported, suggestedCodes);

  const handleSelect = (id: string) => {
    onChange(id);
    record(id);
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: colors.surface,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    padding: 6,
    minWidth: 220,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: 8,
    userSelect: "none",
  };

  const itemTitleStyle: React.CSSProperties = {
    color: colors.text,
    fontSize: 16,
    fontWeight: 400,
    whiteSpace: "nowrap",
  };

  const separatorStyle: React.CSSProperties = {
    height: 1,
    margin: "4px 0",
    backgroundColor: colors.border,
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Content sideOffset={6} style={contentStyle}>
        <DropdownMenu.Group>
          {suggestedCurrencies.map((currency) => (
            <DropdownMenu.Item
              key={currency.code}
              onSelect={() => handleSelect(currency.code)}
              textValue={optionTitle(currency)}
              style={itemStyle}
            >
              <DropdownMenu.ItemTitle>
                <span style={itemTitleStyle}>{optionTitle(currency)}</span>
              </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Group>
        <DropdownMenu.Separator style={separatorStyle} />
        <DropdownMenu.Group>
          <DropdownMenu.Item
            key="__more__"
            onSelect={onOpenFullSelector}
            textValue={t("common.more")}
            style={itemStyle}
          >
            <DropdownMenu.ItemTitle>
              <span style={itemTitleStyle}>{t("common.more")}</span>
            </DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
