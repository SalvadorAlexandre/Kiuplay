// app/detailsLibraryScreens/artist-profile/[id].tsx

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/src/redux/hooks';
import { addFollowedArtist, removeFollowedArtist } from '@/src/redux/followedArtistsSlice';
import { getLibraryContentDetails } from '@/src/api/feedApi';
import { SingleCard, AlbumCard, EpCard, ExclusiveBeatCard, FreeBeatCard } from '@/components/cardsItems';
import { ArtistProfile, Single, Album, ExtendedPlayEP, ExclusiveBeat, FreeBeat } from '@/src/types/contentType';
import { useTranslation } from '@/src/translations/useTranslation';
import { ArtistStyles as styles } from '@/components/navigation/styles/artistProfileStyles';
import { ArtistHeader } from '@/components/navigation/artistHeader';

export default function ArtistProfileScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isConnected = useAppSelector((state) => state.network.isConnected);
  const followedArtists = useAppSelector((state) => state.followedArtists.artists);

  const [currentArtist, setCurrentArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const tabs = useMemo(() => [
    t('artistProfile.tabs.single'),
    t('artistProfile.tabs.ep'),
    t('artistProfile.tabs.album'),
    t('artistProfile.tabs.freeBeats'),
    t('artistProfile.tabs.exclusiveBeats'),
  ], [t]);

  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    async function fetchArtist() {
      if (!id) return;
      const result = await getLibraryContentDetails(id as string);
      if (result.success) setCurrentArtist(result.data as ArtistProfile);
      setLoading(false);
    }
    fetchArtist();
  }, [id]);

  const isFollowing = useMemo(() =>
    currentArtist ? followedArtists.some(a => a.id === currentArtist.id) : false,
    [followedArtists, currentArtist]);

  const handleToggleFollow = useCallback(() => {
    if (!currentArtist) return;
    if (isFollowing) {
      dispatch(removeFollowedArtist(currentArtist.id));
    } else {
      dispatch(addFollowedArtist({ id: currentArtist.id, name: currentArtist.name, profileImageUrl: currentArtist.avatar }));
    }
  }, [dispatch, currentArtist, isFollowing]);

  const activeData = useMemo(() => {
    if (!currentArtist) return [];
    if (activeTab === tabs[0]) return currentArtist.singles || [];
    if (activeTab === tabs[1]) return currentArtist.eps || [];
    if (activeTab === tabs[2]) return currentArtist.albums || [];
    if (activeTab === tabs[3]) return currentArtist.freeBeats || [];
    if (activeTab === tabs[4]) return currentArtist.exclusiveBeats || [];
    return [];
  }, [activeTab, currentArtist, tabs]);

  const renderItem = ({ item }: { item: any }) => {
    const commonProps = { item, onPress: (selected: any) => { } };

    if (activeTab === tabs[0]) return <SingleCard {
      ...commonProps} onPress={(s) => router.push(`/detailsLibraryScreens/single-details/${s.id}`)} />;
    if (activeTab === tabs[1]) return <EpCard {
      ...commonProps} onPress={(s) => router.push(`/detailsLibraryScreens/ep-details/${s.id}`)} />;
    if (activeTab === tabs[2]) return <AlbumCard {
      ...commonProps} onPress={(s) => router.push(`/detailsLibraryScreens/album-details/${s.id}`)} />;
    if (activeTab === tabs[3]) return <FreeBeatCard {
      ...commonProps} onPress={(s) => router.push(`/detailsBeatStoreScreens/freeBeat-details/${s.id}`)} />;
    if (activeTab === tabs[4]) return <ExclusiveBeatCard {
      ...commonProps} onPress={(s) => router.push(`/detailsBeatStoreScreens/exclusiveBeat-details/${s.id}`)} />;
    return null;
  };

  //const getDynamicUserAvatar = useMemo(() => {
  // if (!isConnected || !currentArtist?.avatar?.trim()) {
  //   return require('@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png');
  // }
  // return { uri: currentArtist.avatar };
  //}, [isConnected, currentArtist?.avatar]);

  const getDynamicUserAvatar = () => {
    if (!isConnected || !currentArtist?.avatar?.trim()) {
      return require('@/assets/images/Default_Profile_Icon/icon_profile_white_120px.png');
    }
    return { uri: currentArtist.avatar };
  };

  const artistAvatarSrc = getDynamicUserAvatar();


  if (loading) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: '#000' }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        data={activeData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={renderItem}
        ListHeaderComponent={
          <ArtistHeader
            artist={currentArtist!}
            artistAvatarSrc={artistAvatarSrc}
            isFollowing={isFollowing}
            onFollowPress={handleToggleFollow}
            onBack={() => router.back()}
            tabs={tabs}
            activeTab={activeTab}
            onTabPress={setActiveTab}
            t={t}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.texto}>{t('artistProfile.empty.content')}</Text>
          </View>
        }
      />
    </View>
  );
}