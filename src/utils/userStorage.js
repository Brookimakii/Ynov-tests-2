export function loadUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function addUser(users, newUser) {
  return [...users, newUser];
}