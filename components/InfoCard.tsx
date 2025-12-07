import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import Button from './Button';

interface InfoCardProps {
  image: any;
  title: string;
  description: string;
  buttonTitle: string;
  onButtonPress: () => void;
  buttonColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  image,
  title,
  description,
  buttonTitle,
  onButtonPress,
  buttonColor = '#0AAD2D',
}) => {
  return (
    <View style={styles.card}>
      <Image 
        source={image} 
        style={styles.cardImage}
        resizeMode="contain"
      />
      <Text style={styles.cardTitle}>
        {title}
      </Text>
      <Text style={styles.cardDescription}>
        {description}
      </Text>
      <Button
        title={buttonTitle}
        onPress={onButtonPress}
        variant="primary"
        style={{
          ...styles.cardButton,
          backgroundColor: buttonColor,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: 388,
    height: 453,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardImage: {
    width: 190,
    height: 190,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01004C',
    textAlign: 'center',
    marginBottom: 15,
  },
  cardDescription: {
    fontSize: 16,
    color: '#01004C',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  cardButton: {
    backgroundColor: '#0AAD2D',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 200,
  },
});

export default InfoCard;