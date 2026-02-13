import { useState, useMemo } from "react";
import { validatePerson } from "../utils/validation";

/**
 * Initial state for the registration form.
 * All fields start empty.
 */
const initialState = {
  lastName: "",
  firstName: "",
  email: "",
  birthDate: "",
  city: "",
  postalCode: "",
};

/**
 * RegistrationForm Component
 * Renders a user registration form and handles validation, submission, 
 * and user feedback (errors and success message).
 */
export default function RegistrationForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(validatePerson(initialState));
  const [success, setSuccess] = useState(false);

  /**
   * Memoized person object derived from form state.
   * This object is used for validation and submission.
   */
  const person = useMemo(
    () => ({
      lastName: form.lastName,
      firstName: form.firstName,
      email: form.email,
      birthDate: form.birthDate,
      city: form.city,
      postalCode: form.postalCode,
    }),
    [form]
  );

  const isValid = Object.keys(errors).length === 0;
  // console.log("Form valid: ", isValid, "Errors: ", errors)

  /**
   * Handle input changes
   * • Updates the form state with the new value
   * • Clears the success message
   * • Re-validates the form after the change
   */
  const handleChange = (e) => {
    setSuccess(false);
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors(validatePerson({ ...person, [e.target.name]: e.target.value }));
  };

  /**
   * Handle form submission
   * • Saves the person object to localStorage
   * • Shows success message
   * • Resets form to initial state
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("user", JSON.stringify(person));
    setSuccess(true);
    setForm(initialState);
  };

  /**
   * Render a single input field with validation feedback
   * @param {string} name Field name in state
   * @param {string} placeholder Field placeholder text
   * @param {string} type Input type, default "text"
   * @returns JSX fragment containing input and error message
   */
  const renderField = (name, placeholder, type = "text") => (
    <>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        style={{ borderColor: errors[name] ? "red" : undefined }}
      />
      {errors[name] && <span style={{ color: "red" }}>{placeholder} invalide</span>}
    </>
  );

  /**
   * Render the registration form
   * - Uses renderField for each input
   * - Submit button is disabled if form invalid or already submitted
   * - Displays a success message when submission succeeds
   */
  return (
    <form onSubmit={handleSubmit} aria-label="registration-form">
      {renderField("lastName", "Nom")}
      {renderField("firstName", "Prénom")}
      {renderField("email", "Email")}
      {renderField("birthDate", "Date naissance", "date")}
      {renderField("city", "Ville")}
      {renderField("postalCode", "Code postal")}

      <button type="submit" disabled={!isValid || success}>S'inscrire</button>

      {success && <p style={{ color: "green" }}>Utilisateur enregistré !</p>}
    </form>
  );
}