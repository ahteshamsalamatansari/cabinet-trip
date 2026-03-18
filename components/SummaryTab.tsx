'use client';

import { CompanyAccount, Expense, Member } from '@/lib/types';
import { getTotalTripSpend } from '@/lib/calculations';
import { Building2, Users, TrendingUp } from 'lucide-react';

interface SummaryTabProps {
  expenses: Expense[];
  company: CompanyAccount;
  members: Member[];
}

export default function SummaryTab({
  expenses,
  company,
  members,
}: SummaryTabProps) {
  const totalSpend = getTotalTripSpend(expenses);
  const allSettled = members.every(
    (m) => m.balance <= 0 || m.totalOwed === 0
  );

  return (
    <div className="space-y-6">
      {/* Trip has ended banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/30 rounded-2xl p-6 text-center">
        <p className="text-2xl font-bold text-white mb-1">
          Trip has ended 🏁
        </p>
        <p className="text-sm text-amber-300/70">
          3rd April (Morning) — Settlement Day
        </p>
      </div>

      {allSettled && members.some((m) => m.totalOwed > 0) && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center animate-pulse">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-xl font-bold text-green-400">All Settled!</p>
          <p className="text-sm text-green-400/60 mt-1">
            Everyone has cleared their dues
          </p>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="text-blue-400" size={20} />
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Total Trip Spend
          </p>
          <p className="text-2xl font-bold text-white">
            ₹{totalSpend.toFixed(2)}
          </p>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
            <Building2 className="text-amber-400" size={20} />
          </div>
          <p className="text-xs text-amber-400/60 uppercase tracking-wider mb-1">
            Company Covered
          </p>
          <p className="text-2xl font-bold text-amber-400">
            ₹{company.totalSpent.toFixed(2)}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
            <Users className="text-purple-400" size={20} />
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
            Member Split Total
          </p>
          <p className="text-2xl font-bold text-white">
            ₹{(totalSpend - company.totalSpent).toFixed(2)}
          </p>
        </div>
      </div>

      {/* COMPANY Summary */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Building2 size={16} /> Company Summary
        </h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">Deposited</p>
            <p className="text-lg font-bold text-green-400">
              ₹{company.totalDeposited.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Spent</p>
            <p className="text-lg font-bold text-orange-400">
              ₹{company.totalSpent.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Remaining</p>
            <p
              className={`text-lg font-bold ${
                company.availableBalance > 0
                  ? 'text-amber-400'
                  : 'text-red-500'
              }`}
            >
              ₹{company.availableBalance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Who Owes What */}
      <div>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Users size={16} /> Who Owes What
        </h4>
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-xs font-bold">
                  {member.name.charAt(0)}
                </div>
                <span className="text-white font-medium">{member.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-bold ${
                    member.balance > 0 ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  ₹{member.balance.toFixed(2)}
                </span>
                {member.isPaid ? (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                    Paid ✓
                  </span>
                ) : member.balance > 0 ? (
                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                    Owes
                  </span>
                ) : (
                  <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full">
                    Clear
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
