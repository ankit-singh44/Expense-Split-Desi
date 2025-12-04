import React from 'react';
import { Participant, Settlement, SettlementSummary, Expense } from '../types';
import { ArrowRight, Share2, Wallet } from 'lucide-react';
import { generateWhatsAppSummary } from '../utils/splitter';

interface SettlementViewProps {
  summary: SettlementSummary;
  participants: Participant[];
  expenses: Expense[];
}

const SettlementView: React.FC<SettlementViewProps> = ({ summary, participants, expenses }) => {
  const getParticipantName = (id: string) => participants.find(p => p.id === id)?.name || 'Unknown';

  const handleShare = () => {
    const text = generateWhatsAppSummary(participants, summary.settlements, expenses);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  if (expenses.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="w-5 h-5 text-primary-400" />
        <h2 className="text-lg font-semibold">Settlement</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <p className="text-xs text-gray-400 mb-1">Total Spent</p>
            <p className="text-2xl font-bold">₹{summary.totalSpent.toFixed(2)}</p>
         </div>
         <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
            <p className="text-xs text-gray-400 mb-1">Transactions</p>
            <p className="text-2xl font-bold">{summary.settlements.length}</p>
         </div>
      </div>

      <div className="space-y-3 mb-6">
        {summary.settlements.length === 0 ? (
           <div className="text-center py-4 bg-white/5 rounded-xl border border-white/10 border-dashed">
             <p className="text-gray-300 font-medium">All settled up! 🎉</p>
             <p className="text-xs text-gray-500 mt-1">No one owes anything.</p>
           </div>
        ) : (
            summary.settlements.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-red-300">{getParticipantName(s.fromId)}</span>
                <span className="text-gray-500 text-xs">owes</span>
                <span className="font-semibold text-green-300">{getParticipantName(s.toId)}</span>
                </div>
                <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-gray-500" />
                <span className="font-bold">₹{s.amount.toFixed(2)}</span>
                </div>
            </div>
            ))
        )}
      </div>

      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-green-900/20 active:scale-[0.98]"
      >
        <Share2 className="w-4 h-4" />
        Send to WhatsApp
      </button>
    </div>
  );
};

export default SettlementView;