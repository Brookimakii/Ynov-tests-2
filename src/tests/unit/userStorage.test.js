import { loadUsers, saveUsers, addUser } from "../../utils/userStorage";

describe("userStorage utils", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("loadUsers returns null when no user is stored", () => {
    expect(loadUsers()).toEqual([]);
  });

  test("loadUsers returns the saved users correctly", () => {
    const mockUsers = [{ name: "A" }];
    localStorage.setItem("users", JSON.stringify(mockUsers));

    const loadedUsers = loadUsers();

    expect(loadedUsers).toEqual(mockUsers);
  });

  test("saveUsers stores users in localStorage and loadUsers retrieves them", () => {
    const users = [{ name: "A" }];
    saveUsers(users);
    expect(localStorage.getItem("users")).toBe(JSON.stringify(users));
    expect(loadUsers()).toEqual(users);
  });

  test("addUser returns new array with appended user", () => {
    const before = [{ name: "A" }];
    const after = addUser(before, { name: "B" });
    expect(after).toEqual([{ name: "A" }, { name: "B" }]);
    // original array must remain unchanged
    expect(before).toEqual([{ name: "A" }]);
  });
});
