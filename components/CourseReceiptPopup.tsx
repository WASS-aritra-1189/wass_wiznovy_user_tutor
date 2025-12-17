import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CourseReceiptPopupProps {
  visible: boolean;
  onClose: () => void;
  courseName?: string;
  price?: string;
  discountPrice?: string;
}

const CourseReceiptPopup: React.FC<CourseReceiptPopupProps> = ({
  visible,
  onClose,
  courseName,
  price,
  discountPrice,
}) => {
  const originalPrice = Number.parseFloat(price || '0');
  const finalPrice = Number.parseFloat(discountPrice || price || '0');
  const savings = originalPrice - finalPrice;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#666666" />
          </TouchableOpacity>
          
          <View style={styles.header}>
            <MaterialIcons name="receipt" size={32} color="#16423C" />
            <Text style={styles.title}>Course Receipt</Text>
          </View>

          <View style={styles.receiptContainer}>
            <Text style={styles.courseName}>{courseName || 'Course'}</Text>
            
            <View style={styles.priceSection}>
              {discountPrice && price !== discountPrice ? (
                <>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Original Price:</Text>
                    <Text style={styles.originalPrice}>${originalPrice.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Discount:</Text>
                    <Text style={styles.discount}>-${savings.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.divider} />
                  
                  <View style={styles.priceRow}>
                    <Text style={styles.totalLabel}>Final Price:</Text>
                    <Text style={styles.finalPrice}>${finalPrice.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.savingsCard}>
                    <MaterialIcons name="savings" size={16} color="#4CAF50" />
                    <Text style={styles.savingsText}>You save ${savings.toFixed(2)}!</Text>
                  </View>
                </>
              ) : (
                <View style={styles.priceRow}>
                  <Text style={styles.totalLabel}>Price:</Text>
                  <Text style={styles.finalPrice}>${finalPrice.toFixed(2)}</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.okButton} onPress={onClose}>
            <Text style={styles.okButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16423C',
    marginTop: 8,
  },
  receiptContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16423C',
    textAlign: 'center',
    marginBottom: 16,
  },
  priceSection: {
    gap: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666666',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16423C',
  },
  finalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E4E4',
    marginVertical: 8,
  },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  savingsText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  okButton: {
    backgroundColor: '#16423C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  okButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CourseReceiptPopup;