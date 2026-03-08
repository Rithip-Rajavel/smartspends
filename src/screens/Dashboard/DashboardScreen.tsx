import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
  Surface,
  IconButton,
} from 'react-native-paper';
import { PieChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { dashboardService } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { Dashboard } from '../../types';
import {
  wp,
  hp,
  scale,
  fontSizes,
  spacing,
  borderRadius,
  iconSizes,
  shadows,
  chartDimensions
} from '../../utils/responsive';

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { logout } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await dashboardService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            await logout();
          } 
        },
      ]
    );
  };

  const pieChartData = dashboardData?.expenseBreakdown.map(item => ({
    name: item.category,
    population: item.amount,
    color: getCategoryColor(item.category),
    legendFontColor: '#333',
    legendFontSize: fontSizes.sm,
  })) || [];

  const monthlyTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [12000, 15000, 13000, 18000, 16000, dashboardData?.currentMonthExpenses || 0],
    }],
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
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
        <View style={styles.headerTextContainer}>
          <Title style={styles.headerTitle}>Financial Dashboard</Title>
          <Paragraph style={styles.headerSubtitle}>
            Welcome back! Here's your financial overview
          </Paragraph>
        </View>
        <IconButton 
          icon="logout" 
          iconColor="#f44336" 
          size={24} 
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <Surface style={[styles.summaryCard, styles.incomeCard]}>
          <Icon name="account-balance-wallet" size={24} color="#4caf50" />
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryAmount}>
            ₹{dashboardData?.currentMonthIncome.toLocaleString()}
          </Text>
        </Surface>

        <Surface style={[styles.summaryCard, styles.expenseCard]}>
          <Icon name="shopping-cart" size={24} color="#f44336" />
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={styles.summaryAmount}>
            ₹{dashboardData?.currentMonthExpenses.toLocaleString()}
          </Text>
        </Surface>

        <Surface style={[styles.summaryCard, styles.savingsCard]}>
          <Icon name="savings" size={24} color="#2196f3" />
          <Text style={styles.summaryLabel}>Savings</Text>
          <Text style={styles.summaryAmount}>
            ₹{dashboardData?.currentMonthSavings.toLocaleString()}
          </Text>
        </Surface>
      </View>

      {/* Expense Breakdown Chart */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.chartTitle}>Expense Breakdown</Title>
          {pieChartData.length > 0 ? (
            <PieChart
              data={pieChartData}
              width={chartDimensions.width - 40}
              height={chartDimensions.pieChartSize - 40}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[0, 0]}
            />
          ) : (
            <Text style={styles.noDataText}>No expense data available</Text>
          )}
        </Card.Content>
      </Card>

      {/* Monthly Trend */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.chartTitle}>Monthly Expense Trend</Title>
          <BarChart
            data={monthlyTrendData}
            width={chartDimensions.barChartWidth}
            height={chartDimensions.lineChartHeight}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: borderRadius.lg,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#6200ee',
              },
            }}
            yAxisLabel=""
            yAxisSuffix=""
            verticalLabelRotation={30}
          />
        </Card.Content>
      </Card>

      {/* Recent Transactions */}
      <Card style={styles.transactionsCard}>
        <Card.Content>
          <View style={styles.transactionsHeader}>
            <Title style={styles.transactionsTitle}>Recent Transactions</Title>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Expenses' as any)}
              compact
            >
              View All
            </Button>
          </View>
          {dashboardData?.recentTransactions.slice(0, 5).map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <Icon
                name={transaction.amount > 0 ? 'arrow-downward' : 'arrow-upward'}
                size={20}
                color={transaction.amount > 0 ? '#4caf50' : '#f44336'}
              />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>
                  {transaction.description || ('source' in transaction ? transaction.source : transaction.category)}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: transaction.amount > 0 ? '#4caf50' : '#f44336' }
                ]}
              >
                {transaction.amount > 0 ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddIncome' as any)}
          style={styles.actionButton}
          icon="plus"
        >
          Add Income
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddExpense' as any)}
          style={styles.actionButton}
          icon="minus"
        >
          Add Expense
        </Button>
      </View>

      <FAB
        style={styles.fab}
        icon="plus"
        color='white'
        onPress={() => navigation.navigate('AddExpense' as any)}
      />
    </ScrollView>
  );
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
    marginTop: spacing.sm,
    fontSize: fontSizes.base,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    padding: spacing.lg,
    paddingTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
  },
  logoutButton: {
    margin: 0,
  },
  headerTitle: {
    fontSize: fontSizes['3xl'],
    fontWeight: 'bold',
    color: '#6200ee',
  },
  headerSubtitle: {
    color: '#666',
    marginTop: 2,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginBottom: hp(5),
  },
  summaryCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minWidth: wp(25),
    ...shadows.sm,
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
    fontSize: fontSizes.sm,
    color: '#666',
    marginTop: spacing.xs,
  },
  summaryAmount: {
    fontSize: fontSizes.base,
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  chartCard: {
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  chartTitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: '#6200ee',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    padding: spacing.lg,
  },
  transactionsCard: {
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  transactionsTitle: {
    color: '#6200ee',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2.5),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  transactionDescription: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: fontSizes.xs,
    color: '#666',
    marginTop: spacing.xs,
  },
  transactionAmount: {
    fontSize: fontSizes.sm,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginBottom: hp(10),
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
    backgroundColor: '#6200ee',
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default DashboardScreen;
