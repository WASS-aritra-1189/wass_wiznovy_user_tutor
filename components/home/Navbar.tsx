import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import MenuPage from '../../pages/MenuPage';
import { RootState } from '../../store/store';

interface NavbarProps {
  userGender?: string;
  userName?: string;
  navigation?: DrawerNavigationProp<any>;
  onMenuToggle?: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ userGender = 'Male', userName = 'User', navigation: navProp, onMenuToggle }) => {
  const defaultNavigation = useNavigation<DrawerNavigationProp<any>>();
  const navigation = navProp || defaultNavigation;
  const [menuVisible, setMenuVisible] = useState(false);
  const menuSlideAnim = useState(new Animated.Value(-320))[0];
  const { profile, loading } = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();

  const getGreeting = () => {
    if (loading) return 'Hello User';
    
    const apiName = profile?.userDetail?.name?.trim();
    const apiGender = profile?.userDetail?.gender;
    
    const displayName = apiName || userName;
    
    let prefix = '';
    if (apiGender === 'MALE' || apiGender === 'Male') {
      prefix = 'Mr. ';
    } else if (apiGender === 'FEMALE' || apiGender === 'Female') {
      prefix = 'Mrs. ';
    }
    
    return `Hello ${prefix}${displayName}`;
  };

  const openMenu = () => {
    setMenuVisible(true);
    onMenuToggle?.(true);
    menuSlideAnim.setValue(-320);
    Animated.timing(menuSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    onMenuToggle?.(false);
    Animated.timing(menuSlideAnim, {
      toValue: -320,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  return (
    <View style={[styles.navbar, { paddingTop: insets.top + 10 }]}>
      <View style={styles.leftSection}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={openMenu}
        >
          <View style={styles.hamburgerMenu}>
            <View style={styles.hamburgerLine} />
            <View style={[styles.hamburgerLine, styles.shortLine]} />
            <View style={[styles.hamburgerLine, styles.shortLine]} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.journeyText}>Let Go On the Learning Journey !</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={() => navigation.navigate('Notification')}
      >
        <Image 
          source={require('../../assets/notify.png')} 
          style={styles.notificationIcon}
          resizeMode="contain"
        />
        <View style={styles.notificationDot} />
      </TouchableOpacity>
      
      <Modal
        visible={menuVisible}
        animationType="none"
        transparent={true}
        statusBarTranslucent={true}
      >
        <View style={styles.menuModalOverlay}>
          <TouchableOpacity 
            style={styles.menuModalBackground}
            onPress={closeMenu}
            activeOpacity={1}
          />
          <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuSlideAnim }] }]}>
            <MenuPage 
              navigation={navigation as any} 
              onClose={closeMenu}
              state={{} as any}
              descriptors={{} as any}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  greetingContainer: {
    marginLeft: 15,
    marginTop: 8,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  journeyText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  notificationButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  notificationIcon: {
    width: 24,
    height: 24,
  },
  hamburgerMenu: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#16423C',
    borderRadius: 1,
  },
  shortLine: {
    width: '75%',
    alignSelf: 'flex-start',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0AAD2D',
  },
  menuModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuModalBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '20%',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 320,
  },
});

export default Navbar;