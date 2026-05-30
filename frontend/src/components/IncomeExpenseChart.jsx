import { useMemo } from 'react';

function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function shortMonthLabel(key) {
  const [y, m] = key.split('-');
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleString(undefined, { month: 'short' });
}

function IncomeExpenseChart({ incomes = [], expenses = [], months = 6 }) {
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

  const max = Math.max(...incomeData, ...expenseData, 1);

  // compact responsive SVG: viewBox width is 360 to fit small screens, each month ~60px
  const vw = Math.max(360, labels.length * 60);

  return (
    <div className="card">
      <h2>Income vs Expense</h2>
      <div className="chart-wrap">
        <svg viewBox={`0 0 ${vw} 220`} preserveAspectRatio="xMidYMid meet" className="ie-chart">
          <g transform="translate(30,10)">
            {labels.map((lbl, idx) => {
              const x = idx * 60;
              const ih = (incomeData[idx] / max) * 140;
              const eh = (expenseData[idx] / max) * 140;
              return (
                <g key={lbl} transform={`translate(${x},0)`}> 
                  <rect x={6} y={160 - ih} width={18} height={ih} rx={4} fill="#2563eb" />
                  <rect x={30} y={160 - eh} width={18} height={eh} rx={4} fill="#ef4444" />
                  <text x={22} y={183} textAnchor="middle" fontSize={12} fill="#334155">{lbl}</text>
                </g>
              );
            })}
            <line x1={0} x2={labels.length * 60 - 10} y1={160} y2={160} stroke="#e6eef9" strokeWidth={1} />
          </g>
        </svg>
      </div>
      <div className="chart-legend">
        <span><span className="legend-dot income"/> Income</span>
        <span><span className="legend-dot expense"/> Expense</span>
      </div>
    </div>
  );
}

export default IncomeExpenseChart;
