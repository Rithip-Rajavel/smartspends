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
import { incomeService } from '../../api';
import { Income } from '../../types';

const IncomeDetailScreen = () => {
  const [income, setIncome] = useState<Income | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { incomeId } = route.params as { incomeId: number };

  useEffect(() => {
    loadIncomeDetails();
  }, [incomeId]);

  const loadIncomeDetails = async () => {
    try {
      const incomes = await incomeService.getAllIncomes();
      const incomeDetail = incomes.find(item => item.id === incomeId);
      if (incomeDetail) {
        setIncome(incomeDetail);
      } else {
        Alert.alert('Error', 'Income not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to load income details:', error);
      Alert.alert('Error', 'Failed to load income details');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
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
              Alert.alert('Success', 'Income deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete income');
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate('AddIncome', { incomeId });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading Income Details...</Text>
      </View>
    );
  }

  if (!income) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={48} color="#f44336" />
        <Text style={styles.errorText}>Income not found</Text>
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
            <Icon name="account-balance-wallet" size={32} color="#4caf50" />
            <Title style={styles.title}>{income.source}</Title>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amount}>+₹{income.amount.toLocaleString()}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {new Date(income.createdAt).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Month</Text>
            <Text style={styles.value}>
              {new Date(income.year, income.month - 1).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
          </View>

          {income.description && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.descriptionContainer}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.description}>{income.description}</Text>
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
            Edit Income
          </Button>

          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.deleteButton}
            icon="delete"
            textColor="#f44336"
          >
            Delete Income
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
    color: '#4caf50',
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

export default IncomeDetailScreen;
