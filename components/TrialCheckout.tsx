import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';

interface TrialCheckoutProps {
  tutorData: any;
  selectedDuration: number;
  selectedDate: string;
  selectedTimeSlot: string;
  onProceedToPay: () => void;
}

const TrialCheckout: React.FC<TrialCheckoutProps> = ({
  tutorData,
  selectedDuration,
  selectedDate,
  selectedTimeSlot,
  onProceedToPay,
}) => {
  const [promoCode, setPromoCode] = useState('');

  const lessonPrice = selectedDuration === 25 ? 15 : 25;
  const processingFee = 2;
  const totalPrice = lessonPrice + processingFee;

  return (
    <View style={styles.container}>
      {/* Stats Buttons */}
      <View style={styles.statsContainer}>
        <View style={styles.statButton}>
          <Image source={require('../assets/student.png')} style={styles.statIcon} />
          <View style={styles.statTextRow}>
            <Text style={styles.statNumber}>150 </Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
        </View>
        <View style={styles.statButton}>
          <Image source={require('../assets/lesson.png')} style={styles.statIcon} />
          <View style={styles.statTextRow}>
            <Text style={styles.statNumber}>200 </Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </View>
        <View style={styles.statButton}>
          <Image source={require('../assets/experiance.png')} style={styles.statIcon} />
          <View style={styles.statTextRow}>
            <Text style={styles.statNumber}>3 Yrs </Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
        </View>
      </View>

      {/* Trial Class Details */}
      <View style={styles.classDetailsContainer}>
        <View style={styles.classCard}>
          <Text style={styles.cardTitle}>Trial Class Details</Text>
          <Text style={styles.cardText}>Duration: {selectedDuration} minutes</Text>
          <Text style={styles.cardText}>Date: {selectedDate}</Text>
          <Text style={styles.cardText}>Time: {selectedTimeSlot}</Text>
        </View>
        
        <View style={styles.actionCard}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Checkout Info */}
      <View style={styles.checkoutContainer}>
        <Text style={styles.sectionTitle}>Checkout Information</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Lesson Price:</Text>
          <Text style={styles.priceValue}>${lessonPrice}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Processing Fee:</Text>
          <Text style={styles.priceValue}>${processingFee}</Text>
        </View>
        
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${totalPrice}</Text>
        </View>

        <View style={styles.promoContainer}>
          <TextInput
            style={styles.promoInput}
            placeholder="Enter promo code"
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply Code</Text>
          </TouchableOpacity>
        </View>

        {/* Free Tutor Replacement */}
        <View style={styles.replacementContainer}>
          <Image 
            source={require('../assets/tutorreplacement.png')} 
            style={styles.replacementIcon}
          />
          <Text style={styles.replacementText}>Free Tutor Replacement Available</Text>
        </View>
      </View>

      {/* Proceed to Pay Button */}
      <TouchableOpacity style={styles.proceedButton} onPress={onProceedToPay}>
        <Text style={styles.proceedButtonText}>Proceed to Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: -25,
  },
  statButton: {
    width: 126,
    height: 55,
    borderRadius: 2,
    borderWidth: 0.31,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F8F9',
    paddingVertical: 2,
  },
  statIcon: {
    width: 22,
    height: 22,
    marginBottom: 4,
  },
  statTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16423C',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  classDetailsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  classCard: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F9FA',
  },
  actionCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F7F8F9',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#16423C',
    alignItems: 'center',
    marginVertical: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#16423C',
    fontWeight: '500',
  },
  checkoutContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#01004C',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 15,
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
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
  },
  promoContainer: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  promoInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: '#16423C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  replacementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#16423C',
    backgroundColor: '#F7F8F9',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  replacementIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  replacementText: {
    fontSize: 14,
    color: '#16423C',
    fontWeight: '500',
    flex: 1,
  },
  proceedButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrialCheckout;