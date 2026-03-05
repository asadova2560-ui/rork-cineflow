import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { SearchBar } from '@/components/SearchBar';
import { CategoryTabs } from '@/components/CategoryTabs';
import { MovieCard } from '@/components/MovieCard';
import { movies } from '@/mocks/movies';
import { MovieCategory } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.45;

const categoryTabs = [
  { id: 'barchasi', label: 'Barchasi' },
  { id: 'film', label: 'Film' },
  { id: 'serial', label: 'Serial' },
  { id: 'multfilm', label: 'Multfilm' },
  { id: 'multserial', label: 'Multserial' },
];

export default function CatalogScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<MovieCategory>('barchasi');

  const filteredMovies = useMemo(() => {
    let result = movies;
    if (activeCategory !== 'barchasi') {
      result = result.filter(m => m.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, search]);

  const handleCategoryChange = useCallback((tabId: string) => {
    setActiveCategory(tabId as MovieCategory);
  }, []);

  const renderItem = useCallback(({ item, index }: { item: typeof movies[0]; index: number }) => (
    <View style={[styles.gridItem, index % 2 === 0 ? styles.gridItemLeft : styles.gridItemRight]}>
      <MovieCard movie={item} width={CARD_WIDTH} height={CARD_HEIGHT} />
    </View>
  ), []);

  const ListHeader = useMemo(() => (
    <View>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        onFilterPress={() => {}}
      />
      <CategoryTabs
        tabs={categoryTabs}
        activeTab={activeCategory}
        onTabChange={handleCategoryChange}
      />
    </View>
  ), [search, activeCategory, handleCategoryChange]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={filteredMovies}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Hech narsa topilmadi</Text>
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
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  gridItem: {
    flex: 1,
    marginBottom: 16,
  },
  gridItemLeft: {
    marginRight: CARD_GAP / 2,
  },
  gridItemRight: {
    marginLeft: CARD_GAP / 2,
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
