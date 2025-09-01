import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks';
import { Group } from '../../../types/groups';
import * as ContextMenu from 'zeego/context-menu';

interface GroupCardProps {
  group: Group;
  onPress?: (group: Group) => void; // Optional - for custom navigation
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onPress,
}) => {
  const { colors } = useTheme();

  // Internal action handlers
  const handleAddExpense = () => {
    // TODO: Navigate to add expense screen or open modal
    // navigation.navigate('AddExpense', { groupId: group.id });
  };



  const handleDelete = () => {
    // TODO: Call API to delete group
    console.log(`delete group: ${group.title}`);
  };

  const handleCardPress = () => {
    console.log('Card pressed - short tap detected');
    if (onPress) {
      onPress(group);
    } else {
      // Default behavior - show group info
      console.log('Group Info:', `${group.title} - ${group.currency}`);
    }
  };

  const handleLongPress = () => {
    console.log('Long press detected on GroupCard!');
    // This should trigger the Zeego context menu
  };

  return (
    <View style={styles.container}>
      {/* Context Menu Wrapper */}
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          {/* Main Group Card */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={handleCardPress}
            onLongPress={handleLongPress}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Text style={styles.iconText}>
                  {group.icon}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.groupTitle, { color: colors.text }]}>
                  {group.title}
                </Text>
                <Text style={[styles.groupCurrency, { color: colors.textSecondary }]}>
                  {group.currency}
                </Text>
              </View>
              <View style={styles.cardActions}>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </View>
            </View>
            
            
          </TouchableOpacity>
        </ContextMenu.Trigger>

        {/* Context Menu Content */}
        <ContextMenu.Content 
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            padding: 8,
            minWidth: 250,
            maxWidth: 300,
            width: 'fit-content',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <ContextMenu.Item 
            key="add-expense" 
            onSelect={handleAddExpense}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: 'none',
              width: '100%',
              minWidth: 220,
              boxSizing: 'border-box',
              textAlign: 'left',
            }}
          >
            <ContextMenu.ItemTitle 
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '500',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                flex: 1,
                marginRight: 12,
              }}
            >
              Add Expense
            </ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon 
              ios={{
                name: 'plus',
                pointSize: 16,
                weight: 'medium',
                scale: 'medium',
              }}
            >
              <Ionicons name="add" size={20} color={colors.text} />
            </ContextMenu.ItemIcon>
          </ContextMenu.Item>
          

          
          <ContextMenu.Item 
            key="delete" 
            onSelect={handleDelete} 
            destructive
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              border: 'none',
              width: '100%',
              minWidth: 220,
              boxSizing: 'border-box',
              textAlign: 'left',
            }}
          >
            <ContextMenu.ItemTitle
              style={{
                color: colors.danger,
                fontSize: 16,
                fontWeight: '500',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                flex: 1,
                marginRight: 12,
              }}
            >
              Delete
            </ContextMenu.ItemTitle>
            <ContextMenu.ItemIcon 
              ios={{
                name: 'trash',
                pointSize: 16,
                weight: 'medium',
                scale: 'medium',
                hierarchicalColor: 'red',
              }}
            >
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </ContextMenu.ItemIcon>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  groupCurrency: {
    fontSize: 14,
  },
  cardActions: {
    marginLeft: 'auto',
  },

  // Web-specific context menu styles
  webMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  webMenuItemText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default GroupCard;
