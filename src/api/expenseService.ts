import apiClient from './axiosConfig';
import { ExpenseRequestDTO, Expense, ExpenseCategory } from '../types';

export const expenseService = {
  getAllExpenses: async (): Promise<Expense[]> => {
    const response = await apiClient.get('/api/expenses');
    return response.data?.data || response.data;
  },

  addExpense: async (expenseData: ExpenseRequestDTO): Promise<Expense> => {
    const response = await apiClient.post('/api/expenses', expenseData);
    return response.data?.data || response.data;
  },

  updateExpense: async (id: number, expenseData: ExpenseRequestDTO): Promise<Expense> => {
    const response = await apiClient.put(`/api/expenses/${id}`, expenseData);
    return response.data?.data || response.data;
  },

  deleteExpense: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/expenses/${id}`);
  },

  getExpensesByCategory: async (category: ExpenseCategory): Promise<Expense[]> => {
    const response = await apiClient.get(`/api/expenses/category/${category}`);
    return response.data?.data || response.data;
  },

  getExpensesByDateRange: async (startDate: string, endDate: string): Promise<Expense[]> => {
    const response = await apiClient.get('/api/expenses/date-range', {
      params: { start: startDate, end: endDate }
    });
    return response.data?.data || response.data;
  },

  getCurrentMonthTotal: async (): Promise<number> => {
    const response = await apiClient.get('/api/expenses/current-month-total');
    return response.data?.data || response.data;
  },
};
