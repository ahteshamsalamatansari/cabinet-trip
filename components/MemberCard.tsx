'use client';

import { User, Check, Undo2, ChevronDown, ChevronUp } from 'lucide-react';
import { Member } from '@/lib/types';
import { useState } from 'react';

interface MemberCardProps {
  member: Member;
  onMarkPaid: (memberId: number) => void;
  onUndoPaid: (memberId: number) => void;
}

const avatarColors = [
  'from-rose-500 to-pink-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-yellow-500 to-amber-600',
];

export default function MemberCard({
  member,
  onMarkPaid,
  onUndoPaid,
}: MemberCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const colorIndex = (member.id - 1) % avatarColors.length;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[colorIndex]} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
          >
            {member.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-white font-semibold">{member.name}</h4>
            <div className="flex items-center gap-2">
              {member.isPaid ? (
                <span className="inline-flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                  <Check size={10} /> Paid
                </span>
              ) : member.totalOwed > 0 ? (
                <span className="inline-flex items-center text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                  Unpaid
                </span>
              ) : (
                <span className="inline-flex items-center text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full border border-white/10">
                  No dues
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Owed</p>
          <p className="text-sm font-bold text-orange-400">
            ₹{member.totalOwed.toFixed(2)}
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Paid</p>
          <p className="text-sm font-bold text-green-400">
            ₹{member.totalPaid.toFixed(2)}
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Balance</p>
          <p
            className={`text-sm font-bold ${
              member.balance > 0 ? 'text-red-400' : 'text-green-400'
            }`}
          >
            ₹{member.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {member.isPaid ? (
          <button
            onClick={() => onUndoPaid(member.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 rounded-xl text-gray-300 text-sm font-medium transition-all"
          >
            <Undo2 size={14} />
            Undo Payment
          </button>
        ) : (
          <button
            onClick={() => onMarkPaid(member.id)}
            disabled={member.balance <= 0}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-300 text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Check size={14} />
            Mark as Paid
          </button>
        )}
      </div>

      {/* Payment History */}
      {member.paymentHistory.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <span>Payment History ({member.paymentHistory.length})</span>
            {showHistory ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showHistory && (
            <div className="mt-2 space-y-1">
              {member.paymentHistory.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between bg-white/5 rounded-lg px-2 py-1 text-xs"
                >
                  <span className="text-green-400">
                    ₹{p.amountPaid.toFixed(2)}
                  </span>
                  <span className="text-gray-600">
                    {new Date(p.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
