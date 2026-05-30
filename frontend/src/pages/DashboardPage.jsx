import ChartjsIncomeExpense from '../components/ChartjsIncomeExpense.jsx';

function DashboardPage({ dashboard, incomes, expenses, formatCurrency, formatDate }) {
  return (
    <section className="dashboard">
      <div className="card stats-card">
        <h2>Monthly Summary</h2>
        <div className="stats-grid">
          <div>
            <h3>{dashboard?.monthlyIncome != null ? formatCurrency(dashboard.monthlyIncome) : '-'}</h3>
            <p>Total Income</p>
          </div>
          <div>
            <h3>{dashboard?.monthlyExpense != null ? formatCurrency(dashboard.monthlyExpense) : '-'}</h3>
            <p>Total Expense</p>
          </div>
          <div>
            <h3>{dashboard?.savings != null ? formatCurrency(dashboard.savings) : '-'}</h3>
            <p>Savings</p>
          </div>
          <div>
            <h3>{dashboard?.savingsRate != null ? `${dashboard.savingsRate}%` : '-'}</h3>
            <p>Savings Rate</p>
          </div>
        </div>
      </div>

      <div className="card overview-card">
        <h2>Recent Activity</h2>
        {dashboard?.recentTransactions?.length ? (
          <div className="list">
            {dashboard.recentTransactions.slice(0, 6).map((item) => (
              <div key={item._id} className="list-item">
                <div>
                  <strong>{item.description}</strong>
                  <p>{item.category} • {formatDate(item.date)}</p>
                </div>
                <span className={item.type === 'income' ? 'positive' : 'negative'}>
                  {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>No transactions yet.</p>
        )}
      </div>
      <ChartjsIncomeExpense incomes={incomes} expenses={expenses} months={6} />
    </section>
  );
}

export default DashboardPage;
