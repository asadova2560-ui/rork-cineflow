import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';

const FAVORITES_KEY = 'filmbox_favorites';

export const [FavoritesProvider, useFavorites] = createContextHook(() => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) as string[] : [];
    },
  });

  const syncMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  useEffect(() => {
    if (favoritesQuery.data) {
      setFavoriteIds(favoritesQuery.data);
    }
  }, [favoritesQuery.data]);

  const toggleFavorite = useCallback((movieId: string) => {
    setFavoriteIds(prev => {
      const updated = prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId];
      syncMutation.mutate(updated);
      return updated;
    });
  }, [syncMutation]);

  const isFavorite = useCallback((movieId: string) => {
    return favoriteIds.includes(movieId);
  }, [favoriteIds]);

  return useMemo(() => ({
    favoriteIds,
    toggleFavorite,
    isFavorite,
    isLoading: favoritesQuery.isLoading,
  }), [favoriteIds, toggleFavorite, isFavorite, favoritesQuery.isLoading]);
});
