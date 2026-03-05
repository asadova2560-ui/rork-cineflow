import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { MovieCard } from '@/components/MovieCard';
import { SectionHeader } from '@/components/SectionHeader';
import { movies, genres } from '@/mocks/movies';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 32;
const BANNER_HEIGHT = 200;

const featuredMovies = movies.slice(0, 4);
const premieraMovies = movies.filter(m => m.year >= 2024);
const recommendedMovies = movies.filter(m => parseFloat(m.rating || '0') >= 7);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeBanner, setActiveBanner] = useState(0);
  const scrollRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner(prev => {
        const next = (prev + 1) % featuredMovies.length;
        scrollRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const renderBannerItem = useCallback(({ item }: { item: typeof featuredMovies[0] }) => (
    <Pressable
      onPress={() => router.push(`/movie/${item.id}`)}
      style={styles.bannerItem}
    >
      <Image
        source={{ uri: item.poster }}
        style={styles.bannerImage}
        contentFit="cover"
        transition={400}
      />
      <LinearGradient
        colors={['transparent', 'rgba(10,14,26,0.95)']}
        style={styles.bannerGradient}
      >
        <View style={styles.bannerInfo}>
          <View style={styles.bannerBadges}>
            {item.isFHD && (
              <View style={styles.fhdBadge}>
                <Text style={styles.badgeText}>FHD</Text>
              </View>
            )}
            {item.isFree && (
              <View style={styles.freeBadge}>
                <Text style={styles.badgeText}>Bepul</Text>
              </View>
            )}
          </View>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerMeta}>{item.year} · {item.genre}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  ), [router]);

  const renderGenreItem = useCallback(({ item }: { item: typeof genres[0] }) => (
    <Pressable style={styles.genreCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.genreImage}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.75)']}
        style={styles.genreGradient}
      >
        <Text style={styles.genreName}>{item.name}</Text>
      </LinearGradient>
    </Pressable>
  ), []);

  const renderMovieItem = useCallback(({ item }: { item: typeof movies[0] }) => (
    <View style={styles.movieItemWrapper}>
      <MovieCard movie={item} width={140} height={200} />
    </View>
  ), []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>▶</Text>
            </View>
            <Text style={styles.logoText}>FILM<Text style={styles.logoAccent}>BOX</Text></Text>
          </View>
          <Pressable style={styles.bellButton} hitSlop={8}>
            <Bell size={24} color={Colors.text} />
            <View style={styles.notifDot} />
          </Pressable>
        </View>

        <View style={styles.bannerSection}>
          <FlatList
            ref={scrollRef}
            data={featuredMovies}
            renderItem={renderBannerItem}
            keyExtractor={item => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
              setActiveBanner(index);
            }}
            getItemLayout={(_, index) => ({
              length: BANNER_WIDTH,
              offset: BANNER_WIDTH * index,
              index,
            })}
            contentContainerStyle={styles.bannerList}
          />
          <View style={styles.dots}>
            {featuredMovies.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, activeBanner === i && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        <SectionHeader title="PREMYERALAR" onSeeAll={() => {}} />
        <FlatList
          data={premieraMovies}
          renderItem={renderMovieItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        <SectionHeader title="Janrlar" onSeeAll={() => {}} />
        <FlatList
          data={genres}
          renderItem={renderGenreItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        <SectionHeader title="TAVSIYA ETILGAN" onSeeAll={() => {}} />
        <FlatList
          data={recommendedMovies}
          renderItem={renderMovieItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />

        <SectionHeader title="BARCHA FILMLAR" onSeeAll={() => {}} />
        <FlatList
          data={movies.slice(6)}
          renderItem={renderMovieItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800' as const,
  },
  logoText: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
  logoAccent: {
    color: Colors.accent,
  },
  bellButton: {
    position: 'relative',
    padding: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  bannerSection: {
    marginBottom: 8,
  },
  bannerList: {
    paddingHorizontal: 16,
  },
  bannerItem: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  bannerInfo: {},
  bannerBadges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  fhdBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  freeBadge: {
    backgroundColor: Colors.green,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  bannerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700' as const,
  },
  bannerMeta: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.textMuted,
  },
  activeDot: {
    backgroundColor: Colors.accent,
    width: 20,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  movieItemWrapper: {
    marginRight: 0,
  },
  genreCard: {
    width: 260,
    height: 150,
    borderRadius: 14,
    overflow: 'hidden',
  },
  genreImage: {
    width: '100%',
    height: '100%',
  },
  genreGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 14,
  },
  genreName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
