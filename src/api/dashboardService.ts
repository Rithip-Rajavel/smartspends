import apiClient from './axiosConfig';
import { Dashboard, MonthlyComparison, MonthlySummary } from '../types';

export const dashboardService = {
  getDashboard: async (): Promise<Dashboard> => {
    const response = await apiClient.get('/api/dashboard');
    return response.data;
  },

  getMonthlyComparison: async (): Promise<MonthlyComparison> => {
    const response = await apiClient.get('/api/dashboard/comparison');
    return response.data;
  },
};

export const monthlySummaryService = {
  getAllSummaries: async (): Promise<MonthlySummary[]> => {
    const response = await apiClient.get('/api/monthly-summary');
    return response.data;
  },

  getMonthlySummary: async (month: number, year: number): Promise<MonthlySummary> => {
    const response = await apiClient.get(`/api/monthly-summary/${month}/${year}`);
    return response.data;
  },

  calculateCurrentMonthSummary: async (): Promise<MonthlySummary> => {
    const response = await apiClient.post('/api/monthly-summary/calculate');
    return response.data;
  },
};
