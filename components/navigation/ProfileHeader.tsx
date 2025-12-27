//components/navigation/ProfileHeader.ts
import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { profileStyles as styles } from '@/components/navigation/styles/ProfileStyle';
import { ProfileTabKey } from '@/src/redux/persistTabProfile';

interface ProfileHeaderProps {
  userProfile: any;
  avatarUser: any;
  activeTab: ProfileTabKey;
  tabs: { key: ProfileTabKey; label: string }[];
  onTabPress: (key: ProfileTabKey) => void;
  t: (key: string) => string;
  // Novas props para a TopBar
  refreshing: boolean;
  onRefresh: () => void;
  openProfileModal: () => void;
}

const StatItem = ({ value, label }: { value: number; label: string }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value || 0}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  avatarUser,
  activeTab,
  tabs,
  onTabPress,
  t,
  refreshing,
  onRefresh,
  openProfileModal,
}) => {
  return (
    <View style={{ backgroundColor: '#191919' }}>
      {/* --- BARRA DE TOPO (Agora dentro do Header) --- */}
      <View style={styles.containerTopBar}>
        <Text style={styles.titleTopBar}>{t('screens.profileTitle')}</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={onRefresh} disabled={refreshing} style={styles.buttonTopBar}>
            {refreshing ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Ionicons name="refresh" size={25} color="#fff" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push('/notificationsScreens/notifications')} 
            style={styles.buttonTopBar}
          >
            <Ionicons name="notifications" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/searchScreens/searchProfile')} 
            style={styles.buttonTopBar}
          >
            <Ionicons name="search-outline" size={25} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={openProfileModal} style={styles.buttonTopBar}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- INFORMAÇÕES DE PERFIL --- */}
      <View style={styles.profileContainer}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.imageContainer}>
            <Image source={avatarUser} style={styles.profileImage} />
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userHandle}>{userProfile.username}</Text>
          <Text style={styles.userHandle}>{userProfile.bio}</Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsRow}>
          <StatItem value={userProfile.followingCount} label={t('stats.following')} />
          <StatItem value={userProfile.followersCount} label={t('stats.followers')} />
          <StatItem value={userProfile.singlesCount} label={t('stats.singles')} />
          <StatItem value={userProfile.epsCount} label={t('stats.eps')} />
          <StatItem value={userProfile.albumsCount} label={t('stats.albums')} />
        </View>
      </View>

      {/* --- BARRA DE ABAS --- */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, activeTab === tab.key && styles.activeTabButton]}
              onPress={() => onTabPress(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};