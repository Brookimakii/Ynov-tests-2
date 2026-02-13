import {
  isValidName,
  isValidEmail,
  isAdult,
  isValidFrenchPostalCode,
  validatePerson,
} from "../utils/validation";

describe("Validation Utils Unit Tests", () => {

  describe("isValidName", () => {
    test("valid names", () => {
      expect(isValidName("Jean")).toBe(true);
      expect(isValidName("O'Neil")).toBe(true);
      expect(isValidName("Émilie")).toBe(true);
    });

    test("invalid names", () => {
      expect(isValidName("A")).toBe(false);
      expect(isValidName("")).toBe(false);
      expect(isValidName("1John")).toBe(false);
    });
  });

  describe("isValidEmail", () => {
    test("valid emails", () => {
      expect(isValidEmail("test@mail.com")).toBe(true);
      expect(isValidEmail("john.doe@example.fr")).toBe(true);
    });

    test("invalid emails", () => {
      expect(isValidEmail("bad")).toBe(false);
      expect(isValidEmail("a@b")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("isAdult", () => {
    const today = new Date();

    test("person older than 18", () => {
      expect(isAdult("2000-01-01")).toBe(true);
    });

    test("person younger than 18", () => {
      const minorDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate())
        .toISOString()
        .split("T")[0];
      expect(isAdult(minorDate)).toBe(false);
    });

    test("birthday tomorrow → still minor", () => {
      const almost18 = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 2)
        .toISOString()
        .split("T")[0];
      expect(isAdult(almost18)).toBe(false);
    });

    test("empty date returns false", () => {
      expect(isAdult("")).toBe(false);
      expect(isAdult(null)).toBe(false);
    });
  });

  describe("isValidFrenchPostalCode", () => {
    test("valid postal codes", () => {
      expect(isValidFrenchPostalCode("75001")).toBe(true);
      expect(isValidFrenchPostalCode("13008")).toBe(true);
    });

    test("invalid postal codes", () => {
      expect(isValidFrenchPostalCode("abc")).toBe(false);
      expect(isValidFrenchPostalCode("123")).toBe(false);
      expect(isValidFrenchPostalCode("123456")).toBe(false);
      expect(isValidFrenchPostalCode("")).toBe(false);
    });
  });

  describe("validatePerson", () => {
    test("returns empty object for valid person", () => {
      const person = {
        lastName: "Doe",
        firstName: "John",
        email: "john@mail.com",
        birthDate: "2000-01-01",
        city: "Paris",
        postalCode: "75001",
      };
      expect(validatePerson(person)).toEqual({});
    });

    test("returns errors for invalid person", () => {
      const person = {
        lastName: "A",
        firstName: "",
        email: "bad",
        birthDate: "2010-01-01",
        city: "",
        postalCode: "abc",
      };
      const errors = validatePerson(person);
      expect(errors).toHaveProperty("lastName", true);
      expect(errors).toHaveProperty("firstName", true);
      expect(errors).toHaveProperty("email", true);
      expect(errors).toHaveProperty("birthDate", true);
      expect(errors).toHaveProperty("city", true);
      expect(errors).toHaveProperty("postalCode", true);
    });
  });
});
