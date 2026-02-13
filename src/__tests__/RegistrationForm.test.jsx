import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrationForm from "../components/RegistrationForm";

describe("RegistrationForm Integration Tests", () => {
    beforeEach(() => localStorage.clear());

    test("shows errors for invalid inputs and clears them on correction", async () => {
        render(<RegistrationForm />);

        // submit empty form → all errors appear
        await userEvent.click(screen.getByRole("button", { name: /s'inscrire/i }));
        expect(screen.getByText(/^Nom invalide$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Prénom invalide$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Email invalide$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Date naissance invalide$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Ville invalide$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Code postal invalide$/i)).toBeInTheDocument();

        // type invalid names → errors still present
        await userEvent.type(screen.getByPlaceholderText(/^Nom$/i), "J");
        await userEvent.type(screen.getByPlaceholderText(/^Prénom$/i), "A");
        expect(screen.getByText(/^Nom invalide$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Prénom invalide$/i)).toBeInTheDocument();

        // correct names → errors disappear
        await userEvent.clear(screen.getByPlaceholderText(/^Nom$/i));
        await userEvent.type(screen.getByPlaceholderText(/^Nom$/i), "Doe");
        expect(screen.queryByText(/^Nom invalide$/i)).not.toBeInTheDocument();

        await userEvent.clear(screen.getByPlaceholderText(/^Prénom$/i));
        await userEvent.type(screen.getByPlaceholderText(/^Prénom$/i), "John");
        expect(screen.queryByText(/^Prénom invalide$/i)).not.toBeInTheDocument();
    });

    test("submit valid form and store person object in localStorage", async () => {
        render(<RegistrationForm />);

        await userEvent.type(screen.getByPlaceholderText(/^Nom$/i), "Doe");
        await userEvent.type(screen.getByPlaceholderText(/^Prénom$/i), "John");
        await userEvent.type(screen.getByPlaceholderText(/^Email$/i), "john@mail.com");

        const birthInput = screen.getByLabelText(/^registration-form$/i).querySelector('input[name="birthDate"]');
        fireEvent.change(birthInput, { target: { value: "2000-01-01" } });

        await userEvent.type(screen.getByPlaceholderText(/^Ville$/i), "Paris");
        await userEvent.type(screen.getByPlaceholderText(/^Code postal$/i), "75001");

        // button enabled
        const submitBtn = screen.getByRole("button", { name: /s'inscrire/i });
        expect(submitBtn).not.toBeDisabled();

        // submit
        await userEvent.click(submitBtn);

        // success message
        expect(screen.getByText(/^Utilisateur enregistré !/i)).toBeInTheDocument();

        // form cleared
        expect(screen.getByPlaceholderText(/^Nom$/i)).toHaveValue("");
        expect(screen.getByPlaceholderText(/^Prénom$/i)).toHaveValue("");

        // localStorage contains full person object
        const stored = JSON.parse(localStorage.getItem("user"));
        expect(stored).toEqual({
        lastName: "Doe",
        firstName: "John",
        email: "john@mail.com",
        birthDate: "2000-01-01",
        city: "Paris",
        postalCode: "75001",
        });
    });

    test("submit button disabled while form invalid", async () => {
        render(<RegistrationForm />);
        const submitBtn = screen.getByRole("button", { name: /s'inscrire/i });
        expect(submitBtn).toBeDisabled();

        await userEvent.type(screen.getByPlaceholderText(/^Nom$/i), "Doe");
        expect(submitBtn).toBeDisabled();

        await userEvent.type(screen.getByPlaceholderText(/^Prénom$/i), "John");
        expect(submitBtn).toBeDisabled();
    });

    test("success message disappears when user starts typing again", async () => {
        render(<RegistrationForm />);

        await userEvent.type(screen.getByPlaceholderText(/^Nom$/i), "Doe");
        await userEvent.type(screen.getByPlaceholderText(/^Prénom$/i), "John");
        await userEvent.type(screen.getByPlaceholderText(/^Email$/i), "john@mail.com");
        const birthInput = screen.getByLabelText(/^registration-form$/i).querySelector('input[name="birthDate"]');
        fireEvent.change(birthInput, { target: { value: "2000-01-01" } });
        await userEvent.type(screen.getByPlaceholderText(/^Ville$/i), "Paris");
        await userEvent.type(screen.getByPlaceholderText(/^Code postal$/i), "75001");

        await userEvent.click(screen.getByRole("button", { name: /s'inscrire/i }));
        expect(screen.getByText(/^Utilisateur enregistré !/i)).toBeInTheDocument();

        await userEvent.type(screen.getByPlaceholderText(/^Nom$/i), "X");
        expect(screen.queryByText(/^Utilisateur enregistré !/i)).not.toBeInTheDocument();
    });
});


describe("UI visual feedback", () => {
    beforeEach(() => localStorage.clear());
    test("error messages are displayed in red", async () => {
        render(<RegistrationForm />);

        const lastNameInput = screen.getByPlaceholderText(/^nom$/i);
        fireEvent.blur(lastNameInput);

        const error = await screen.findByText(/^Nom invalide$/i);

        expect(error).toBeInTheDocument();
        expect(error).toHaveStyle({ color: "red" });
    });

    test("success message is displayed in green after valid submit", async () => {
        render(<RegistrationForm />);

        await userEvent.type(screen.getByPlaceholderText(/^nom$/i), "Doe");
        await userEvent.type(screen.getByPlaceholderText(/^prénom$/i), "John");
        await userEvent.type(screen.getByPlaceholderText(/^email$/i), "john@mail.com");

        const birthInput = screen.getByLabelText(/^registration-form$/i).querySelector('input[name="birthDate"]');
        fireEvent.change(birthInput, { target: { value: "2000-01-01" } });

        await userEvent.type(screen.getByPlaceholderText(/^ville$/i), "Paris");
        await userEvent.type(screen.getByPlaceholderText(/^code postal$/i), "75001");

        await userEvent.click(screen.getByRole("button", { name: /^S'inscrire$/i }));

        const success = await screen.findByText(/^Utilisateur enregistré !/i);

        expect(success).toBeInTheDocument();
        expect(success).toHaveStyle({ color: "green" });
    });
});

describe("Security: prevent invalid forced submit", () => {
    beforeEach(() => localStorage.clear());
    test("does NOT submit when form is invalid even if submit event is triggered", async () => {
        render(<RegistrationForm />);
        await userEvent.click(screen.getByRole("button", { name: /s'inscrire/i }));
        
        expect(screen.queryByText(/utilisateur enregistré/i)).not.toBeInTheDocument();

        expect(localStorage.getItem("user")).toBeNull();

        expect(screen.getByText(/^Nom invalide$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Prénom invalide$/i)).toBeInTheDocument();
    });
});