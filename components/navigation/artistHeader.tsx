import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ArtistStyles as styles } from '@/components/navigation';
import { ArtistProfile } from '@/src/types/contentType';

interface ProfileHeaderProps {
  artist: ArtistProfile;
  artistAvatarSrc: any;
  isFollowing: boolean;
  onFollowPress: () => void;
  onBack: () => void;
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
  t: any;
}

export const ArtistHeader = ({
  artist, artistAvatarSrc, isFollowing, onFollowPress, onBack, tabs, activeTab, onTabPress, t
}: ProfileHeaderProps) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <Image source={artistAvatarSrc} style={styles.artistAvatar} />
      <Text style={styles.artistNameProfile}>{artist.name}</Text>
      <Text style={styles.artistUserName}>{artist.username}</Text>

      <Text style={styles.artistGenres}>
        {t('artistProfile.genreLine', {
          category: artist.category || '',
          genres: artist.genres?.join(', ') || '',
          year: artist.releaseYear || ''
        })}
      </Text>

      <Text style={styles.artistFollowers}>
        {t('artistProfile.followersLine', {
          followers: artist.followersCount ?? 0,
          following: artist.followingCount ?? 0
        })}
      </Text>

      <TouchableOpacity
        style={[styles.buttonFollowers, isFollowing ? styles.buttonFollowing : styles.buttonFollow]}
        onPress={onFollowPress}
      >
        <Text style={styles.buttonText}>
          {isFollowing ? t('artistProfile.following') : t('artistProfile.follow')}
        </Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => onTabPress(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};