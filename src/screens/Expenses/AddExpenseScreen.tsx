import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  ActivityIndicator,
} from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation, useRoute } from '@react-navigation/native';
import { expenseService } from '../../api';
import { ExpenseRequestDTO, ExpenseCategory, PaymentMode } from '../../types';

const AddExpenseScreen = () => {
  const [formData, setFormData] = useState<ExpenseRequestDTO>({
    amount: 0,
    category: ExpenseCategory.MISCELLANEOUS,
    paymentMode: PaymentMode.CASH,
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as { expenseId?: number } | undefined;
  const isEditing = routeParams?.expenseId;

  const categories = Object.values(ExpenseCategory);
  const paymentModes = Object.values(PaymentMode);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.paymentMode) {
      newErrors.paymentMode = 'Payment mode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isEditing && routeParams?.expenseId) {
        await expenseService.updateExpense(routeParams.expenseId, formData);
        Alert.alert('Success', 'Expense updated successfully');
      } else {
        await expenseService.addExpense(formData);
        Alert.alert('Success', 'Expense added successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save expense'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof ExpenseRequestDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {isEditing ? 'Edit Expense' : 'Add Expense'}
          </Title>

          <TextInput
            label="Amount"
            value={formData.amount ? formData.amount.toString() : ''}
            onChangeText={(value) => updateFormData('amount', parseFloat(value) || 0)}
            keyboardType="numeric"
            error={!!errors.amount}
            style={styles.input}
            mode="outlined"
          />
          {errors.amount && (
            <Text style={styles.errorText}>{errors.amount}</Text>
          )}

          <Text style={styles.label}>Category</Text>
          <Dropdown
            data={categories.map(cat => ({ label: cat, value: cat }))}
            labelField="label"
            valueField="value"
            value={formData.category}
            onChange={(item) => updateFormData('category', item.value)}
            style={styles.dropdown}
            placeholder="Select category"
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
          />
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}

          <Text style={styles.label}>Payment Mode</Text>
          <Dropdown
            data={paymentModes.map(mode => ({ label: mode, value: mode }))}
            labelField="label"
            valueField="value"
            value={formData.paymentMode}
            onChange={(item) => updateFormData('paymentMode', item.value)}
            style={styles.dropdown}
            placeholder="Select payment mode"
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
          />
          {errors.paymentMode && (
            <Text style={styles.errorText}>{errors.paymentMode}</Text>
          )}

          <TextInput
            label="Description (Optional)"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            multiline
            numberOfLines={3}
            style={styles.input}
            mode="outlined"
            placeholder="Add any additional notes..."
          />

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={isLoading}
              style={styles.submitButton}
              contentStyle={styles.buttonContent}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                isEditing ? 'Update' : 'Add Expense'
              )}
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200ee',
  },
  input: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  submitButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#6200ee',
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default AddExpenseScreen;
