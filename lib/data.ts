import { Member, CompanyAccount } from './types';

export const MEMBER_NAMES = [
  'Rehaan',
  'Ayaan',
  'Ahesham',
  'Quaid',
  'Sohail',
  'Waliullah',
  'Awais',
] as const;

export const MEMBER_COUNT = 7;

export function createInitialMembers(): Member[] {
  return MEMBER_NAMES.map((name, index) => ({
    id: index + 1,
    name,
    totalOwed: 0,
    totalPaid: 0,
    balance: 0,
    isPaid: false,
    paymentHistory: [],
  }));
}

export function createInitialCompany(): CompanyAccount {
  return {
    availableBalance: 0,
    totalDeposited: 0,
    totalSpent: 0,
    depositHistory: [],
    expensesCovered: [],
  };
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
