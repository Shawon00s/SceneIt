import React, { memo } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = memo(() => {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-1 justify-center items-center px-5">
        <Text className="text-4xl text-white font-bold mb-4">Profile</Text>
        <Text className="text-light-300 text-center text-lg">
          Profile screen coming soon!{'\n'}This will include user settings, preferences, and account management.
        </Text>
      </View>
    </SafeAreaView>
  )
})

Profile.displayName = 'Profile';

export default Profile