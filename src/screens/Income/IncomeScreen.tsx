import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
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
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { incomeService } from '../../api';
import { Income } from '../../types';

const IncomeScreen = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [filteredIncomes, setFilteredIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    loadIncomes();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = incomes.filter(income =>
        income.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        income.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredIncomes(filtered);
    } else {
      setFilteredIncomes(incomes);
    }
  }, [searchQuery, incomes]);

  const loadIncomes = async () => {
    try {
      const data = await incomeService.getAllIncomes();
      setIncomes(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to load incomes:', error);
      Alert.alert('Error', 'Failed to load income data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadIncomes();
  };

  const handleDeleteIncome = async (incomeId: number) => {
    Alert.alert(
      'Delete Income',
      'Are you sure you want to delete this income entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await incomeService.deleteIncome(incomeId);
              loadIncomes();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete income');
            }
          },
        },
      ]
    );
  };

  const renderIncomeItem = ({ item }: { item: Income }) => (
    <Card style={styles.incomeCard}>
      <List.Item
        title={item.source}
        description={item.description || 'No description'}
        left={(props) => (
          <Icon name="account-balance-wallet" size={24} color="#4caf50" {...props} />
        )}
        right={() => (
          <View style={styles.rightContainer}>
            <Text style={styles.amount}>+₹{item.amount.toLocaleString()}</Text>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <View style={styles.actionButtons}>
              <Button
                mode="text"
                compact
                onPress={() => navigation.navigate('IncomeDetail', { incomeId: item.id })}
              >
                <Icon name="edit" size={20} color="#6200ee" />
              </Button>
              <Button
                mode="text"
                compact
                onPress={() => handleDeleteIncome(item.id)}
              >
                <Icon name="delete" size={20} color="#f44336" />
              </Button>
            </View>
          </View>
        )}
      />
    </Card>
  );

  const getTotalIncome = () => {
    return incomes.reduce((total, income) => total + income.amount, 0);
  };

  const getCurrentMonthIncome = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return incomes
      .filter(income => {
        const incomeDate = new Date(income.createdAt);
        return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
      })
      .reduce((total, income) => total + income.amount, 0);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading Income Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Icon name="account-balance-wallet" size={24} color="#4caf50" />
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={styles.summaryAmount}>₹{getTotalIncome().toLocaleString()}</Text>
          </Card.Content>
        </Card>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Icon name="today" size={24} color="#2196f3" />
            <Text style={styles.summaryLabel}>This Month</Text>
            <Text style={styles.summaryAmount}>₹{getCurrentMonthIncome().toLocaleString()}</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search income..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Income List */}
      <FlatList
        data={filteredIncomes}
        renderItem={renderIncomeItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-balance-wallet" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No income found' : 'No income records yet'}
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('AddIncome')}
              style={styles.emptyButton}
            >
              Add Your First Income
            </Button>
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddIncome')}
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
    color: '#4caf50',
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  incomeCard: {
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
    color: '#4caf50',
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

export default IncomeScreen;
