import { loadUsers, saveUsers, addUser } from "../../utils/userStorage";

describe("userStorage utils", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
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
