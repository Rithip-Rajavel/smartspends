import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  ActivityIndicator,
  List,
  Divider,
  Searchbar,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { expenseService } from '../../api';
import { Expense, ExpenseCategory } from '../../types';

const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const navigation = useNavigation();

  const categories: ExpenseCategory[] = Object.values(ExpenseCategory);

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    let filtered = expenses;

    if (searchQuery) {
      filtered = filtered.filter(expense =>
        expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(expense => expense.category === selectedCategory);
    }

    setFilteredExpenses(filtered);
  }, [searchQuery, selectedCategory, expenses]);

  const loadExpenses = async () => {
    try {
      const data = await expenseService.getAllExpenses();
      setExpenses(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to load expenses:', error);
      Alert.alert('Error', 'Failed to load expense data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadExpenses();
  };

  const handleDeleteExpense = async (expenseId: number) => {
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
              loadExpenses();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <Card style={styles.expenseCard}>
      <List.Item
        title={item.description || item.category}
        description={`${item.category} • ${item.paymentMode}`}
        left={(props) => (
          <Icon name={getCategoryIcon(item.category)} size={24} color={getCategoryColor(item.category)} {...props} />
        )}
        right={() => (
          <View style={styles.rightContainer}>
            <Text style={styles.amount}>-₹{item.amount.toLocaleString()}</Text>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <View style={styles.actionButtons}>
              <Button
                mode="text"
                compact
                onPress={() => navigation.navigate('ExpenseDetail', { expenseId: item.id })}
              >
                <Icon name="edit" size={20} color="#6200ee" />
              </Button>
              <Button
                mode="text"
                compact
                onPress={() => handleDeleteExpense(item.id)}
              >
                <Icon name="delete" size={20} color="#f44336" />
              </Button>
            </View>
          </View>
        )}
      />
    </Card>
  );

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getCurrentMonthExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.createdAt);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategoryIcon = (category: ExpenseCategory): string => {
    const icons: { [key in ExpenseCategory]: string } = {
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

  const getCategoryColor = (category: ExpenseCategory): string => {
    const colors: { [key in ExpenseCategory]: string } = {
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
        <Text style={styles.loadingText}>Loading Expense Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Icon name="shopping-cart" size={24} color="#f44336" />
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryAmount}>₹{getTotalExpenses().toLocaleString()}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Icon name="today" size={24} color="#2196f3" />
            <Text style={styles.summaryLabel}>This Month</Text>
            <Text style={styles.summaryAmount}>₹{getCurrentMonthExpenses().toLocaleString()}</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Category Filters */}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <Chip
            selected={!selectedCategory}
            onPress={() => setSelectedCategory(null)}
            style={styles.categoryChip}
          >
            All
          </Chip>
          {categories.map(category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.categoryChip}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search expenses..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Expense List */}
      <FlatList
        data={filteredExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="shopping-cart" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery || selectedCategory ? 'No expenses found' : 'No expense records yet'}
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('AddExpense')}
              style={styles.emptyButton}
            >
              Add Your First Expense
            </Button>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddExpense')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  summaryContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    elevation: 4,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#f44336',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: 8,
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  expenseCard: {
    marginBottom: 10,
    elevation: 2,
    borderRadius: 8,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 20,
    backgroundColor: '#6200ee',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default ExpensesScreen;
