import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Participant, Expense, Category } from '../types';
import { ArrowLeft, Trophy, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Explicitly register Chart.js components to ensure they are available
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface AnalyticsProps {
  expenses: Expense[];
  participants: Participant[];
}

const COLORS = {
  Food: '#f97316',    // Orange 500
  Travel: '#3b82f6',  // Blue 500
  Shopping: '#ec4899',// Pink 500
  Course: '#6366f1',  // Indigo 500
  Other: '#64748b',   // Slate 500
};

const Analytics: React.FC<AnalyticsProps> = ({ expenses, participants }) => {
  
  // 1. Calculate Category Totals
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = { Food: 0, Travel: 0, Shopping: 0, Course: 0, Other: 0 };
    expenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return totals;
  }, [expenses]);

  // 2. Calculate Who Paid What per Category
  const personCategorySpending = useMemo(() => {
    const data: Record<string, Record<string, number>> = {};
    participants.forEach(p => {
      data[p.id] = { Food: 0, Travel: 0, Shopping: 0, Course: 0, Other: 0 };
    });

    expenses.forEach(e => {
      if (data[e.payerId]) {
        data[e.payerId][e.category] += e.amount;
      }
    });
    return data;
  }, [expenses, participants]);

  // 3. Find Top Spender & Most Expensive Category
  const insights = useMemo(() => {
    let maxCategory = 'Food';
    let maxCatVal = 0;
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > maxCatVal) {
        maxCatVal = val;
        maxCategory = cat;
      }
    });

    const spenderTotals: Record<string, number> = {};
    expenses.forEach(e => {
      spenderTotals[e.payerId] = (spenderTotals[e.payerId] || 0) + e.amount;
    });
    
    let topSpenderId = participants[0]?.id;
    let maxSpend = 0;
    Object.entries(spenderTotals).forEach(([id, val]) => {
      if (val > maxSpend) {
        maxSpend = val;
        topSpenderId = id;
      }
    });

    return { maxCategory, maxCatVal, topSpenderId, maxSpend };
  }, [categoryTotals, expenses, participants]);


  // Chart Data Configurations
  const doughnutData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(k => COLORS[k as Category]),
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: participants.map(p => p.name),
    datasets: Object.keys(COLORS).map(cat => ({
      label: cat,
      data: participants.map(p => personCategorySpending[p.id]?.[cat] || 0),
      backgroundColor: COLORS[cat as Category],
      borderRadius: 4,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, grid: { color: '#f3f4f6' } },
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">No Data Yet</h2>
        <p className="text-gray-500 mb-6">Add some expenses to see analytics.</p>
        <Link to="/" className="text-primary-600 font-semibold hover:underline">Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100 px-4 py-4 mb-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
             <Link to="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
             </Link>
             <h1 className="text-xl font-bold text-gray-900">Spending Insights</h1>
         </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-6">
        
        {/* Insights Cards */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-20"><Trophy className="w-12 h-12" /></div>
                <p className="text-indigo-100 text-xs font-medium uppercase tracking-wider mb-1">Top Spender</p>
                <p className="text-2xl font-bold">{participants.find(p => p.id === insights.topSpenderId)?.name || 'N/A'}</p>
                <p className="text-sm opacity-90">₹{insights.maxSpend.toFixed(0)}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">Highest Category</p>
                <p className="text-2xl font-bold text-gray-800" style={{ color: COLORS[insights.maxCategory as Category] }}>{insights.maxCategory}</p>
                <p className="text-sm text-gray-500">₹{insights.maxCatVal.toFixed(0)}</p>
            </div>
        </div>

        {/* Breakdown Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Total Spending by Category</h3>
            <div className="h-64 flex justify-center">
                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            </div>
        </div>

        {/* Stacked Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Who Spent on What?</h3>
            <div className="h-64">
                <Bar data={barData} options={chartOptions} />
            </div>
        </div>

        {/* Detailed List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                 <h3 className="font-bold text-gray-800">Category Breakdown</h3>
             </div>
             <div className="divide-y divide-gray-50">
                 {Object.entries(categoryTotals).map(([cat, amount]) => (
                     amount > 0 && (
                        <div key={cat} className="px-6 py-4 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[cat as Category] }}></div>
                                 <span className="font-medium text-gray-700">{cat}</span>
                             </div>
                             <span className="font-bold text-gray-900">₹{amount.toFixed(2)}</span>
                        </div>
                     )
                 ))}
             </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;