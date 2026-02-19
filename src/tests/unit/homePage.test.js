import { render, screen } from "@testing-library/react";
import HomePage from "../../pages/HomePage";

describe("HomePage rendering and pluralization", () => {
  test("renders 0 users message", () => {
    render(<HomePage users={[]} />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test("renders singular when 1 user", () => {
    render(<HomePage users={[{ firstName: "A", lastName: "B", email: "a@b" }]} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    const list = screen.getByRole("list");
    expect(list.querySelectorAll("li").length).toBe(1);
  });

  test("renders plural when multiple users", () => {
    render(
      <HomePage users={[{ firstName: "A", lastName: "B", email: "a@b" }, { firstName: "C", lastName: "D", email: "c@d" }]} />
    );
    expect(screen.getByText("2")).toBeInTheDocument();
    const list = screen.getByRole("list");
    expect(list.querySelectorAll("li").length).toBe(2);
  });
});
