import React, { useMemo, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Heart, Play, Star, Clock, Calendar, Share2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFavorites } from '@/providers/FavoritesProvider';
import { movies } from '@/mocks/movies';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const heartScale = useRef(new Animated.Value(1)).current;

  const movie = useMemo(() => movies.find(m => m.id === id), [id]);

  const handleFavorite = useCallback(() => {
    if (!movie) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    toggleFavorite(movie.id);
  }, [movie, toggleFavorite, heartScale]);

  if (!movie) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Film topilmadi</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Orqaga</Text>
        </Pressable>
      </View>
    );
  }

  const saved = isFavorite(movie.id);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.posterSection}>
          <Image
            source={{ uri: movie.poster }}
            style={styles.posterImage}
            contentFit="cover"
            transition={400}
          />
          <LinearGradient
            colors={['rgba(10,14,26,0.3)', 'rgba(10,14,26,0.7)', Colors.background]}
            style={styles.posterGradient}
          />
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <Pressable onPress={() => router.back()} style={styles.iconButton} hitSlop={12}>
              <ArrowLeft size={24} color="#FFF" />
            </Pressable>
            <View style={styles.topBarRight}>
              <Pressable onPress={() => {}} style={styles.iconButton} hitSlop={12}>
                <Share2 size={22} color="#FFF" />
              </Pressable>
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Pressable onPress={handleFavorite} style={styles.iconButton} hitSlop={12}>
                  <Heart
                    size={22}
                    color={saved ? Colors.accent : '#FFF'}
                    fill={saved ? Colors.accent : 'none'}
                  />
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.badges}>
            {movie.isFHD && (
              <View style={styles.fhdBadge}>
                <Text style={styles.badgeText}>FHD</Text>
              </View>
            )}
            {movie.isFree && (
              <View style={styles.freeBadge}>
                <Text style={styles.badgeText}>Bepul</Text>
              </View>
            )}
            {movie.isAdult && (
              <View style={styles.ageBadge}>
                <Text style={styles.badgeText}>18+</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{movie.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{movie.year}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{movie.genre}</Text>
            </View>
            {movie.duration && (
              <>
                <View style={styles.metaDot} />
                <View style={styles.metaItem}>
                  <Clock size={14} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{movie.duration}</Text>
                </View>
              </>
            )}
          </View>

          {movie.rating && (
            <View style={styles.ratingRow}>
              <Star size={18} color={Colors.yellow} fill={Colors.yellow} />
              <Text style={styles.ratingText}>{movie.rating}</Text>
              <Text style={styles.ratingMax}>/10</Text>
            </View>
          )}

          <Pressable style={styles.playButton}>
            <Play size={22} color="#FFF" fill="#FFF" />
            <Text style={styles.playButtonText}>Ko'rish</Text>
          </Pressable>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionLabel}>Tavsif</Text>
            <Text style={styles.descriptionText}>{movie.description}</Text>
          </View>

          {movie.episodes && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Qismlar soni</Text>
              <Text style={styles.infoValue}>{movie.episodes} ta qism</Text>
            </View>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Kategoriya</Text>
            <Text style={styles.infoValue}>
              {movie.category === 'film' ? 'Film' :
               movie.category === 'serial' ? 'Serial' :
               movie.category === 'multfilm' ? 'Multfilm' : 'Multserial'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.textSecondary,
    fontSize: 18,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  posterSection: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
    position: 'relative',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  posterGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    paddingHorizontal: 16,
    marginTop: -40,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  fhdBadge: {
    backgroundColor: Colors.badge.fhd,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  freeBadge: {
    backgroundColor: Colors.badge.free,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ageBadge: {
    backgroundColor: Colors.badge.age,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '800' as const,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },
  ratingText: {
    color: Colors.yellow,
    fontSize: 18,
    fontWeight: '700' as const,
  },
  ratingMax: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  playButton: {
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 24,
  },
  playButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  descriptionText: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
