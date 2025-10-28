import { Expense } from '../models/Expense';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  AddExpense: undefined;
  ExpenseList: undefined;
  Profile: undefined;
};

export type ExpenseStackParamList = {
  ExpenseDetail: { expenseId: string };
  EditExpense: { expense: Expense };
};