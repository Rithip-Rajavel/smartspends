import apiClient from './axiosConfig';
import { SavingsAnalysis, InvestmentRecommendation } from '../types';

export const savingsService = {
  getSavings: async (): Promise<number> => {
    const response = await apiClient.get('/api/savings');
    return response.data?.data || response.data;
  },

  getRecommendations: async (): Promise<InvestmentRecommendation[]> => {
    const response = await apiClient.get('/api/savings/recommendations');
    const resData = response.data?.data || response.data;
    return Array.isArray(resData) ? resData : [];
  },

  getAnalysis: async (): Promise<SavingsAnalysis> => {
    const response = await apiClient.get('/api/savings/analysis');
    const resData = response.data?.data || response.data || {};
    return {
      totalSavings: resData.totalSavings || 0,
      monthlyAverage: resData.monthlyAverage || 0,
      savingsTrend: resData.savingsTrend || [],
      recommendations: resData.recommendations || []
    };
  },
};
