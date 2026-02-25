import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  PixelRatio,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { expenseService } from '../api';
import { ExpenseRequestDTO, ExpenseCategory, PaymentMode } from '../types';

// Responsive design utilities
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const widthPercentage = (widthPercent: number) => {
  const screenWidth = Dimensions.get('window').width;
  return PixelRatio.roundToNearestPixel((screenWidth * widthPercent) / 100);
};
const heightPercentage = (heightPercent: number) => {
  const screenHeight = Dimensions.get('window').height;
  return PixelRatio.roundToNearestPixel((screenHeight * heightPercent) / 100);
};

interface QuickExpenseWidgetProps {
  onExpenseAdded?: () => void;
}

const QuickExpenseWidget: React.FC<QuickExpenseWidgetProps> = ({ onExpenseAdded }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.MISCELLANEOUS);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.UPI);
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  const categories = Object.values(ExpenseCategory);
  const paymentModes = Object.values(PaymentMode);

  const handleAddExpense = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      const expenseData: ExpenseRequestDTO = {
        amount: parseFloat(amount),
        category,
        paymentMode,
        description: `Quick expense - ${new Date().toLocaleTimeString()}`,
      };

      await expenseService.addExpense(expenseData);
      Alert.alert('Success', 'Expense added successfully!');
      setAmount('');
      onExpenseAdded?.();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (cat: ExpenseCategory): string => {
    const icons: { [key in ExpenseCategory]: string } = {
      FOOD: 'restaurant',
      TRANSPORT: 'directions-car',
      ENTERTAINMENT: 'movie',
      BILLS: 'receipt',
      SHOPPING: 'shopping-bag',
      HEALTHCARE: 'local-hospital',
      MISCELLANEOUS: 'more-horiz',
    };
    return icons[cat] || 'help';
  };

  const getCategoryColor = (cat: ExpenseCategory): string => {
    const colors: { [key in ExpenseCategory]: string } = {
      FOOD: '#ff6384',
      TRANSPORT: '#36a2eb',
      ENTERTAINMENT: '#ffce56',
      BILLS: '#4bc0c0',
      SHOPPING: '#9966ff',
      HEALTHCARE: '#ff9f40',
      MISCELLANEOUS: '#ff6384',
    };
    return colors[cat] || '#999';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="add-circle" size={24} color="#6200ee" />
        <Text style={styles.title}>Quick Expense</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.amountInput}
          placeholder="₹0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          autoFocus
        />
        <Text style={styles.currency}>₹</Text>
      </View>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowCategoryPicker(!showCategoryPicker)}
      >
        <Icon name={getCategoryIcon(category)} size={20} color={getCategoryColor(category)} />
        <Text style={styles.pickerText}>{category}</Text>
        <Icon name="keyboard-arrow-down" size={20} color="#666" />
      </TouchableOpacity>

      {showCategoryPicker && (
        <View style={styles.pickerContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.pickerItem,
                category === cat && styles.selectedPickerItem
              ]}
              onPress={() => {
                setCategory(cat);
                setShowCategoryPicker(false);
              }}
            >
              <Icon name={getCategoryIcon(cat)} size={16} color={getCategoryColor(cat)} />
              <Text style={styles.pickerItemText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowPaymentPicker(!showPaymentPicker)}
      >
        <Icon name="payment" size={20} color="#6200ee" />
        <Text style={styles.pickerText}>{paymentMode}</Text>
        <Icon name="keyboard-arrow-down" size={20} color="#666" />
      </TouchableOpacity>

      {showPaymentPicker && (
        <View style={styles.pickerContainer}>
          {paymentModes.map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.pickerItem,
                paymentMode === mode && styles.selectedPickerItem
              ]}
              onPress={() => {
                setPaymentMode(mode);
                setShowPaymentPicker(false);
              }}
            >
              <Text style={styles.pickerItemText}>{mode}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.addButton, isLoading && styles.disabledButton]}
        onPress={handleAddExpense}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={styles.addButtonText}>Adding...</Text>
        ) : (
          <>
            <Icon name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Expense</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          setAmount('');
          setShowCategoryPicker(false);
          setShowPaymentPicker(false);
        }}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: widthPercentage(90),
    backgroundColor: '#fff',
    borderRadius: widthPercentage(4),
    padding: widthPercentage(5),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: heightPercentage(1) },
    shadowOpacity: 0.1,
    shadowRadius: widthPercentage(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPercentage(3),
  },
  title: {
    fontSize: widthPercentage(4.5),
    fontWeight: 'bold',
    color: '#6200ee',
    marginLeft: widthPercentage(2),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: widthPercentage(3),
    paddingHorizontal: widthPercentage(4),
    marginBottom: heightPercentage(3),
  },
  amountInput: {
    flex: 1,
    fontSize: widthPercentage(6),
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: heightPercentage(3),
  },
  currency: {
    fontSize: widthPercentage(5),
    color: '#666',
    fontWeight: 'bold',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: widthPercentage(3),
    paddingHorizontal: widthPercentage(4),
    paddingVertical: heightPercentage(3),
    marginBottom: heightPercentage(2),
  },
  pickerText: {
    flex: 1,
    fontSize: widthPercentage(4),
    color: '#333',
    marginLeft: widthPercentage(2.5),
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: widthPercentage(2),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: heightPercentage(2),
    maxHeight: heightPercentage(40),
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: heightPercentage(2.5),
    paddingHorizontal: widthPercentage(4),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedPickerItem: {
    backgroundColor: '#f3e5f5',
  },
  pickerItemText: {
    fontSize: widthPercentage(3.5),
    color: '#333',
    marginLeft: widthPercentage(2),
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    borderRadius: widthPercentage(3),
    paddingVertical: heightPercentage(4),
    marginTop: heightPercentage(2.5),
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: widthPercentage(4),
    fontWeight: 'bold',
    marginLeft: widthPercentage(2),
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: heightPercentage(2.5),
    marginTop: heightPercentage(1.5),
  },
  cancelButtonText: {
    color: '#666',
    fontSize: widthPercentage(3.5),
  },
});

export default QuickExpenseWidget;
