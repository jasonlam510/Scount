import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks';

interface SummaryItem {
  label: string;
  amount: number | string;
  currency?: string;
  color?: string;
}

interface SummarySectionProps {
  items: SummaryItem[];
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  amountStyle?: StyleProp<TextStyle>;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  items,
  style,
  containerStyle,
  itemStyle,
  labelStyle,
  amountStyle,
}) => {
  const { colors } = useTheme();

  const formatAmount = (amount: number | string, currency?: string) => {
    if (typeof amount === 'number') {
      return `${currency || ''}${amount.toLocaleString()}`;
    }
    return amount;
  };

  return (
    <View style={[defaultStyles.container, containerStyle, style]}>
      {items.map((item, index) => (
        <View key={index} style={[defaultStyles.item, itemStyle]}>
          <Text style={[
            defaultStyles.label, 
            { color: colors.textSecondary },
            labelStyle
          ]}>
            {item.label}
          </Text>
          <Text style={[
            defaultStyles.amount, 
            { color: item.color || colors.text },
            amountStyle
          ]}>
            {formatAmount(item.amount, item.currency)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SummarySection; 