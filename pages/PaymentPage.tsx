import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { bookSession } from '../services/bookingService';

interface PaymentPageProps {
  navigation?: any;
  route?: any;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  navigation,
  route,
}) => {
  const { tutorData, selectedDate, selectedTime, selectedDuration, selectedSlot, bookingType } = route?.params || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const insets = useSafeAreaInsets();

  const calculatePrice = () => {
    if (bookingType === 'trial') {
      return selectedDuration === 25 ? 10 : 15;
    }
    const hourlyRate = tutorData?.hourlyRate || 50;
    return (selectedDuration / 60) * hourlyRate;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePayment = useCallback(async () => {
    if (selectedPaymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv || !cardholderName)) {
    Alert.alert('Missing Information', 'Please fill in all card details.');
    return;
    }
    setIsProcessing(true);
    

    try {
      let startTime, endTime;
      
      if (selectedSlot?.start && selectedSlot?.end) {
        startTime = selectedSlot.start;
        endTime = selectedSlot.end;
        
      } else if (selectedTime?.includes('-')) {
        const timeParts = selectedTime.split('-');
        startTime = timeParts[0]?.trim();
        endTime = timeParts[1]?.trim();
        
      } else {
        throw new Error('Invalid time selection');
      }
      
      const bookingData = {
        tutorId: tutorData.account?.id || tutorData.id,
        sessionDate: selectedDate,
        startTime,
        endTime,
        sessionType: bookingType === 'trial' ? 'TRIAL' : 'REGULAR',
        ...(bookingType === 'trial' && selectedDuration && { duration: selectedDuration }),
        notes: `${bookingType === 'trial' ? 'Trial class' : 'Regular session'} - ${tutorData.subject?.name || 'General'} tutoring session`
      };
      
      const result = await bookSession(bookingData);
      
      if (result) {
        Alert.alert(
          'Booking Successful!', 
          `Your ${bookingType === 'trial' ? 'trial class' : 'session'} has been booked successfully.\n\nBooking ID: ${result.id}`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('MainTabs', { screen: 'Home' });
              }
            }
          ]
        );
      } else {
        Alert.alert('Booking Failed', 'There was an error processing your booking. Please try again.');
      }
    } catch (error) {
      console.error('Payment/Booking error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedPaymentMethod, cardNumber, expiryDate, cvv, cardholderName, bookingType, navigation, tutorData, selectedDate, selectedTime, selectedSlot, selectedDuration]);

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: 'credit-card' },
    { id: 'paypal', label: 'PayPal', icon: 'payment' },
    { id: 'wallet', label: 'Digital Wallet', icon: 'account-balance-wallet' },
  ];

  const price = calculatePrice();
  const tax = price * 0.1; // 10% tax
  const total = price + tax;

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#16423C" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.headerText}>Payment</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Booking Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tutor:</Text>
            <Text style={styles.summaryValue}>{tutorData?.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time:</Text>
            <Text style={styles.summaryValue}>{selectedTime}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>
              {selectedDuration} minutes
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Type:</Text>
            <Text style={styles.summaryValue}>
              {bookingType === 'trial' ? 'Trial Class' : 'Regular Session'}
            </Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Session Fee:</Text>
            <Text style={styles.priceValue}>${price.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax (10%):</Text>
            <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.paymentMethodInfo}>
                <MaterialIcons 
                  name={method.icon as any} 
                  size={24} 
                  color={selectedPaymentMethod === method.id ? '#FFFFFF' : '#16423C'} 
                />
                <Text style={[
                  styles.paymentMethodLabel,
                  selectedPaymentMethod === method.id && styles.selectedPaymentText
                ]}>
                  {method.label}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedPaymentMethod === method.id && styles.radioButtonSelected
              ]}>
                {selectedPaymentMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Details (only show if card is selected) */}
        {selectedPaymentMethod === 'card' && (
          <View style={styles.cardDetailsCard}>
            <Text style={styles.cardDetailsTitle}>Card Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Cardholder Name"
              value={cardholderName}
              onChangeText={setCardholderName}
            />
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              maxLength={16}
            />
            <View style={styles.cardRow}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={setExpiryDate}
                maxLength={5}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.payButton,
            isProcessing && styles.disabledButton
          ]} 
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <Text style={[
            styles.payButtonText,
            isProcessing && styles.disabledButtonText
          ]}>
            {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
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
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 0,
    paddingRight: 4,
  },
  headerText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  summaryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E4E4E4',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#16423C',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    color: '#16423C',
    fontWeight: 'bold',
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
  },
  selectedPaymentMethod: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodLabel: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
    fontWeight: '500',
  },
  selectedPaymentText: {
    color: '#FFFFFF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FFFFFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  cardDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  cardDetailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4E4E4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
    backgroundColor: '#FFFFFF',
  },
  payButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: '#999999',
  },
});

export default PaymentPage;