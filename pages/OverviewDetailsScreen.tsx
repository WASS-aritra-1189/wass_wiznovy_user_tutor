import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

interface OverviewDetailsScreenProps {
  onBack?: () => void;
  onContinueToApp?: () => void;
  navigation?: any;
}

const OverviewDetailsScreen: React.FC<OverviewDetailsScreenProps> = ({
  onBack,
  onContinueToApp,
  navigation,
}) => {
  const overviewCards = [
    {
      id: 1,
      image: require('../assets/overview personal details.png'),
      text: 'Personal Details',
      step: 1,
    },
    {
      id: 2,
      image: require('../assets/overview primary goal.png'),
      text: 'Primary Goal',
      step: 3,
    },
    {
      id: 3,
      image: require('../assets/overview tutor details.png'),
      text: 'Tutor Details',
      step: 4,
    },
    {
      id: 4,
      image: require('../assets/overview educational details.png'),
      text: 'Educational Details',
      step: 5,
    },
    {
      id: 5,
      image: require('../assets/overview language pref.png'),
      text: 'Language Preference',
      step: 7,
    },
    {
      id: 6,
      image: require('../assets/overview profile details.png'),
      text: 'Profile Details',
      step: 9,
    },
  ];

  const handleCardPress = (step: number) => {
    navigation?.navigate('Onboarding', { initialStep: step });
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack || (() => {})} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backText}>Overview Details</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cards Grid */}
        <View style={styles.cardsContainer}>
          {overviewCards.map((card, index) => (
            <View key={card.id} style={styles.cardWrapper}>
              <TouchableOpacity 
                style={styles.card}
                onPress={() => handleCardPress(card.step)}
              >
                {(index === 0 || index === 1) && (
                  <View style={styles.tickButton}>
                    <MaterialIcons name="check" size={12} color="#FFFFFF" />
                  </View>
                )}
                <Image 
                  source={card.image} 
                  style={styles.cardImage}
                  resizeMode="contain"
                />
                <Text style={styles.cardText}>{card.text}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Terms Text */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Please read the terms carefully before accepting. Review the permissions requested by the app (e.g., data access) and proceed only if you are comfortable with them.
          </Text>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Continue to App"
            onPress={onContinueToApp || (() => {})}
            variant="primary"
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
      </SafeAreaView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 4,
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 30,
    justifyContent: 'center',
    gap: 10,
  },
  cardWrapper: {
    marginBottom: 20,
    marginHorizontal: 5,
  },
  card: {
    width: 166,
    height: 176,
    backgroundColor: '#F8F9FA',
    borderRadius: 4,
    paddingTop: 17,
    paddingRight: 22,
    paddingBottom: 17,
    paddingLeft: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#9F9F9F',
    opacity: 1,
    position: 'relative',
  },
  cardImage: {
    width: 60,
    height: 60,
    marginBottom: 15,
    opacity: 0.3,
  },
  cardText: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 15,
    letterSpacing: 0,
    color: '#01004C',
    textAlign: 'center',
    flexWrap: 'wrap',
    maxWidth: 122,
  },
  termsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  termsText: {
    fontSize: 14,
    color: '#01004C',
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  continueButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
  },
  tickButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0AAD2D',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default OverviewDetailsScreen;