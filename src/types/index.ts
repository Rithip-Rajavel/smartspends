export interface LoginRequestDTO {
  mobileNumber: string;
  password: string;
}

export interface RegistrationRequestDTO {
  username: string;
  password: string;
  mobileNumber: string;
  email?: string;
}

export interface IncomeRequestDTO {
  amount: number;
  source: string;
  month: number;
  year: number;
  description?: string;
}

export interface ExpenseRequestDTO {
  amount: number;
  category: ExpenseCategory;
  paymentMode: PaymentMode;
  description?: string;
}

export enum ExpenseCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  BILLS = 'BILLS',
  SHOPPING = 'SHOPPING',
  HEALTHCARE = 'HEALTHCARE',
  MISCELLANEOUS = 'MISCELLANEOUS'
}

export enum PaymentMode {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  NET_BANKING = 'NET_BANKING',
  OTHER = 'OTHER'
}

export interface Income {
  id: number;
  amount: number;
  source: string;
  month: number;
  year: number;
  description?: string;
  createdAt: string;
}

export interface Expense {
  id: number;
  amount: number;
  category: ExpenseCategory;
  paymentMode: PaymentMode;
  description?: string;
  createdAt: string;
}

export interface MonthlySummary {
  id: number;
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  createdAt: string;
}

export interface Dashboard {
  currentMonthIncome: number;
  currentMonthExpenses: number;
  currentMonthSavings: number;
  totalSavings: number;
  recentTransactions: (Income | Expense)[];
  expenseBreakdown: {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }[];
}

export interface SavingsAnalysis {
  totalSavings: number;
  monthlyAverage: number;
  savingsTrend: {
    month: string;
    amount: number;
  }[];
  recommendations: string[];
}

export interface InvestmentRecommendation {
  type: string;
  description: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedReturns: string;
  minInvestment: number;
}

export interface MonthlyComparison {
  currentMonth: {
    income: number;
    expenses: number;
    savings: number;
  };
  previousMonth: {
    income: number;
    expenses: number;
    savings: number;
  };
  percentageChanges: {
    income: number;
    expenses: number;
    savings: number;
  };
  categoryComparisons: {
    category: ExpenseCategory;
    currentAmount: number;
    previousAmount: number;
    change: number;
  }[];
}
