import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as validators from "../utils/validators";
import "react-toastify/dist/ReactToastify.css";
import "./UserForm.css";

/**
 * UserForm Component - Registration form with real-time validation
 *
 * @component
 * @description Form component that collects user information (first name, last name, email,
 * birth date, postal code, city) with immediate validation feedback and localStorage persistence.
 *
 * @returns {JSX.Element} The rendered form component
 */
const UserForm = () => {
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
          validators.validateIdentity(value);
          return "";

        case "lastName":
          validators.validateIdentity(value);
          return "";

        case "email":
          validators.validateEmail(value);
          return "";

        case "birthDate":
          if (!value) {
            return "Birth date is required";
          }
          const date = new Date(value);
          validators.validateAge(date);
          return "";

        case "postalCode":
          validators.validatePostalCode(value);
          return "";

        case "city":
          validators.validateIdentity(value);
          return "";

        /* istanbul ignore next */
        default:
          return "";
      }
    } catch (error) {
      return error.message;
    }
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
      validators.validateIdentity(formData.firstName);
      validators.validateIdentity(formData.lastName);
      validators.validateEmail(formData.email);
      validators.validateAge(new Date(formData.birthDate));
      validators.validatePostalCode(formData.postalCode);
      validators.validateIdentity(formData.city);
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

    if (isFormValid()) {
      const userData = {
        ...formData,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("userData", JSON.stringify(userData));

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
    }
  };

  return (
    <div className="user-form-container">
      <ToastContainer />
      <form className="user-form" onSubmit={handleSubmit} noValidate aria-label="User registration form">
        <h1>Registration Form</h1>

        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.firstName && touched.firstName ? "error" : ""}
            aria-invalid={errors.firstName && touched.firstName ? "true" : "false"}
            aria-describedby={errors.firstName && touched.firstName ? "firstName-error" : undefined}
          />
          {errors.firstName && touched.firstName && (
            <span id="firstName-error" className="error-message" role="alert">
              {errors.firstName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.lastName && touched.lastName ? "error" : ""}
            aria-invalid={errors.lastName && touched.lastName ? "true" : "false"}
            aria-describedby={errors.lastName && touched.lastName ? "lastName-error" : undefined}
          />
          {errors.lastName && touched.lastName && (
            <span id="lastName-error" className="error-message" role="alert">
              {errors.lastName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email && touched.email ? "error" : ""}
            aria-invalid={errors.email && touched.email ? "true" : "false"}
            aria-describedby={errors.email && touched.email ? "email-error" : undefined}
          />
          {errors.email && touched.email && (
            <span id="email-error" className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="birthDate">Birth date *</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.birthDate && touched.birthDate ? "error" : ""}
            aria-invalid={errors.birthDate && touched.birthDate ? "true" : "false"}
            aria-describedby={errors.birthDate && touched.birthDate ? "birthDate-error" : undefined}
          />
          {errors.birthDate && touched.birthDate && (
            <span id="birthDate-error" className="error-message" role="alert">
              {errors.birthDate}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">Postal Code *</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.postalCode && touched.postalCode ? "error" : ""}
            aria-invalid={errors.postalCode && touched.postalCode ? "true" : "false"}
            aria-describedby={errors.postalCode && touched.postalCode ? "postalCode-error" : undefined}
            maxLength="5"
          />
          {errors.postalCode && touched.postalCode && (
            <span id="postalCode-error" className="error-message" role="alert">
              {errors.postalCode}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="city">City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.city && touched.city ? "error" : ""}
            aria-invalid={errors.city && touched.city ? "true" : "false"}
            aria-describedby={errors.city && touched.city ? "city-error" : undefined}
          />
          {errors.city && touched.city && (
            <span id="city-error" className="error-message" role="alert">
              {errors.city}
            </span>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={!isFormValid()} aria-label="Submit the form">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserForm;
