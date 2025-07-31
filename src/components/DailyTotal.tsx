import React from 'react';
import { Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface DailyTotalProps {
  total: number;
  currency?: string;
  style?: StyleProp<TextStyle>;
}

const DailyTotal: React.FC<DailyTotalProps> = ({ 
  total, 
  currency = 'HK$', 
  style 
}) => {
  const { colors } = useTheme();

  const totalColor = total > 0 ? colors.success : 
                    total < 0 ? colors.danger : 
                    colors.text;

  return (
    <Text style={[defaultStyles.dailyTotal, { color: totalColor }, style]}>
      {total > 0 ? '+' : ''}{currency}{Math.abs(total).toFixed(2)}
    </Text>
  );
};

const defaultStyles = StyleSheet.create({
  dailyTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DailyTotal; 