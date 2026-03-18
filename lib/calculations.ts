import { CompanyAccount, Expense, Member } from './types';
import { MEMBER_COUNT } from './data';

export interface ExpenseResult {
  companyContribution: number;
  memberSplitAmount: number;
  perPersonShare: number;
  newCompanyBalance: number;
  isPartial: boolean;
  isFullCompany: boolean;
}

export function calculateExpenseSplit(
  amount: number,
  paidBy: string,
  companyBalance: number
): ExpenseResult {
  if (paidBy === 'COMPANY') {
    if (companyBalance >= amount) {
      return {
        companyContribution: amount,
        memberSplitAmount: 0,
        perPersonShare: 0,
        newCompanyBalance: companyBalance - amount,
        isPartial: false,
        isFullCompany: true,
      };
    } else if (companyBalance > 0) {
      const shortfall = amount - companyBalance;
      return {
        companyContribution: companyBalance,
        memberSplitAmount: shortfall,
        perPersonShare: Math.round((shortfall / MEMBER_COUNT) * 100) / 100,
        newCompanyBalance: 0,
        isPartial: true,
        isFullCompany: false,
      };
    } else {
      return {
        companyContribution: 0,
        memberSplitAmount: amount,
        perPersonShare: Math.round((amount / MEMBER_COUNT) * 100) / 100,
        newCompanyBalance: 0,
        isPartial: false,
        isFullCompany: false,
      };
    }
  }

  // Paid by a member — no company involvement
  return {
    companyContribution: 0,
    memberSplitAmount: amount,
    perPersonShare: Math.round((amount / MEMBER_COUNT) * 100) / 100,
    newCompanyBalance: companyBalance,
    isPartial: false,
    isFullCompany: false,
  };
}

export function recalculateMembers(
  members: Member[],
  expenses: Expense[]
): Member[] {
  return members.map((member) => {
    const totalOwed = expenses.reduce((sum, exp) => {
      return sum + exp.perPersonShare;
    }, 0);

    const totalPaid = member.paymentHistory.reduce(
      (sum, p) => sum + p.amountPaid,
      0
    );

    const balance = Math.round((totalOwed - totalPaid) * 100) / 100;

    return {
      ...member,
      totalOwed: Math.round(totalOwed * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      balance,
      isPaid: balance <= 0 && totalOwed > 0,
    };
  });
}

export function getDayExpenses(expenses: Expense[], day: 1 | 2): Expense[] {
  return expenses.filter((e) => e.day === day);
}

export function getDayTotal(expenses: Expense[], day: 1 | 2): number {
  return getDayExpenses(expenses, day).reduce((sum, e) => sum + e.amount, 0);
}

export function getDayCompanyCovered(expenses: Expense[], day: 1 | 2): number {
  return getDayExpenses(expenses, day).reduce(
    (sum, e) => sum + e.companyContribution,
    0
  );
}

export function getDayMemberSplit(expenses: Expense[], day: 1 | 2): number {
  return getDayExpenses(expenses, day).reduce(
    (sum, e) => sum + e.memberSplitAmount,
    0
  );
}

export function getDayPerPerson(expenses: Expense[], day: 1 | 2): number {
  return getDayExpenses(expenses, day).reduce(
    (sum, e) => sum + e.perPersonShare,
    0
  );
}

export function getTotalTripSpend(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}
