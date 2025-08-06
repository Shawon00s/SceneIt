import React, { memo } from 'react'
import { Text, View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '../../store/authStore'
import { useRouter } from 'expo-router'
import { images } from '../../constants/images'
import styles from '../../assets/styles/profile.styles'

const Profile = memo(() => {
  const { user, logout } = useAuthStore() as {
    user: any;
    logout: () => Promise<void>;
  };
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)');
          }
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={images.bg}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        resizeMode="cover"
      />
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 40,
            paddingHorizontal: 16
          }}
        >
          {/* Profile Header - Larger Card */}
          <View style={[styles.profileHeader, {
            minHeight: 400,
            paddingVertical: 40,
            paddingHorizontal: 24,
            marginBottom: 30,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 350
          }]}>
            {/* Profile Image - Larger */}
            <Image
              source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${user?.username || 'default'}&size=160` }}
              style={[styles.profileImage, {
                width: 120,
                height: 120,
                borderRadius: 60,
                marginBottom: 24,
                marginRight: 0
              }]}
              resizeMode="cover"
              onError={(error) => {
                console.log('Profile image error:', error);
              }}
              onLoad={() => {
                console.log('Profile image loaded successfully');
              }}
            />
            {/* Profile Info - Centered */}
            <View style={[styles.profileInfo, { alignItems: 'center', flex: 0 }]}>
              <Text style={[styles.username, {
                fontSize: 28,
                marginBottom: 8,
                textAlign: 'center'
              }]}>
                <Text>
                  Username: {user?.username || 'Not available'}
                </Text>
              </Text>
              <Text style={[styles.email, {
                fontSize: 16,
                marginBottom: 8,
                textAlign: 'center'
              }]}>
                <Text>
                  Email: {user?.email || 'Not available'}
                </Text>
              </Text>
              <Text style={[styles.memberSince, {
                fontSize: 14,
                textAlign: 'center'
              }]}>
                Member since {new Date().getFullYear()}
              </Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={[styles.logoutButton, {
              marginHorizontal: 16,
              width: '100%',
              maxWidth: 350
            }]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  )
})

Profile.displayName = 'Profile';

export default Profile