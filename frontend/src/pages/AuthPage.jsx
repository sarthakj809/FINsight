function AuthPage({ authMode, setAuthMode, authForm, setAuthForm, onSubmit, message }) {
  return (
    <div className="app auth-page">
      <div className="card auth-card">
        <h1>FINsight</h1>
        <div className="tabs">
          <button
            className={authMode === 'login' ? 'active' : ''}
            onClick={() => setAuthMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={authMode === 'register' ? 'active' : ''}
            onClick={() => setAuthMode('register')}
            type="button"
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {authMode === 'register' && (
            <label>
              Name
              <input
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                placeholder="Full name"
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              placeholder="Password"
            />
          </label>
          <button type="submit" className="primary">
            {authMode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        {message && <div className="message">{message}</div>}
        <p className="hint">Use the same account to manage incomes and expenses.</p>
      </div>
    </div>
  );
}

export default AuthPage;
