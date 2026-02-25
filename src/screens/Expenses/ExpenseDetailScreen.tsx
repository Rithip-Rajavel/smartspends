import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { expenseService } from '../../api';
import { Expense } from '../../types';

const ExpenseDetailScreen = () => {
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { expenseId } = route.params as { expenseId: number };

  useEffect(() => {
    loadExpenseDetails();
  }, [expenseId]);

  const loadExpenseDetails = async () => {
    try {
      const expenses = await expenseService.getAllExpenses();
      const expenseDetail = expenses.find(item => item.id === expenseId);
      if (expenseDetail) {
        setExpense(expenseDetail);
      } else {
        Alert.alert('Error', 'Expense not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to load expense details:', error);
      Alert.alert('Error', 'Failed to load expense details');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await expenseService.deleteExpense(expenseId);
              Alert.alert('Success', 'Expense deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('AddExpense', { expenseId });
  };

  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      FOOD: 'restaurant',
      TRANSPORT: 'directions-car',
      ENTERTAINMENT: 'movie',
      BILLS: 'receipt',
      SHOPPING: 'shopping-bag',
      HEALTHCARE: 'local-hospital',
      MISCELLANEOUS: 'more-horiz',
    };
    return icons[category] || 'help';
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      FOOD: '#ff6384',
      TRANSPORT: '#36a2eb',
      ENTERTAINMENT: '#ffce56',
      BILLS: '#4bc0c0',
      SHOPPING: '#9966ff',
      HEALTHCARE: '#ff9f40',
      MISCELLANEOUS: '#ff6384',
    };
    return colors[category] || '#999';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading Expense Details...</Text>
      </View>
    );
  }

  if (!expense) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={48} color="#f44336" />
        <Text style={styles.errorText}>Expense not found</Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Icon 
              name={getCategoryIcon(expense.category)} 
              size={32} 
              color={getCategoryColor(expense.category)} 
            />
            <Title style={styles.title}>
              {expense.description || expense.category}
            </Title>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amount}>-₹{expense.amount.toLocaleString()}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              <Icon 
                name={getCategoryIcon(expense.category)} 
                size={16} 
                color={getCategoryColor(expense.category)} 
              />
              <Text style={styles.value}>{expense.category}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Payment Mode</Text>
            <Text style={styles.value}>{expense.paymentMode}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {new Date(expense.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {expense.description && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.descriptionContainer}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.description}>{expense.description}</Text>
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.actionsTitle}>Actions</Title>
          
          <Button
            mode="contained"
            onPress={handleEdit}
            style={styles.actionButton}
            icon="edit"
          >
            Edit Expense
          </Button>

          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.deleteButton}
            icon="delete"
            textColor="#f44336"
          >
            Delete Expense
          </Button>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: '#6200ee',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginTop: 10,
    color: '#6200ee',
  },
  divider: {
    marginVertical: 15,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f44336',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginTop: 5,
  },
  actionsCard: {
    elevation: 4,
    borderRadius: 12,
  },
  actionsTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200ee',
  },
  actionButton: {
    marginBottom: 10,
    backgroundColor: '#6200ee',
  },
  deleteButton: {
    borderColor: '#f44336',
  },
});

export default ExpenseDetailScreen;
