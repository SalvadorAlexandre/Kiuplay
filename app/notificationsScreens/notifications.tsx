//app/notificationsScreens/Notifications
import React, { useEffect } from 'react'
import { Stack } from 'expo-router';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/redux/store';
import { markAsRead, setNotifications } from '@/src/redux/notificationsSlice';
import { Notification } from '@/src/types/contentType';
import { useRouter } from 'expo-router';
import { MOCKED_NOTIFICATIONS } from '@/src/types/contentServer'




export default function NotificationScreen() {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.items);

  const unread = notifications.filter(n => !n.isRead);
  const read = notifications.filter(n => n.isRead);

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  useEffect(() => {
    dispatch(setNotifications(MOCKED_NOTIFICATIONS));
  }, [dispatch]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notificações',
          headerStyle: { backgroundColor: '#191919' },
          headerTintColor: '#fff',
          headerShown: true,
        }}
      />
      <View style={{ flex: 1, backgroundColor: '#191919' }}>
        <ScrollView
          horizontal={false}
          style={styles.scroll}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>🔔 Não vistas</Text>
          {unread.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma notificação nova</Text>
          ) : (
            unread.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={() => handleMarkAsRead(notification.id)}
              />
            ))
          )}

          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>📁 Vistas</Text>
          {read.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma notificação lida</Text>
          ) : (
            read.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </ScrollView>
      </View>
    </>
  );
}

function NotificationCard({
  notification,
  onPress,
}: {
  notification: Notification;
  onPress?: () => void;
}) {
  const router = useRouter();

  const handleNavigate = () => {
    if (!notification.contentType || !notification.contentId) return;

    const routeMap = {
      freebeat: '/contentCardBeatStoreScreens/freeBeat-details/[id]' as const,
      exclusive_beat: '/contentCardBeatStoreScreens/exclusiveBeat-details/[id]' as const,
      single: '/contentCardLibraryScreens/single-details/[id]' as const,
      ep: '/contentCardLibraryScreens/ep-details/[id]' as const,
      album: '/contentCardLibraryScreens/album-details/[id]' as const,
      artist: '/contentCardLibraryScreens/artist-profile/[id]' as const,
      promotion: '/profileScreens/usePostPromoteScreen' as const,
      message: '/ChatDetail/[id]' as const,
    };

    const pathname = routeMap[notification.contentType];

    if (pathname) {
      router.push({
        pathname,
        params: { id: notification.contentId },
      });
    }

    if (onPress) onPress();
  };



  const getIcon = () => {
    switch (notification.type) {
      case 'upload': return '🎵';
      case 'promotion': return '📢';
      case 'message': return '💬';
      case 'friend_request': return '🤝';
      case 'purchase': return '🛒';
      default: return '🔔';
    }
  };

  return (
    <TouchableOpacity
      onPress={handleNavigate}
      style={[
        styles.card,
        !notification.isRead && styles.unreadCard,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {notification.avatarUrl && (
          <Image
            source={{ uri: notification.avatarUrl }}
            style={styles.avatar}
          />
        )}
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.cardTitle}>
            {getIcon()} {notification.title}
          </Text>
          <Text style={styles.cardMessage}>{notification.message}</Text>
          <Text style={styles.cardTimestamp}>
            {new Date(notification.timestamp).toLocaleString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#191919',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 15,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  unreadCard: {
    borderColor: '#00ff99',
    borderWidth: 1,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardMessage: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  cardTimestamp: {
    color: '#777',
    fontSize: 12,
    marginTop: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
  },
});