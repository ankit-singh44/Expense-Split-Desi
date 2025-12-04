import React from 'react';
import { Expense, Participant, Category } from '../types';
import { Trash2, History, Utensils, Plane, ShoppingBag, GraduationCap, MoreHorizontal } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  participants: Participant[];
  onRemoveExpense: (id: string) => void;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  Food: <Utensils className="w-3.5 h-3.5" />,
  Travel: <Plane className="w-3.5 h-3.5" />,
  Shopping: <ShoppingBag className="w-3.5 h-3.5" />,
  Course: <GraduationCap className="w-3.5 h-3.5" />,
  Other: <MoreHorizontal className="w-3.5 h-3.5" />,
};

const CATEGORY_STYLES: Record<Category, string> = {
  Food: 'bg-orange-50 text-orange-600 border-orange-100',
  Travel: 'bg-blue-50 text-blue-600 border-blue-100',
  Shopping: 'bg-pink-50 text-pink-600 border-pink-100',
  Course: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  Other: 'bg-gray-50 text-gray-600 border-gray-100',
};

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, participants, onRemoveExpense }) => {
  const getParticipantName = (id: string) => participants.find(p => p.id === id)?.name || 'Unknown';

  if (expenses.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white mt-8 mb-24 md:mb-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-gray-100 p-2 rounded-xl">
            <History className="w-5 h-5 text-gray-700" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
      </div>
      
      <div className="space-y-4">
        {expenses.slice().reverse().map((expense, index) => (
          <div 
            key={expense.id} 
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex gap-4 items-center flex-1">
                {/* Category Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${CATEGORY_STYLES[expense.category]}`}>
                    {CATEGORY_ICONS[expense.category]}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-800 truncate pr-2">{expense.description}</span>
                        <span className="font-bold text-gray-900 whitespace-nowrap">₹{expense.amount.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded-md">{getParticipantName(expense.payerId)}</span> 
                        paid
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="truncate max-w-[150px]">
                            {expense.involvedIds.length === participants.length ? 'Everyone' : 
                            expense.involvedIds.map(id => getParticipantName(id)).join(', ')}
                        </span>
                    </div>
                </div>
            </div>

            <button
              onClick={() => onRemoveExpense(expense.id)}
              className="ml-3 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100"
              title="Delete Expense"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;