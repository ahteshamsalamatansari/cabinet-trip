'use client';

import { Building2, Plus, ChevronDown, ChevronUp, Wallet } from 'lucide-react';
import { CompanyAccount, Expense } from '@/lib/types';
import { useState } from 'react';

interface CompanyCardProps {
  company: CompanyAccount;
  expenses: Expense[];
  onDeposit: () => void;
}

export default function CompanyCard({
  company,
  expenses,
  onDeposit,
}: CompanyCardProps) {
  const [showDeposits, setShowDeposits] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);

  const companyExpenses = expenses.filter(
    (e) => e.companyContribution > 0
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-[#0f1629]/80 to-[#0f1629]/80 backdrop-blur-md p-6 shadow-2xl shadow-amber-500/10">
      {/* Golden shimmer accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Building2 className="text-amber-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">COMPANY</h3>
            <p className="text-xs text-amber-300/60">Sponsor Account</p>
          </div>
        </div>
        <button
          onClick={onDeposit}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl text-amber-300 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={16} />
          Deposit Funds
        </button>
      </div>

      {/* Balance */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Available</p>
          <p
            className={`text-xl font-bold ${
              company.availableBalance > 0
                ? 'text-amber-400'
                : 'text-red-500'
            }`}
          >
            ₹{company.availableBalance.toFixed(2)}
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Deposited</p>
          <p className="text-xl font-bold text-green-400">
            ₹{company.totalDeposited.toFixed(2)}
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Spent</p>
          <p className="text-xl font-bold text-orange-400">
            ₹{company.totalSpent.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Deposit History */}
      <div className="mb-2">
        <button
          onClick={() => setShowDeposits(!showDeposits)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full"
        >
          <Wallet size={14} />
          <span>Deposit History ({company.depositHistory.length})</span>
          {showDeposits ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showDeposits && (
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
            {company.depositHistory.length === 0 ? (
              <p className="text-xs text-gray-500 pl-6">No deposits yet</p>
            ) : (
              company.depositHistory.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-xs"
                >
                  <div>
                    <span className="text-green-400 font-semibold">
                      +₹{d.amount.toFixed(2)}
                    </span>
                    {d.note && (
                      <span className="text-gray-500 ml-2">— {d.note}</span>
                    )}
                  </div>
                  <span className="text-gray-600">
                    {new Date(d.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Expenses Covered */}
      <div>
        <button
          onClick={() => setShowExpenses(!showExpenses)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full"
        >
          <Building2 size={14} />
          <span>Expenses Covered ({companyExpenses.length})</span>
          {showExpenses ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showExpenses && (
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
            {companyExpenses.length === 0 ? (
              <p className="text-xs text-gray-500 pl-6">No expenses covered</p>
            ) : (
              companyExpenses.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 text-xs"
                >
                  <div>
                    <span className="text-white font-medium">{e.name}</span>
                    <span className="text-amber-400 ml-2">
                      ₹{e.companyContribution.toFixed(2)}
                    </span>
                    {e.memberSplitAmount > 0 && (
                      <span className="text-red-400 ml-1">
                        (+₹{e.memberSplitAmount.toFixed(2)} split)
                      </span>
                    )}
                  </div>
                  <span className="text-gray-600">Day {e.day}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
