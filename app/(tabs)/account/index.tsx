import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CreditCard, Gift, History, Eye, Smartphone, Settings, HelpCircle, LogOut, ChevronRight, RefreshCw, User
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { userProfile } from '@/mocks/movies';

interface MenuItemData {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

function MenuItem({ icon, label, onPress }: MenuItemData) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={styles.menuItem}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.menuIcon}>{icon}</View>
        <Text style={styles.menuLabel}>{label}</Text>
        <ChevronRight size={20} color={Colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

export default function AccountScreen() {
  const insets = useSafeAreaInsets();

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Chiqish',
      'Haqiqatan ham chiqmoqchimisiz?',
      [
        { text: "Yo'q", style: 'cancel' },
        { text: 'Ha', style: 'destructive', onPress: () => console.log('Logged out') },
      ]
    );
  }, []);

  const menuItems: MenuItemData[] = [
    { icon: <CreditCard size={22} color={Colors.textSecondary} />, label: 'Obunalar', onPress: () => {} },
    { icon: <CreditCard size={22} color={Colors.textSecondary} />, label: "Hisobni to'ldirish", onPress: () => {} },
    { icon: <Gift size={22} color={Colors.textSecondary} />, label: 'Promokodlar', onPress: () => {} },
    { icon: <History size={22} color={Colors.textSecondary} />, label: "To'lov va xaridlar tarixi", onPress: () => {} },
    { icon: <Eye size={22} color={Colors.textSecondary} />, label: "Men ko'rayotganlar", onPress: () => {} },
    { icon: <Smartphone size={22} color={Colors.textSecondary} />, label: 'Qurilmalar', onPress: () => {} },
    { icon: <Settings size={22} color={Colors.textSecondary} />, label: 'Sozlamalar', onPress: () => {} },
    { icon: <HelpCircle size={22} color={Colors.textSecondary} />, label: 'Biz haqimizda', onPress: () => {} },
  ];

  return (
    <View style={[styles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <LinearGradient
          colors={[Colors.cardBackgroundLight, Colors.background]}
          style={[styles.profileSection, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <User size={40} color={Colors.textSecondary} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.idRow}>
                <Text style={styles.idLabel}>ID: </Text>
                <Text style={styles.idValue}>{userProfile.id}</Text>
              </View>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Balans: </Text>
                <Text style={styles.balanceValue}>{userProfile.balance.toLocaleString()}</Text>
                <Pressable style={styles.refreshBtn} hitSlop={8}>
                  <RefreshCw size={14} color={Colors.textSecondary} />
                </Pressable>
              </View>
              <View style={styles.subRow}>
                <Text style={styles.subLabel}>Obuna: </Text>
                <Text style={styles.subValue}>
                  {userProfile.isSubscribed ? 'Mavjud' : "Yo'q"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.subscriptionCard}>
            <Text style={styles.subCardLabel}>Obuna muddati:</Text>
            <View style={styles.subCardRow}>
              <Text style={styles.subCardPlan}>{userProfile.subscription}</Text>
              <Text style={styles.subCardExpiry}>{userProfile.subscriptionExpiry} gacha</Text>
            </View>
          </View>

          <View style={styles.profilesRow}>
            <View style={styles.profileItem}>
              <View style={[styles.profileAvatar, { backgroundColor: '#2A2F48' }]}>
                <User size={24} color={Colors.textSecondary} />
              </View>
              <Text style={styles.profileName}>Asosiy</Text>
              <Text style={styles.profileId}>ID: {userProfile.id}</Text>
            </View>
            <View style={styles.profileItem}>
              <View style={[styles.profileAvatar, { backgroundColor: Colors.accent + '30' }]}>
                <User size={24} color={Colors.accent} />
              </View>
              <Text style={styles.profileName}>Bolalar</Text>
              <Text style={styles.profileId}>ID: {userProfile.id}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <MenuItem key={idx} {...item} />
          ))}
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.text} />
          <Text style={styles.logoutText}>Chiqish</Text>
        </Pressable>

        <Text style={styles.versionText}>Versiya: 2.4.10</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  idValue: {
    color: Colors.green,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  balanceLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  balanceValue: {
    color: Colors.green,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  refreshBtn: {
    marginLeft: 8,
    padding: 2,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  subLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  subValue: {
    color: Colors.green,
    fontSize: 14,
    fontWeight: '700' as const,
  },
  subscriptionCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  subCardLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 6,
  },
  subCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subCardPlan: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  subCardExpiry: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  profilesRow: {
    flexDirection: 'row',
    gap: 20,
  },
  profileItem: {
    alignItems: 'center',
    gap: 4,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  profileId: {
    color: Colors.textSecondary,
    fontSize: 11,
  },
  menuSection: {
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  menuIcon: {
    width: 28,
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    fontWeight: '500' as const,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
    gap: 10,
  },
  logoutText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  versionText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
