import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Surface,
  List,
  Divider,
} from 'react-native-paper';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { dashboardService } from '../../api';
import { MonthlyComparison, ExpenseCategory } from '../../types';

const { width: screenWidth } = Dimensions.get('window');

const ComparisonScreen = () => {
  const [comparisonData, setComparisonData] = useState<MonthlyComparison | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadComparisonData();
  }, []);

  const loadComparisonData = async () => {
    try {
      const data = await dashboardService.getMonthlyComparison();
      setComparisonData(data);
    } catch (error) {
      console.error('Failed to load comparison data:', error);
      Alert.alert('Error', 'Failed to load comparison data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadComparisonData();
  };

  const getChangeIcon = (change: number): string => {
    return change >= 0 ? 'arrow-upward' : 'arrow-downward';
  };

  const getChangeColor = (change: number): string => {
    return change >= 0 ? '#4caf50' : '#f44336';
  };

  const formatChangeText = (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const monthlyComparisonData = {
    labels: ['Income', 'Expenses', 'Savings'],
    datasets: [
      {
        data: [
          comparisonData?.currentMonth.income || 0,
          comparisonData?.currentMonth.expenses || 0,
          comparisonData?.currentMonth.savings || 0,
        ],
        color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
      },
      {
        data: [
          comparisonData?.previousMonth.income || 0,
          comparisonData?.previousMonth.expenses || 0,
          comparisonData?.previousMonth.savings || 0,
        ],
        color: (opacity = 1) => `rgba(158, 158, 158, ${opacity})`,
      },
    ],
  };

  const categoryComparisonData = {
    labels: comparisonData?.categoryComparisons.map(item => item.category.substring(0, 3)) || [],
    datasets: [{
      data: comparisonData?.categoryComparisons.map(item => item.currentAmount) || [],
      color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
    }],
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading Comparison Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Monthly Comparison</Title>
        <Paragraph style={styles.headerSubtitle}>
          Compare your financial habits month over month
        </Paragraph>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <Surface style={[styles.summaryCard, styles.incomeCard]}>
          <Icon name="account-balance-wallet" size={24} color="#4caf50" />
          <Text style={styles.summaryLabel}>Income Change</Text>
          <View style={styles.changeContainer}>
            <Icon
              name={getChangeIcon(comparisonData?.percentageChanges.income || 0)}
              size={16}
              color={getChangeColor(comparisonData?.percentageChanges.income || 0)}
            />
            <Text style={[styles.changeText, { color: getChangeColor(comparisonData?.percentageChanges.income || 0) }]}>
              {formatChangeText(comparisonData?.percentageChanges.income || 0)}
            </Text>
          </View>
        </Surface>

        <Surface style={[styles.summaryCard, styles.expenseCard]}>
          <Icon name="shopping-cart" size={24} color="#f44336" />
          <Text style={styles.summaryLabel}>Expense Change</Text>
          <View style={styles.changeContainer}>
            <Icon
              name={getChangeIcon(comparisonData?.percentageChanges.expenses || 0)}
              size={16}
              color={getChangeColor(comparisonData?.percentageChanges.expenses || 0)}
            />
            <Text style={[styles.changeText, { color: getChangeColor(comparisonData?.percentageChanges.expenses || 0) }]}>
              {formatChangeText(comparisonData?.percentageChanges.expenses || 0)}
            </Text>
          </View>
        </Surface>

        <Surface style={[styles.summaryCard, styles.savingsCard]}>
          <Icon name="savings" size={24} color="#2196f3" />
          <Text style={styles.summaryLabel}>Savings Change</Text>
          <View style={styles.changeContainer}>
            <Icon
              name={getChangeIcon(comparisonData?.percentageChanges.savings || 0)}
              size={16}
              color={getChangeColor(comparisonData?.percentageChanges.savings || 0)}
            />
            <Text style={[styles.changeText, { color: getChangeColor(comparisonData?.percentageChanges.savings || 0) }]}>
              {formatChangeText(comparisonData?.percentageChanges.savings || 0)}
            </Text>
          </View>
        </Surface>
      </View>

      {/* Monthly Comparison Chart */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.chartTitle}>Monthly Overview</Title>
          <BarChart
            data={monthlyComparisonData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#6200ee',
              },
            }}
            style={styles.chart}
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#6200ee' }]} />
              <Text style={styles.legendText}>Current Month</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#9e9e9e' }]} />
              <Text style={styles.legendText}>Previous Month</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Detailed Comparison */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Title style={styles.detailsTitle}>Detailed Comparison</Title>
          
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Income</Text>
              <Text style={styles.comparisonValue}>
                ₹{comparisonData?.currentMonth.income.toLocaleString()}
              </Text>
              <Text style={styles.comparisonSubtext}>
                vs ₹{comparisonData?.previousMonth.income.toLocaleString()}
              </Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Expenses</Text>
              <Text style={styles.comparisonValue}>
                ₹{comparisonData?.currentMonth.expenses.toLocaleString()}
              </Text>
              <Text style={styles.comparisonSubtext}>
                vs ₹{comparisonData?.previousMonth.expenses.toLocaleString()}
              </Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Savings</Text>
              <Text style={styles.comparisonValue}>
                ₹{comparisonData?.currentMonth.savings.toLocaleString()}
              </Text>
              <Text style={styles.comparisonSubtext}>
                vs ₹{comparisonData?.previousMonth.savings.toLocaleString()}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Category Comparison */}
      <Card style={styles.categoryCard}>
        <Card.Content>
          <Title style={styles.categoryTitle}>Category Breakdown</Title>
          {comparisonData?.categoryComparisons.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.category}</Text>
                <Text style={styles.categoryAmount}>
                  ₹{category.currentAmount.toLocaleString()}
                </Text>
              </View>
              <View style={styles.categoryChange}>
                <Icon
                  name={getChangeIcon(category.change)}
                  size={16}
                  color={getChangeColor(category.change)}
                />
                <Text style={[styles.categoryChangeText, { color: getChangeColor(category.change) }]}>
                  {formatChangeText(category.change)}
                </Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  headerSubtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 5,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  summaryCard: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    minWidth: 100,
    marginHorizontal: 5,
  },
  incomeCard: {
    backgroundColor: '#e8f5e8',
  },
  expenseCard: {
    backgroundColor: '#ffebee',
  },
  savingsCard: {
    backgroundColor: '#e3f2fd',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  changeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  chartCard: {
    margin: 20,
    elevation: 4,
    borderRadius: 12,
  },
  chartTitle: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#6200ee',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  detailsCard: {
    margin: 20,
    elevation: 4,
    borderRadius: 12,
  },
  detailsTitle: {
    color: '#6200ee',
    marginBottom: 15,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  comparisonLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  comparisonSubtext: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  categoryCard: {
    margin: 20,
    elevation: 4,
    borderRadius: 12,
  },
  categoryTitle: {
    color: '#6200ee',
    marginBottom: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  categoryAmount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  categoryChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryChangeText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
});

export default ComparisonScreen;
