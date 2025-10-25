import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useTheme } from '@/hooks';

interface SegmentedControlProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

const SegmentedControlComponent: React.FC<SegmentedControlProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <SegmentedControl
      values={tabs}
      selectedIndex={activeTab}
      onChange={(event) => onTabChange(event.nativeEvent.selectedSegmentIndex)}
      style={[defaultStyles.segmentedControl, style]}
      appearance={colors.text === '#ffffff' ? 'dark' : 'light'}
    />
  );
};

const defaultStyles = {
  segmentedControl: {
    height: 32,
    marginHorizontal: 0,
  },
};

export default SegmentedControlComponent; 