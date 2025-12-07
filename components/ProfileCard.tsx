import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface ProfileCardProps {
  iconSource: any;
  text: string;
  onPress?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  iconSource,
  text,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.profileCard} onPress={onPress}>
      <View style={styles.cardIconContainer}>
        <Image source={iconSource} style={styles.cardIcon} />
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    width: 114,
    height: 162,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    opacity: 1,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardIconContainer: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  cardIcon: {
    width: 60,
    height: 60,
  },
  cardTextContainer: {
    height: 52,
    backgroundColor: '#C4DAD2',
    paddingVertical: 12,
    paddingHorizontal: 5,
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#000',
  },
  cardText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
});

export default ProfileCard;