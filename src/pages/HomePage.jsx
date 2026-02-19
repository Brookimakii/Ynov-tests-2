const HomePage = ({ users }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome</h1>
      <p>
        <strong>{users.length}</strong> utilisateur{users.length > 1 ? "s" : ""} inscrit{users.length > 1 ? "s" : ""}
      </p>
      {users.length > 0 && (
        <ul id="user-list">
          {users.map((user, i) => (
            <li key={i}>
              {user.firstName} {user.lastName} — {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
