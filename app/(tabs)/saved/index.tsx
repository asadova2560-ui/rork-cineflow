import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { MovieCard } from '@/components/MovieCard';
import { useFavorites } from '@/providers/FavoritesProvider';
import { movies } from '@/mocks/movies';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.45;

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { favoriteIds } = useFavorites();

  const savedMovies = useMemo(() => {
    return movies.filter(m => favoriteIds.includes(m.id));
  }, [favoriteIds]);

  const renderItem = useCallback(({ item, index }: { item: typeof movies[0]; index: number }) => (
    <View style={[styles.gridItem, index % 2 === 0 ? styles.gridItemLeft : styles.gridItemRight]}>
      <MovieCard movie={item} width={CARD_WIDTH} height={CARD_HEIGHT} />
    </View>
  ), []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saqlanganlar</Text>
      </View>

      <FlatList
        data={savedMovies}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Heart size={48} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Saqlanganlar bo'sh</Text>
            <Text style={styles.emptyText}>
              Sevimli filmlaringizni saqlang va{'\n'}ularni bu yerda toping
            </Text>
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '700' as const,
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 20,
    flexGrow: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
