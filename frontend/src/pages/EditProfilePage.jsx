function EditProfilePage({ profileForm, setProfileForm, onProfileSubmit }) {
  return (
    <section className="dashboard profile-page">
      <div className="card form-card">
        <h2>Edit Profile</h2>
        <form onSubmit={onProfileSubmit}>
          <label>
            Name
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              placeholder="Your name"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <button type="submit" className="primary">
            Save profile
          </button>
        </form>
      </div>
    </section>
  );
}

export default EditProfilePage;
