const HomePage = ({ users }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome</h1>
      <p>
        <strong>{users.length}</strong> people registered.
      </p>
    </div>
  );
};

export default HomePage;
