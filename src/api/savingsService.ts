import apiClient from './axiosConfig';
import { SavingsAnalysis, InvestmentRecommendation } from '../types';

export const savingsService = {
  getSavings: async (): Promise<number> => {
    const response = await apiClient.get('/api/savings');
    return response.data;
  },

  getRecommendations: async (): Promise<InvestmentRecommendation[]> => {
    const response = await apiClient.get('/api/savings/recommendations');
    return response.data;
  },

  getAnalysis: async (): Promise<SavingsAnalysis> => {
    const response = await apiClient.get('/api/savings/analysis');
    return response.data;
  },
};
