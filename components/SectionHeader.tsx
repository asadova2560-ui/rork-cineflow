import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

function SectionHeaderInner({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} style={styles.seeAllButton} hitSlop={8}>
          <ChevronRight size={22} color={Colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

export const SectionHeader = React.memo(SectionHeaderInner);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  seeAllButton: {
    padding: 4,
  },
});
