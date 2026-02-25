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
import { useNavigation, useRoute } from '@react-navigation/native';
import { incomeService } from '../../api';
import { IncomeRequestDTO } from '../../types';

const AddIncomeScreen = () => {
  const [formData, setFormData] = useState<IncomeRequestDTO>({
    amount: 0,
    source: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const navigation = useNavigation();
  const route = useRoute();
  const isEditing = route.params?.incomeId;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
    }

    if (!formData.month || formData.month < 1 || formData.month > 12) {
      newErrors.month = 'Please select a valid month';
    }

    if (!formData.year || formData.year < 2000 || formData.year > 2100) {
      newErrors.year = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isEditing) {
        await incomeService.updateIncome(route.params.incomeId, formData);
        Alert.alert('Success', 'Income updated successfully');
      } else {
        await incomeService.addIncome(formData);
        Alert.alert('Success', 'Income added successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save income'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof IncomeRequestDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {isEditing ? 'Edit Income' : 'Add Income'}
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

          <TextInput
            label="Source"
            value={formData.source}
            onChangeText={(value) => updateFormData('source', value)}
            error={!!errors.source}
            style={styles.input}
            mode="outlined"
            placeholder="e.g., Salary, Freelance, Investment"
          />
          {errors.source && (
            <Text style={styles.errorText}>{errors.source}</Text>
          )}

          <TextInput
            label="Month"
            value={months[formData.month - 1]}
            onChangeText={(value) => {
              const monthIndex = months.indexOf(value);
              if (monthIndex !== -1) {
                updateFormData('month', monthIndex + 1);
              }
            }}
            error={!!errors.month}
            style={styles.input}
            mode="outlined"
            right={
              <TextInput.Icon
                icon="menu-down"
                onPress={() => {
                  // You can implement a picker here
                }}
              />
            }
          />
          {errors.month && (
            <Text style={styles.errorText}>{errors.month}</Text>
          )}

          <TextInput
            label="Year"
            value={formData.year.toString()}
            onChangeText={(value) => updateFormData('year', parseInt(value) || new Date().getFullYear())}
            keyboardType="numeric"
            error={!!errors.year}
            style={styles.input}
            mode="outlined"
          />
          {errors.year && (
            <Text style={styles.errorText}>{errors.year}</Text>
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
                isEditing ? 'Update' : 'Add Income'
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

export default AddIncomeScreen;
