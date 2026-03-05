import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

interface Tab {
  id: string;
  label: string;
}

interface CategoryTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

function CategoryTabsInner({ tabs, activeTab, onTabChange }: CategoryTabsProps) {
  const handlePress = useCallback((tabId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabChange(tabId);
  }, [onTabChange]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => handlePress(tab.id)}
          testID={`tab-${tab.id}`}
        >
          <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
            {tab.label}
          </Text>
          {activeTab === tab.id && <View style={styles.indicator} />}
        </Pressable>
      ))}
    </ScrollView>
  );
}

export const CategoryTabs = React.memo(CategoryTabsInner);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 4,
    paddingBottom: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {},
  tabText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  activeTabText: {
    color: Colors.text,
    fontWeight: '600' as const,
  },
  indicator: {
    height: 3,
    backgroundColor: Colors.accent,
    borderRadius: 2,
    width: '100%',
    marginTop: 6,
  },
});
