import { NavigatorScreenParams } from '@react-navigation/native';
import { Expense } from '../models/Expense';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type ExpenseStackParamList = {
  ExpenseListMain: undefined;
  ExpenseDetail: { expenseId: string };
  EditExpense: { expense: Expense };
};

export type MainTabParamList = {
  Home: undefined;
  AddExpense: undefined;
  ExpenseList: NavigatorScreenParams<ExpenseStackParamList>;
  Profile: undefined;
};