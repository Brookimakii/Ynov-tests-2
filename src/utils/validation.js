import { calculateAge } from "../module";

/**
 * Validate that a name is valid.
 * Accepts letters (including accents), apostrophes, hyphens, and spaces.
 * Minimum 2 characters.
 *
 * @param {string} name The name to validate
 * @returns {boolean} true if valid, false otherwise
 */
export const isValidName = (name) => /^[A-Za-zÀ-ÿ '-]{2,}$/.test(name);

/**
 * Validate that an email is properly formatted.
 * Simple regex check for standard email patterns.
 *
 * @param {string} email The email to validate
 * @returns {boolean} true if valid, false otherwise
 */
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Checks if a birth date corresponds to an adult (18+ years old)
 * Uses the calculateAge function from module.js
 *
 * @param {string | Date} birthDate The birth date string (yyyy-mm-dd) or Date object
 * @returns {boolean} true if 18 or older, false otherwise
 */
export const isAdult = (birthDate) => {
  if (!birthDate) return false;
  try {
    return calculateAge({ birth: new Date(birthDate) }) >= 18;
  } catch (error) {
    return false;
  }
};

/**
 * Validate a French postal code
 * Must be exactly 5 digits
 *
 * @param {string} code Postal code string
 * @returns {boolean} true if valid, false otherwise
 */
export const isValidFrenchPostalCode = (code) => /^\d{5}$/.test(code);

/**
 * Validate a full person object
 *
 * @param {Object} person Object with fields:
 *   lastName, firstName, email, birthDate, city, postalCode
 * @returns {Object} errors object:
 *   • Each key exists only if the corresponding field is invalid
 *   • Example: { lastName: true, email: true }
 */
export const validatePerson = (person) => {
  const errors = {};
  if (!isValidName(person.lastName)) errors.lastName = true;
  if (!isValidName(person.firstName)) errors.firstName = true;
  if (!isValidEmail(person.email)) errors.email = true;
  if (!isAdult(person.birthDate)) errors.birthDate = true;
  if (!person.city || person.city.trim() === "") errors.city = true;
  if (!isValidFrenchPostalCode(person.postalCode)) errors.postalCode = true;
  return errors;
};