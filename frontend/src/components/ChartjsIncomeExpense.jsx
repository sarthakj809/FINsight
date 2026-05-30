import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useMemo } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function shortMonthLabel(key) {
  const [y, m] = key.split('-');
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleString(undefined, { month: 'short' });
}

export default function ChartjsIncomeExpense({ incomes = [], expenses = [], months = 6 }) {
  const { labels, incomeData, expenseData } = useMemo(() => {
    const map = new Map();
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, { income: 0, expense: 0 });
    }

    (incomes || []).forEach((it) => {
      if (!it.date) return;
      const key = monthKey(it.date);
      if (!map.has(key)) return;
      map.get(key).income += Number(it.amount || 0);
    });

    (expenses || []).forEach((it) => {
      if (!it.date) return;
      const key = monthKey(it.date);
      if (!map.has(key)) return;
      map.get(key).expense += Number(it.amount || 0);
    });

    const labels = Array.from(map.keys()).map(shortMonthLabel);
    const incomeData = Array.from(map.values()).map((v) => v.income);
    const expenseData = Array.from(map.values()).map((v) => v.expense);
    return { labels, incomeData, expenseData };
  }, [incomes, expenses, months]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#2563eb',
        borderRadius: 8,
        barPercentage: 0.5,
      },
      {
        label: 'Expense',
        data: expenseData,
        backgroundColor: '#ef4444',
        borderRadius: 8,
        barPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { stacked: false, grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  return (
    <div className="card">
      <h2>Income vs Expense</h2>
      <div className="chart-wrap" style={{ height: 260 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
