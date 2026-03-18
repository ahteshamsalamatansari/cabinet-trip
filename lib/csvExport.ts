import { CompanyAccount, Expense, Member } from './types';

export function generateCSV(
  expenses: Expense[],
  company: CompanyAccount,
  members: Member[]
): string {
  const lines: string[] = [];

  lines.push('Trip Expense Report - Cabinet Trip 2026');
  lines.push(`Generated On: ${new Date().toLocaleString()}`);
  lines.push('');

  // Expense Log
  lines.push('=== EXPENSE LOG ===');
  lines.push(
    'ID,Name,Amount (₹),Paid By,Company Covered (₹),Member Split (₹),Per Person (₹),Day,Timestamp'
  );
  expenses.forEach((e) => {
    lines.push(
      `${e.id},"${e.name}",${e.amount.toFixed(2)},${e.paidBy},${e.companyContribution.toFixed(2)},${e.memberSplitAmount.toFixed(2)},${e.perPersonShare.toFixed(2)},Day ${e.day},${e.timestamp}`
    );
  });
  lines.push('');

  // Company Account
  lines.push('=== COMPANY ACCOUNT ===');
  lines.push('Total Deposited (₹),Total Spent (₹),Remaining Balance (₹)');
  lines.push(
    `${company.totalDeposited.toFixed(2)},${company.totalSpent.toFixed(2)},${company.availableBalance.toFixed(2)}`
  );
  lines.push('');

  // Deposit History
  lines.push('=== COMPANY DEPOSIT HISTORY ===');
  lines.push('Amount (₹),Note,Timestamp');
  company.depositHistory.forEach((d) => {
    lines.push(`${d.amount.toFixed(2)},"${d.note || ''}",${d.timestamp}`);
  });
  lines.push('');

  // Member Balances
  lines.push('=== MEMBER BALANCES ===');
  lines.push('Member,Total Owed (₹),Total Paid (₹),Outstanding (₹),Status');
  members.forEach((m) => {
    lines.push(
      `${m.name},${m.totalOwed.toFixed(2)},${m.totalPaid.toFixed(2)},${m.balance.toFixed(2)},${m.isPaid ? 'Paid' : 'Unpaid'}`
    );
  });
  lines.push('');

  // Payment History
  lines.push('=== PAYMENT HISTORY ===');
  lines.push('Member,Amount Paid (₹),Day,Timestamp');
  members.forEach((m) => {
    m.paymentHistory.forEach((p) => {
      lines.push(
        `${p.memberName},${p.amountPaid.toFixed(2)},Day ${p.day},${p.timestamp}`
      );
    });
  });

  return lines.join('\n');
}

export function downloadCSV(csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `trip-expenses-${date}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
