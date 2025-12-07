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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import PolicyCard from '../components/policy/PolicyCard';

interface GeneralPolicyScreenProps {
  onBack?: () => void;
  navigation?: any;
}

const GeneralPolicyScreen: React.FC<GeneralPolicyScreenProps> = ({
  onBack,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const defaultContent = `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'.`;

  const policyCards = [
    {
      id: 1,
      image: require('../assets/terms.png'),
      text: 'Terms & Conditions',
      content: defaultContent,
    },
    {
      id: 2,
      image: require('../assets/privacy.png'),
      text: 'Privacy Policy',
      content: defaultContent,
    },
    {
      id: 3,
      image: require('../assets/gdpr.png'),
      text: 'GDPR Policy',
      content: defaultContent,
    },
    {
      id: 4,
      image: require('../assets/data.png'),
      text: 'Data Policy',
      content: defaultContent,
    },
    {
      id: 5,
      image: require('../assets/algorithm.png'),
      text: 'Algorithm Policy',
      content: defaultContent,
    },
    {
      id: 6,
      image: require('../assets/refund.png'),
      text: 'Refund Policy',
      content: defaultContent,
    },
    {
      id: 7,
      image: require('../assets/cancel.png'),
      text: 'Cancellation Policy',
      content: defaultContent,
    },
    {
      id: 8,
      image: require('../assets/group.png'),
      text: 'Group Classes Policy',
      content: defaultContent,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
        <TouchableOpacity onPress={onBack || (() => navigation?.goBack())} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>App Policies</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
    
        <View style={styles.cardsContainer}>
          {Array.from({ length: Math.ceil(policyCards.length / 2) }, (_, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <View style={styles.cardRow}>
                {policyCards.slice(rowIndex * 2, rowIndex * 2 + 2).map((card) => (
                  <PolicyCard 
                    key={card.id}
                    iconSource={card.image}
                    text={card.text}
                    onPress={() => navigation?.navigate('PolicyDetail', {
                      title: card.text,
                      content: card.content
                    })}
                  />
                ))}
              </View>
              {rowIndex === 2 && (
                <View style={styles.separator}>
                  <View style={styles.textContainer}>
                    <Text style={styles.supportText}>Still you need support</Text>
                    <Text style={styles.connectText}>Click here to connect now</Text>
                  </View>
                  <View style={styles.policyIconContainer}>
                    <Image 
                      source={require('../assets/policy.png')} 
                      style={styles.policyIcon}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              )}
            </React.Fragment>
          ))}
        </View>


      </ScrollView>
    </View>
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
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    padding: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  separator: {
    width: 395,
    height: 69,
    backgroundColor: '#01004C',
    borderRadius: 8,
    borderWidth: 0.21,
    borderColor: '#01004C',
    marginBottom: 20,
    opacity: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 0,
  },
  policyIconContainer: {
    width: 152,
    height: 69,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  policyIcon: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    justifyContent: 'center',
  },
  supportText: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#FFFFFF',
  },
  connectText: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#FFFFFF',
    marginTop: 2,
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

export default GeneralPolicyScreen;