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
import { LineChart, PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { savingsService } from '../../api';
import { SavingsAnalysis, InvestmentRecommendation } from '../../types';

const { width: screenWidth } = Dimensions.get('window');

const SavingsScreen = () => {
  const [savingsData, setSavingsData] = useState<SavingsAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'recommendations'>('analysis');
  const navigation = useNavigation();

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    try {
      const [analysisData, recommendationsData] = await Promise.all([
        savingsService.getAnalysis(),
        savingsService.getRecommendations(),
      ]);
      setSavingsData(analysisData);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error('Failed to load savings data:', error);
      Alert.alert('Error', 'Failed to load savings data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSavingsData();
  };

  const savingsTrendData = savingsData?.savingsTrend.map(item => ({
    month: item.month.substring(0, 3),
    savings: item.amount,
  })) || [];

  const chartData = {
    labels: savingsTrendData.map(item => item.month),
    datasets: [{
      data: savingsTrendData.map(item => item.savings),
      color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
      strokeWidth: 2,
    }],
  };

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'LOW': return '#4caf50';
      case 'MEDIUM': return '#ff9800';
      case 'HIGH': return '#f44336';
      default: return '#999';
    }
  };

  const getRiskIcon = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'LOW': return 'shield';
      case 'MEDIUM': return 'warning';
      case 'HIGH': return 'dangerous';
      default: return 'help';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading Savings Analysis...</Text>
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
        <Title style={styles.headerTitle}>Savings & Investments</Title>
        <Paragraph style={styles.headerSubtitle}>
          Track your savings and get investment recommendations
        </Paragraph>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <Surface style={[styles.summaryCard, styles.totalSavingsCard]}>
          <Icon name="savings" size={24} color="#2196f3" />
          <Text style={styles.summaryLabel}>Total Savings</Text>
          <Text style={styles.summaryAmount}>
            ₹{savingsData?.totalSavings.toLocaleString() || 0}
          </Text>
        </Surface>

        <Surface style={[styles.summaryCard, styles.avgSavingsCard]}>
          <Icon name="trending-up" size={24} color="#4caf50" />
          <Text style={styles.summaryLabel}>Monthly Average</Text>
          <Text style={styles.summaryAmount}>
            ₹{Math.round(savingsData?.monthlyAverage || 0).toLocaleString()}
          </Text>
        </Surface>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === 'analysis' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('analysis')}
          style={styles.tabButton}
        >
          Analysis
        </Button>
        <Button
          mode={activeTab === 'recommendations' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('recommendations')}
          style={styles.tabButton}
        >
          Recommendations
        </Button>
      </View>

      {activeTab === 'analysis' && (
        <>
          {/* Savings Trend Chart */}
          <Card style={styles.chartCard}>
            <Card.Content>
              <Title style={styles.chartTitle}>Savings Trend</Title>
              {savingsTrendData.length > 0 ? (
                <LineChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: '#2196f3',
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              ) : (
                <Text style={styles.noDataText}>No savings data available</Text>
              )}
            </Card.Content>
          </Card>

          {/* Recommendations List */}
          <Card style={styles.recommendationsCard}>
            <Card.Content>
              <Title style={styles.recommendationsTitle}>Savings Tips</Title>
              {savingsData?.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Icon name="lightbulb" size={20} color="#ffc107" />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </>
      )}

      {activeTab === 'recommendations' && (
        <View style={styles.recommendationsContainer}>
          {recommendations.map((recommendation, index) => (
            <Card key={index} style={styles.investmentCard}>
              <Card.Content>
                <View style={styles.investmentHeader}>
                  <Title style={styles.investmentTitle}>{recommendation.type}</Title>
                  <View style={styles.riskContainer}>
                    <Icon 
                      name={getRiskIcon(recommendation.riskLevel)} 
                      size={16} 
                      color={getRiskColor(recommendation.riskLevel)} 
                    />
                    <Text style={[styles.riskText, { color: getRiskColor(recommendation.riskLevel) }]}>
                      {recommendation.riskLevel}
                    </Text>
                  </View>
                </View>
                
                <Paragraph style={styles.investmentDescription}>
                  {recommendation.description}
                </Paragraph>
                
                <View style={styles.investmentDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Expected Returns</Text>
                    <Text style={styles.detailValue}>{recommendation.expectedReturns}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Min Investment</Text>
                    <Text style={styles.detailValue}>₹{recommendation.minInvestment.toLocaleString()}</Text>
                  </View>
                </View>
                
                <Button
                  mode="outlined"
                  onPress={() => {
                    Alert.alert('Investment', 'This feature will be available soon!');
                  }}
                  style={styles.investButton}
                >
                  Learn More
                </Button>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    minWidth: 150,
  },
  totalSavingsCard: {
    backgroundColor: '#e3f2fd',
  },
  avgSavingsCard: {
    backgroundColor: '#e8f5e8',
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
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  tabButton: {
    flex: 1,
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
  noDataText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  recommendationsCard: {
    margin: 20,
    elevation: 4,
    borderRadius: 12,
  },
  recommendationsTitle: {
    color: '#6200ee',
    marginBottom: 15,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  recommendationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  recommendationsContainer: {
    paddingHorizontal: 20,
  },
  investmentCard: {
    marginBottom: 15,
    elevation: 4,
    borderRadius: 12,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  investmentTitle: {
    fontSize: 18,
    color: '#6200ee',
    flex: 1,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  investmentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  investmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  investButton: {
    borderColor: '#6200ee',
  },
});

export default SavingsScreen;
