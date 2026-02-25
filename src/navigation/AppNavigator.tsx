import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import IncomeScreen from '../screens/Income/IncomeScreen';
import ExpensesScreen from '../screens/Expenses/ExpensesScreen';
import SavingsScreen from '../screens/Savings/SavingsScreen';
import ComparisonScreen from '../screens/Comparison/ComparisonScreen';
import AddIncomeScreen from '../screens/Income/AddIncomeScreen';
import AddExpenseScreen from '../screens/Expenses/AddExpenseScreen';
import IncomeDetailScreen from '../screens/Income/IncomeDetailScreen';
import ExpenseDetailScreen from '../screens/Expenses/ExpenseDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Income':
              iconName = 'account-balance-wallet';
              break;
            case 'Expenses':
              iconName = 'shopping-cart';
              break;
            case 'Savings':
              iconName = 'savings';
              break;
            case 'Comparison':
              iconName = 'compare-arrows';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Income"
        component={IncomeScreen}
        options={{ title: 'Income' }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{ title: 'Expenses' }}
      />
      <Tab.Screen
        name="Savings"
        component={SavingsScreen}
        options={{ title: 'Savings' }}
      />
      <Tab.Screen
        name="Comparison"
        component={ComparisonScreen}
        options={{ title: 'Comparison' }}
      />
    </Tab.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <AuthProvider>
      <AppNavigatorContent />
    </AuthProvider>
  );
};

const AppNavigatorContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen
            name="AddIncome"
            component={AddIncomeScreen}
            options={{
              headerShown: true,
              title: 'Add Income',
              headerStyle: { backgroundColor: '#6200ee' },
              headerTintColor: '#fff'
            }}
          />
          <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{
              headerShown: true,
              title: 'Add Expense',
              headerStyle: { backgroundColor: '#6200ee' },
              headerTintColor: '#fff'
            }}
          />
          <Stack.Screen
            name="IncomeDetail"
            component={IncomeDetailScreen}
            options={{
              headerShown: true,
              title: 'Income Details',
              headerStyle: { backgroundColor: '#6200ee' },
              headerTintColor: '#fff'
            }}
          />
          <Stack.Screen
            name="ExpenseDetail"
            component={ExpenseDetailScreen}
            options={{
              headerShown: true,
              title: 'Expense Details',
              headerStyle: { backgroundColor: '#6200ee' },
              headerTintColor: '#fff'
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
