import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Movie } from '@/types';

interface MovieCardProps {
  movie: Movie;
  width?: number;
  height?: number;
  showInfo?: boolean;
}

function MovieCardInner({ movie, width = 165, height = 240, showInfo = true }: MovieCardProps) {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    router.push(`/movie/${movie.id}`);
  }, [router, movie.id]);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, { width }]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        testID={`movie-card-${movie.id}`}
      >
        <View style={[styles.posterContainer, { width, height }]}>
          <Image
            source={{ uri: movie.poster }}
            style={[styles.poster, { width, height }]}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.badgeContainer}>
            {movie.isFHD && (
              <View style={styles.fhdBadge}>
                <Text style={styles.fhdText}>FHD</Text>
              </View>
            )}
            {movie.isFree && (
              <View style={styles.freeBadge}>
                <Text style={styles.freeText}>Bepul</Text>
              </View>
            )}
          </View>
          {movie.isAdult && (
            <View style={styles.ageBadge}>
              <Text style={styles.ageText}>18+</Text>
            </View>
          )}
        </View>
        {showInfo && (
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
            <Text style={styles.meta}>{movie.year}. {movie.genre}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export const MovieCard = React.memo(MovieCardInner);

const styles = StyleSheet.create({
  posterContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.cardBackground,
  },
  poster: {
    borderRadius: 12,
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
  },
  fhdBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  fhdText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  freeBadge: {
    backgroundColor: Colors.green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  freeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  ageBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  ageText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600' as const,
  },
  info: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  title: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  meta: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
