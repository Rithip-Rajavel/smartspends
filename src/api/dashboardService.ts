import apiClient from './axiosConfig';
import { Dashboard, MonthlyComparison, MonthlySummary, ExpenseCategory } from '../types';

export const dashboardService = {
  getDashboard: async (): Promise<Dashboard> => {
    const response = await apiClient.get('/api/dashboard');
    const resData = response.data?.data || response.data;
    
    const categoryExpenses = resData.categoryExpenses || {};
    const totalExpenses = resData.currentMonthExpense || 0;
    
    const expenseBreakdown = Object.keys(categoryExpenses).map(category => {
      const amount = categoryExpenses[category];
      return {
        category: category as ExpenseCategory,
        amount: amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      };
    });

    return {
      currentMonthIncome: resData.currentMonthIncome || 0,
      currentMonthExpenses: resData.currentMonthExpense || resData.currentMonthExpenses || 0,
      currentMonthSavings: resData.currentMonthSavings || 0,
      totalSavings: resData.totalSavings || 0,
      recentTransactions: resData.recentExpenses || resData.recentTransactions || [],
      expenseBreakdown
    };
  },

  getMonthlyComparison: async (): Promise<MonthlyComparison> => {
    const response = await apiClient.get('/api/dashboard/comparison');
    const resData = response.data?.data || response.data || {};
    
    // The API returns the fields slightly flattened and in different keys, e.g. currentMonthIncome, 
    // previousMonthComparison.previousMonthIncome, incomePercentageChange, etc.
    const prevMonthData = resData.previousMonthComparison || {};
    
    return {
      currentMonth: { 
        income: resData.currentMonthIncome || 0, 
        expenses: resData.currentMonthExpense || 0, 
        savings: resData.currentMonthSavings || 0 
      },
      previousMonth: { 
        income: prevMonthData.previousMonthIncome || 0, 
        expenses: prevMonthData.previousMonthExpense || 0, 
        savings: prevMonthData.previousMonthSavings || 0 
      },
      percentageChanges: { 
        income: prevMonthData.incomePercentageChange || resData.incomePercentageChange || 0, 
        expenses: prevMonthData.expensePercentageChange || resData.expensePercentageChange || 0, 
        savings: prevMonthData.savingsPercentageChange || resData.savingsPercentageChange || 0 
      },
      categoryComparisons: resData.categoryComparisons || []
    };
  },
};

export const monthlySummaryService = {
  getAllSummaries: async (): Promise<MonthlySummary[]> => {
    const response = await apiClient.get('/api/monthly-summary');
    return response.data?.data || response.data;
  },

  getMonthlySummary: async (month: number, year: number): Promise<MonthlySummary> => {
    const response = await apiClient.get(`/api/monthly-summary/${month}/${year}`);
    return response.data?.data || response.data;
  },

  calculateCurrentMonthSummary: async (): Promise<MonthlySummary> => {
    const response = await apiClient.post('/api/monthly-summary/calculate');
    return response.data?.data || response.data;
  },
};
