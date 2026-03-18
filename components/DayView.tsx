'use client';

import { Expense } from '@/lib/types';
import {
  getDayExpenses,
  getDayTotal,
  getDayCompanyCovered,
  getDayMemberSplit,
  getDayPerPerson,
} from '@/lib/calculations';
import { Building2 } from 'lucide-react';

interface DayViewProps {
  expenses: Expense[];
  day: 1 | 2;
}

export default function DayView({ expenses, day }: DayViewProps) {
  const dayExpenses = getDayExpenses(expenses, day);
  const total = getDayTotal(expenses, day);
  const companyCovered = getDayCompanyCovered(expenses, day);
  const memberSplit = getDayMemberSplit(expenses, day);
  const perPerson = getDayPerPerson(expenses, day);

  const dayLabel =
    day === 1
      ? '31st March (Night) → 1st April (Morning)'
      : '1st April (Evening) → 2nd April';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Day {day}</h3>
          <p className="text-xs text-gray-500">{dayLabel}</p>
        </div>
      </div>

      {dayExpenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <p className="text-lg">No expenses yet for Day {day}</p>
          <p className="text-sm mt-1">Click + to add an expense</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">
                    Expense
                  </th>
                  <th className="text-right py-3 px-3 text-gray-400 font-medium">
                    Amount
                  </th>
                  <th className="text-center py-3 px-3 text-gray-400 font-medium">
                    Paid By
                  </th>
                  <th className="text-right py-3 px-3 text-gray-400 font-medium">
                    Company
                  </th>
                  <th className="text-right py-3 px-3 text-gray-400 font-medium">
                    Member Split
                  </th>
                  <th className="text-right py-3 px-3 text-gray-400 font-medium">
                    Per Person
                  </th>
                </tr>
              </thead>
              <tbody>
                {dayExpenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      expense.companyContribution > 0
                        ? 'bg-amber-500/5'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-3 text-white font-medium">
                      {expense.name}
                      {expense.companyContribution > 0 &&
                        expense.memberSplitAmount > 0 && (
                          <p className="text-[10px] text-amber-400 mt-0.5">
                            ⚠️ Company covered ₹
                            {expense.companyContribution.toFixed(2)} — ₹
                            {expense.memberSplitAmount.toFixed(2)} split among
                            members
                          </p>
                        )}
                    </td>
                    <td className="py-3 px-3 text-right text-white font-semibold">
                      ₹{expense.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {expense.paidBy === 'COMPANY' ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold bg-amber-500/10 px-2 py-1 rounded-full">
                          <Building2 size={12} /> COMPANY
                        </span>
                      ) : (
                        <span className="text-gray-300">{expense.paidBy}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-amber-400">
                      ₹{expense.companyContribution.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-orange-300">
                      ₹{expense.memberSplitAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-white font-semibold">
                      ₹{expense.perPersonShare.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Day Totals */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Day Total</p>
              <p className="text-lg font-bold text-white">
                ₹{total.toFixed(2)}
              </p>
            </div>
            <div className="bg-amber-500/10 rounded-xl p-3 text-center border border-amber-500/20">
              <p className="text-xs text-amber-400/60 mb-1">Company Covered</p>
              <p className="text-lg font-bold text-amber-400">
                ₹{companyCovered.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Member Split</p>
              <p className="text-lg font-bold text-orange-300">
                ₹{memberSplit.toFixed(2)}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Per Person</p>
              <p className="text-lg font-bold text-white">
                ₹{perPerson.toFixed(2)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
