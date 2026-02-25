import React, { useState } from 'react';
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

interface AndroidExpenseWidgetProps {
  onExpenseAdded?: () => void;
  isWidget?: boolean; // To differentiate between widget and in-app usage
}

const AndroidExpenseWidget: React.FC<AndroidExpenseWidgetProps> = ({
  onExpenseAdded,
  isWidget = false
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.MISCELLANEOUS);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.UPI);
  const [isLoading, setIsLoading] = useState(false);

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

  // Widget-specific compact layout
  if (isWidget) {
    return (
      <View style={widgetStyles.container}>
        <View style={widgetStyles.header}>
          <Icon name="add-circle" size={widthPercentage(6)} color="#6200ee" />
          <Text style={widgetStyles.title}>Quick Expense</Text>
        </View>

        <View style={widgetStyles.inputContainer}>
          <TextInput
            style={widgetStyles.amountInput}
            placeholder="₹0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <Text style={widgetStyles.currency}>₹</Text>
        </View>

        <View style={widgetStyles.rowContainer}>
          <TouchableOpacity
            style={widgetStyles.categoryButton}
            onPress={() => {
              const currentIndex = categories.indexOf(category);
              const nextIndex = (currentIndex + 1) % categories.length;
              setCategory(categories[nextIndex]);
            }}
          >
            <Icon name={getCategoryIcon(category)} size={widthPercentage(4)} color={getCategoryColor(category)} />
            <Text style={widgetStyles.categoryText}>{category.substring(0, 3)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={widgetStyles.addButton}
            onPress={handleAddExpense}
            disabled={isLoading}
          >
            <Icon name="add" size={widthPercentage(4)} color="#fff" />
            <Text style={widgetStyles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Full in-app component (same as QuickExpenseWidget but responsive)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="add-circle" size={widthPercentage(6)} color="#6200ee" />
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
        onPress={() => {
          const currentIndex = categories.indexOf(category);
          const nextIndex = (currentIndex + 1) % categories.length;
          setCategory(categories[nextIndex]);
        }}
      >
        <Icon name={getCategoryIcon(category)} size={widthPercentage(5)} color={getCategoryColor(category)} />
        <Text style={styles.pickerText}>{category}</Text>
        <Icon name="keyboard-arrow-down" size={widthPercentage(5)} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => {
          const currentIndex = paymentModes.indexOf(paymentMode);
          const nextIndex = (currentIndex + 1) % paymentModes.length;
          setPaymentMode(paymentModes[nextIndex]);
        }}
      >
        <Icon name="payment" size={widthPercentage(5)} color="#6200ee" />
        <Text style={styles.pickerText}>{paymentMode}</Text>
        <Icon name="keyboard-arrow-down" size={widthPercentage(5)} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.addButton, isLoading && styles.disabledButton]}
        onPress={handleAddExpense}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={styles.addButtonText}>Adding...</Text>
        ) : (
          <>
            <Icon name="add" size={widthPercentage(5)} color="#fff" />
            <Text style={styles.addButtonText}>Add Expense</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          setAmount('');
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

// Widget-specific compact styles
const widgetStyles = StyleSheet.create({
  container: {
    width: widthPercentage(95),
    backgroundColor: '#fff',
    borderRadius: widthPercentage(3),
    padding: widthPercentage(3),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: heightPercentage(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: widthPercentage(1),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPercentage(2),
  },
  title: {
    fontSize: widthPercentage(3.5),
    fontWeight: 'bold',
    color: '#6200ee',
    marginLeft: widthPercentage(1.5),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: widthPercentage(2),
    paddingHorizontal: widthPercentage(3),
    marginBottom: heightPercentage(2),
  },
  amountInput: {
    flex: 1,
    fontSize: widthPercentage(4),
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: heightPercentage(2),
  },
  currency: {
    fontSize: widthPercentage(3.5),
    color: '#666',
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: widthPercentage(2),
    paddingHorizontal: widthPercentage(2),
    paddingVertical: heightPercentage(1.5),
  },
  categoryText: {
    fontSize: widthPercentage(3),
    color: '#333',
    marginLeft: widthPercentage(1),
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    borderRadius: widthPercentage(2),
    paddingHorizontal: widthPercentage(3),
    paddingVertical: heightPercentage(1.5),
  },
  addButtonText: {
    color: '#fff',
    fontSize: widthPercentage(3),
    fontWeight: 'bold',
    marginLeft: widthPercentage(1),
  },
});

export default AndroidExpenseWidget;
