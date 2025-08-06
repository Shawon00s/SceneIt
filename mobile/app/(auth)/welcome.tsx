import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { icons } from "../../constants/icons";
import { images } from "../../constants/images";
import COLORS from "../../constants/colors";

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Background Image */}
      <Image source={images.bg} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" />
      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        {/* Logo */}
        <Image source={icons.logo} style={{ width: 80, height: 65, marginBottom: 30 }} resizeMode="contain" />
        
        {/* Title */}
        <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 10 }}>
          Welcome to SceneIt
        </Text>
        
        {/* Subtitle */}
        <Text style={{ fontSize: 18, color: '#ccc', textAlign: 'center', marginBottom: 50 }}>
          Discover your next favorite movie 🎬
        </Text>
        
        {/* Buttons */}
        <View style={{ width: '100%', gap: 15 }}>
          <TouchableOpacity 
            style={{ 
              backgroundColor: COLORS.primary, 
              padding: 15, 
              borderRadius: 12, 
              alignItems: 'center' 
            }}
            onPress={() => router.push('/(auth)')}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Sign In
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ 
              backgroundColor: 'transparent', 
              padding: 15, 
              borderRadius: 12, 
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.primary
            }}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={{ color: COLORS.primary, fontSize: 16, fontWeight: '600' }}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}