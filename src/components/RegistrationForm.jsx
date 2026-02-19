import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as validators from "../utils/validators";
import { isFormValidData } from "../utils/formValidation";

import "react-toastify/dist/ReactToastify.css";
import "./UserForm.css";

/**
 * RegistrationForm Component - Registration form with real-time validation
 *
 * @component
 * @description Form component that collects user information (first name, last name, email,
 * birth date, postal code, city) with immediate validation feedback and localStorage persistence.
 *
 * @returns {JSX.Element} The rendered form component
 */
const RegistrationForm = ({ addUser }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    postalCode: "",
    city: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    postalCode: "",
    city: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    birthDate: false,
    postalCode: false,
    city: false,
  });

  /**
   * Validates a single field using the appropriate validator function
   *
   * @param {string} fieldName - Name of the field to validate
   * @param {string} value - Value to validate
   * @returns {string} Error message if validation fails, empty string otherwise
   */
  const validateField = (fieldName, value) => {
    try {
      switch (fieldName) {
        case "firstName":
        case "lastName":
        case "city":
          validators.validateIdentity(value);
          break;

        case "email":
          validators.validateEmail(value);
          break;

        case "birthDate":
          if (!value) throw new Error("Birth date is required");
          validators.validateAge(new Date(value));
          break;

        case "postalCode":
          validators.validatePostalCode(value);
          break;

        /* istanbul ignore next */
        default:
          break;
      }
      return "";
    } catch (error) {
      return error.message;
    }
  };

  const handleClick = () => {
    toast.success("Success!");
    toast.error("Error!"); // this should work
  };
  /**
   * Handles input change events with real-time validation
   *
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const errorMessage = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    }
  };

  /**
   * Handles blur event (focus out) to trigger validation
   *
   * @param {Event} e - Blur event
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  /**
   * Checks if the entire form is valid
   *
   * @returns {boolean} True if form is valid, false otherwise
   */
  const isFormValid = () => {
    const allFieldsFilled = Object.values(formData).every((value) => value.trim() !== "");
    if (!allFieldsFilled) return false;

    try {
      isFormValidData(formData);
      return true;
    } catch (error) {
      return false;
    }
  };

  /**
   * Handles form submission
   * Saves data to localStorage, displays success message, and resets form
   *
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      isFormValidData(formData);

      const userData = {
        ...formData,
        timestamp: new Date().toISOString(),
      };

      addUser(userData);

      toast.success("Formulaire soumis avec succès !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
        postalCode: "",
        city: "",
      });

      setErrors({
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
        postalCode: "",
        city: "",
      });

      setTouched({
        firstName: false,
        lastName: false,
        email: false,
        birthDate: false,
        postalCode: false,
        city: false,
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="user-form-container">
      <button onClick={handleClick}>Show Toasts</button>
      <ToastContainer />
      <form className="user-form" onSubmit={handleSubmit} noValidate aria-label="User registration form">
        <h1>Registration Form</h1>

        {[
          { name: "firstName", label: "First Name", type: "text" },
          { name: "lastName", label: "Last Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "birthDate", label: "Birth date", type: "date" },
          { name: "postalCode", label: "Postal Code", type: "text", maxLength: 5 },
          { name: "city", label: "City", type: "text" },
        ].map(({ name, label, type, maxLength }) => (
          <div className="form-group" key={name}>
            <label htmlFor={name}>{label} *</label>

            <input
              id={name}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={maxLength}
              className={errors[name] && touched[name] ? "error" : ""}
              aria-invalid={errors[name] && touched[name] ? "true" : "false"}
              aria-describedby={
                errors[name] && touched[name] ? `${name}-error` : undefined
              }
            />
            {errors[name] && touched[name] && (
              <span id={`${name}-error`} className="error-message" role="alert">
                {errors[name]}
              </span>
            )}
          </div>
        ))}

        <button type="submit" className="submit-button" disabled={!isFormValid()} aria-label="Submit the form">
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
