import { Link } from 'react-router-dom';

function ProfilePage({ user, dashboard, totalIncome, totalExpense, formatCurrency, profileForm, setProfileForm, passwordForm, setPasswordForm, onProfileSubmit, onPasswordSubmit, onLogout }) {
  return (
    <section className="dashboard profile-page">
      <div className="card stats-card">
        <h2>Profile</h2>
        <div className="stats-grid">
          <div>
            <h3>{user?.name || '—'}</h3>
            <p>Name</p>
          </div>
          <div>
            <h3>{user?.email || '—'}</h3>
            <p>Email</p>
          </div>
          <div>
            <h3>{formatCurrency(totalIncome)}</h3>
            <p>Total Income</p>
          </div>
          <div>
            <h3>{formatCurrency(totalExpense)}</h3>
            <p>Total Expense</p>
          </div>
        </div>
        <div className="profile-actions">
          <Link to="edit" className="primary">Edit profile</Link>
          <Link to="password" className="secondary">Change password</Link>
        </div>
      </div>

      <div className="card overview-card">
        <h2>Account Summary</h2>
        <div className="list">
          <div className="list-item">
            <div>
              <strong>Monthly Income</strong>
              <p>{dashboard?.monthlyIncome != null ? formatCurrency(dashboard.monthlyIncome) : '—'}</p>
            </div>
          </div>
          <div className="list-item">
            <div>
              <strong>Monthly Expense</strong>
              <p>{dashboard?.monthlyExpense != null ? formatCurrency(dashboard.monthlyExpense) : '—'}</p>
            </div>
          </div>
          <div className="list-item">
            <div>
              <strong>Savings</strong>
              <p>{dashboard?.savings != null ? formatCurrency(dashboard.savings) : '—'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-page-footer">
        <button type="button" className="logout-profile-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </section>
  );
}

export default ProfilePage;
