export interface Expense {
  id: string;
  name: string;
  amount: number;
  paidBy: string;
  companyContribution: number;
  memberSplitAmount: number;
  perPersonShare: number;
  day: 1 | 2;
  timestamp: string;
}

export interface Deposit {
  id: string;
  amount: number;
  note?: string;
  timestamp: string;
}

export interface CompanyAccount {
  availableBalance: number;
  totalDeposited: number;
  totalSpent: number;
  depositHistory: Deposit[];
  expensesCovered: string[];
}

export interface Payment {
  id: string;
  memberId: number;
  memberName: string;
  amountPaid: number;
  day: 1 | 2;
  timestamp: string;
}

export interface Member {
  id: number;
  name: string;
  totalOwed: number;
  totalPaid: number;
  balance: number;
  isPaid: boolean;
  paymentHistory: Payment[];
}

export interface AppState {
  company: CompanyAccount;
  members: Member[];
  expenses: Expense[];
  activeDay: 1 | 2 | 'summary';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
