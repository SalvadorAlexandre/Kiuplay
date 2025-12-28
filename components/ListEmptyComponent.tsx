import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search-outline',
  message,
  onRetry,
  retryLabel = 'Retry',
}) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={icon}
        size={64}
        color="rgba(255, 255, 255, 0.3)"
      />

      <Text style={styles.emptyText}>
        {message}
      </Text>

      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Ionicons
            name="refresh"
            size={18}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.retryButtonText}>
            {retryLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    marginTop: 120,
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 24,
    lineHeight: 22,
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});