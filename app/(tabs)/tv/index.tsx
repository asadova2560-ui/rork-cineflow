import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { SearchBar } from '@/components/SearchBar';
import { CategoryTabs } from '@/components/CategoryTabs';
import { tvChannels } from '@/mocks/movies';
import { TVTab } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAP = 10;
const PADDING = 16;
const ITEM_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP * 2) / 3;

const tvTabs = [
  { id: 'barchasi', label: 'Barchasi' },
  { id: 'tavsiya', label: 'Tavsiya qilinganlar' },
  { id: 'saqlangan', label: 'Saqlanganlar' },
];

export default function TVScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TVTab>('barchasi');

  const filteredChannels = useMemo(() => {
    let result = tvChannels;
    if (activeTab === 'tavsiya') {
      result = result.filter(c => !c.isFree);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q));
    }
    return result;
  }, [activeTab, search]);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId as TVTab);
  }, []);

  const renderItem = useCallback(({ item }: { item: typeof tvChannels[0] }) => (
    <Pressable style={styles.channelCard}>
      <Image
        source={{ uri: item.logo }}
        style={styles.channelLogo}
        contentFit="cover"
        transition={200}
      />
      {item.isFree && (
        <View style={styles.freeBadge}>
          <Text style={styles.freeText}>Bepul</Text>
        </View>
      )}
      <Text style={styles.channelName} numberOfLines={1}>{item.name}</Text>
    </Pressable>
  ), []);

  const ListHeader = useMemo(() => (
    <View>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Qidirish"
        showFilter={true}
        onFilterPress={() => {}}
      />
      <CategoryTabs
        tabs={tvTabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </View>
  ), [search, activeTab, handleTabChange]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={filteredChannels}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Kanallar topilmadi</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: PADDING,
  },
  row: {
    gap: GAP,
    marginBottom: GAP,
  },
  channelCard: {
    width: ITEM_WIDTH,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  channelLogo: {
    width: '70%',
    height: '70%',
    borderRadius: 8,
  },
  channelName: {
    position: 'absolute',
    bottom: 6,
    left: 4,
    right: 4,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '600' as const,
    color: '#333',
  },
  freeBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700' as const,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
