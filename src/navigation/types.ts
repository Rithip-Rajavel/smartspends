export type RootStackParamList = {
  MainTabs: undefined;
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Income: undefined;
  Expenses: undefined;
  Savings: undefined;
  Comparison: undefined;
  AddIncome: { incomeId?: number };
  AddExpense: { expenseId?: number };
  IncomeDetail: { incomeId: number };
  ExpenseDetail: { expenseId: number };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Income: undefined;
  Expenses: undefined;
  Savings: undefined;
  Comparison: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
