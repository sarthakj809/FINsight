import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
  addExpense,
  addIncome,
  deleteExpense,
  deleteIncome,
  getDashboard,
  getExpenses,
  getIncomes,
  loginUser,
  registerUser,
  updateExpense,
  updateIncome,
  downloadExpenseExcel,
  downloadIncomeExcel,
  getCurrentUser,
  updatePassword,
  updateProfile,
} from './api.js';
import Layout from './components/Layout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import IncomePage from './pages/IncomePage.jsx';
import ExpensePage from './pages/ExpensePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';
import UpdatePasswordPage from './pages/UpdatePasswordPage.jsx';
import AIInsightsPage from './pages/AIInsightsPage.jsx';
import { formatCurrency, formatDate } from './utils/format.js';

const today = new Date().toISOString().slice(0, 10);

const initialTransactionForm = {
  description: '',
  amount: '',
  category: 'Other',
  date: today,
};

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [transactionForm, setTransactionForm] = useState(initialTransactionForm);
  const [editType, setEditType] = useState(null);
  const [editId, setEditId] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });

  const totalIncome = useMemo(
    () => incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [incomes]
  );

  const totalExpense = useMemo(
    () => expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [expenses]
  );

  useEffect(() => {
    if (!token) return;
    setMessage('');
    loadUser();
    loadDashboard();
    loadIncomes();
    loadExpenses();
  }, [token]);

  // clear transient messages when location changes so notifications don't persist across pages
  const location = useLocation();
  useEffect(() => {
    if (message) setMessage('');
  }, [location.pathname]);

  useEffect(() => {
    setProfileForm({ name: user?.name || '', email: user?.email || '' });
  }, [user]);

  const resetTransactionForm = () => {
    setTransactionForm(initialTransactionForm);
    setEditType(null);
    setEditId(null);
  };

  const startEditTransaction = (type, item) => {
    setEditType(type);
    setEditId(item._id);
    setTransactionForm({
      description: item.description,
      amount: item.amount,
      category: item.category,
      date: item.date ? item.date.slice(0, 10) : today,
    });
    setMessage(`Editing ${type} transaction.`);
  };

  const cancelEdit = () => {
    resetTransactionForm();
    setMessage('Edit cancelled.');
  };

  const handleResponse = async (promise) => {
    setLoading(true);
    try {
      const result = await promise;
      setLoading(false);
      if (result && result.success === false) {
        if (result.status === 401) {
          setMessage('Session expired or invalid token. Logging out.');
          handleLogout();
          return result;
        }
        setMessage(result.message || 'Unexpected error.');
      }
      return result;
    } catch (error) {
      setLoading(false);
      setMessage('Unable to connect to server.');
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await handleResponse(loginUser(authForm));
    if (result && result.success) {
      const { token: newToken, user: userData } = result;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setMessage('Logged in successfully.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await handleResponse(registerUser(authForm));
    if (result && result.success) {
      const { token: newToken, user: userData } = result;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setMessage('Account created successfully.');
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMessage('You have been logged out.');
  };

  const loadDashboard = async () => {
    const result = await handleResponse(getDashboard(token));
    if (result && result.success) {
      setDashboard(result.data);
    }
  };

  const loadIncomes = async () => {
    const result = await handleResponse(getIncomes(token));
    if (result && result.income) {
      setIncomes(result.income);
    }
  };

  const loadExpenses = async () => {
    const result = await handleResponse(getExpenses(token));
    if (result && result.expense) {
      setExpenses(result.expense);
    }
  };

  const loadUser = async () => {
    const result = await handleResponse(getCurrentUser(token));
    if (result && result.success && result.User) {
      setUser(result.User);
      setProfileForm({ name: result.User.name, email: result.User.email });
      localStorage.setItem('user', JSON.stringify(result.User));
    }
  };

  const handleSaveTransaction = async (type) => {
    const payload = {
      description: transactionForm.description,
      amount: Number(transactionForm.amount),
    };

    if (!payload.description || !payload.amount) {
      setMessage('Please fill description and amount.');
      return;
    }

    let result;
    if (editType === type && editId) {
      result = await handleResponse(
        type === 'income'
          ? updateIncome(editId, payload, token)
          : updateExpense(editId, payload, token)
      );
    } else {
      const fullPayload = {
        ...payload,
        category: transactionForm.category,
        date: transactionForm.date || today,
      };
      result = await handleResponse(type === 'income' ? addIncome(fullPayload, token) : addExpense(fullPayload, token));
    }

    if (result && result.success) {
      resetTransactionForm();
      const action = editType === type && editId ? 'updated' : 'added';
      setMessage(`${type === 'income' ? 'Income' : 'Expense'} ${action} successfully.`);
      if (type === 'income') loadIncomes();
      else loadExpenses();
      loadDashboard();
    }
  };

  const handleDelete = async (type, id) => {
    const result = await handleResponse(
      type === 'income' ? deleteIncome(id, token) : deleteExpense(id, token)
    );
    if (result && result.success) {
      setMessage('Transaction deleted.');
      if (type === 'income') loadIncomes();
      else loadExpenses();
      loadDashboard();
    }
  };

  const handleDownload = async (type) => {
    const result = await (type === 'income' ? downloadIncomeExcel(token) : downloadExpenseExcel(token));
    if (result && result.success && result.blob) {
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = type === 'income' ? 'income_details.xlsx' : 'expense_details.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage(`${type === 'income' ? 'Income' : 'Expense'} Excel downloaded.`);
      return;
    }
    setMessage(result.message || 'Unable to download file.');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const result = await handleResponse(updateProfile(profileForm, token));
    if (result && result.success) {
      setUser(result.updatedUser);
      localStorage.setItem('user', JSON.stringify(result.updatedUser));
      setMessage('Profile updated successfully.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const result = await handleResponse(
      updatePassword({ password: passwordForm.currentPassword, newpassword: passwordForm.newPassword }, token)
    );
    if (result && result.success) {
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setMessage('Password changed successfully.');
    }
  };

  if (!token) {
    return (
      <AuthPage
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        onSubmit={authMode === 'login' ? handleLogin : handleRegister}
        message={message}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} handleLogout={handleLogout} message={message} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <DashboardPage
              dashboard={dashboard}
              incomes={incomes}
              expenses={expenses}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          }
        />
        <Route
          path="income"
          element={
            <IncomePage
              transactionForm={transactionForm}
              setTransactionForm={setTransactionForm}
              onSubmit={() => handleSaveTransaction('income')}
              incomes={incomes}
              totalIncome={formatCurrency(totalIncome)}
              onDelete={(id) => handleDelete('income', id)}
              onEdit={(item) => startEditTransaction('income', item)}
              onDownload={handleDownload}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              editMode={editType === 'income'}
              onCancelEdit={cancelEdit}
            />
          }
        />
        <Route
          path="expense"
          element={
            <ExpensePage
              transactionForm={transactionForm}
              setTransactionForm={setTransactionForm}
              onSubmit={() => handleSaveTransaction('expense')}
              expenses={expenses}
              totalExpense={formatCurrency(totalExpense)}
              onDelete={(id) => handleDelete('expense', id)}
              onEdit={(item) => startEditTransaction('expense', item)}
              onDownload={handleDownload}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              editMode={editType === 'expense'}
              onCancelEdit={cancelEdit}
            />
          }
        />
        <Route
          path="ai-insights"
          element={
            <AIInsightsPage
              token={token}
              formatCurrency={formatCurrency}
            />
          }
        />
        <Route
          path="profile"
          element={
            <ProfilePage
              user={user}
              dashboard={dashboard}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              formatCurrency={formatCurrency}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              onProfileSubmit={handleProfileSubmit}
              onPasswordSubmit={handlePasswordSubmit}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="profile/edit"
          element={
            <EditProfilePage
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              onProfileSubmit={handleProfileSubmit}
            />
          }
        />
        <Route
          path="profile/password"
          element={
            <UpdatePasswordPage
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              onPasswordSubmit={handlePasswordSubmit}
            />
          }
        />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
