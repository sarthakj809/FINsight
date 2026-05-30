function UpdatePasswordPage({ passwordForm, setPasswordForm, onPasswordSubmit }) {
  return (
    <section className="dashboard profile-page">
      <div className="card form-card">
        <h2>Change Password</h2>
        <form onSubmit={onPasswordSubmit}>
          <label>
            Current password
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="Current password"
            />
          </label>
          <label>
            New password
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="New password"
            />
          </label>
          <button type="submit" className="primary">
            Change password
          </button>
        </form>
      </div>
    </section>
  );
}

export default UpdatePasswordPage;
