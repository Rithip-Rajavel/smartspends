import apiClient from './axiosConfig';
import { IncomeRequestDTO, Income } from '../types';

export const incomeService = {
  getAllIncomes: async (): Promise<Income[]> => {
    const response = await apiClient.get('/api/incomes');
    return response.data;
  },

  addIncome: async (incomeData: IncomeRequestDTO): Promise<Income> => {
    const response = await apiClient.post('/api/incomes', incomeData);
    return response.data;
  },

  updateIncome: async (id: number, incomeData: IncomeRequestDTO): Promise<Income> => {
    const response = await apiClient.put(`/api/incomes/${id}`, incomeData);
    return response.data;
  },

  deleteIncome: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/incomes/${id}`);
  },

  getIncomesByMonth: async (month: number, year: number): Promise<Income[]> => {
    const response = await apiClient.get(`/api/incomes/month/${month}/year/${year}`);
    return response.data;
  },

  getCurrentMonthTotal: async (): Promise<number> => {
    const response = await apiClient.get('/api/incomes/current-month-total');
    return response.data;
  },
};
