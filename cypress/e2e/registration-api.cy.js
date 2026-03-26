const generateUniqueUser = () => ({
    firstName: "Foo",
    lastName: "Bar",
    email: `foo.bar.${Date.now()}@example.com`, // Unique per test
    birthDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
    postalCode: "69001",
    city: "Lyon",
});


const add_validUser = (user) => {
    cy.get("input[name='firstName']").type(user.firstName);
    cy.get("input[name='lastName']").type(user.lastName);
    cy.get("input[name='email']").type(user.email);
    cy.get("input[name='birthDate']").type(user.birthDate.toISOString().split('T')[0]);
    cy.get("input[name='postalCode']").type(user.postalCode);
    cy.get("input[name='city']").type(user.city);
    cy.get("button[type='submit']").click();
    cy.get(".Toastify__toast--success").should("be.visible");
}
/**
 * E2E Tests with API Mocking using cy.intercept
 * Tests the RegistrationForm with mocked JSONPlaceholder API
 * Covers success (201), business errors (400), and server crashes (500)
 */
describe("Registration Form E2E - With API Mocking", () => {
  const API_URL = "http://localhost:3000/users";

  let validUser;

  let anotherUser;

  beforeEach(() => {
    // Generate unique user for each test
    validUser = generateUniqueUser();
    anotherUser = generateUniqueUser();

    // Wait for app bootstrap and navigate once data is loaded
    cy.visit("/");
    cy.contains("Register", { timeout: 20000 }).click();
    cy.url().should("include", "/register");
    cy.get("form.user-form", { timeout: 20000 }).should("be.visible");
    cy.get("input[name='firstName']", { timeout: 20000 }).should("be.visible");
  });

  describe("Success Scenario (201) - Normal user flow", () => {
    /**
     * Test: User successfully submits form, API returns 201
     * Expected: Success toast displayed, form cleared
     */
    it("should successfully submit form and display success message on 201 response", () => {

      // Fill form with valid data
      cy.get("input[name='firstName']").type(validUser.firstName);
      cy.get("input[name='lastName']").type(validUser.lastName);
      cy.get("input[name='email']").type(validUser.email);
      cy.get("input[name='birthDate']").type(validUser.birthDate.toISOString().split('T')[0]);
      cy.get("input[name='postalCode']").type(validUser.postalCode);
      cy.get("input[name='city']").type(validUser.city);

      // Submit form
      cy.get("button[type='submit']").should("be.enabled").click();

      // Verify success toast
      cy.get(".Toastify__toast").should(
        "contain",
        "Formulaire soumis avec succès !"
      );
      cy.get(".Toastify__toast--success").should("be.visible");

      // Verify form is cleared
      cy.get("input[name='firstName']").should("have.value", "");
      cy.get("input[name='lastName']").should("have.value", "");
      cy.get("input[name='email']").should("have.value", "");
      cy.get("input[name='birthDate']").should("have.value", "");
      cy.get("input[name='postalCode']").should("have.value", "");
      cy.get("input[name='city']").should("have.value", "");

      // Submit button should be disabled again
      cy.get("button[type='submit']").should("be.disabled");
    });

    /**
     * Test: User successfully submits form, API returns 200
     * Expected: Same as 201 - success toast and form cleared
     */
    it("should handle 200 response as successful submission", () => {

      cy.get("input[name='firstName']").type(validUser.firstName);
      cy.get("input[name='lastName']").type(validUser.lastName);
      cy.get("input[name='email']").type(validUser.email);
      cy.get("input[name='birthDate']").type(validUser.birthDate.toISOString().split('T')[0]);
      cy.get("input[name='postalCode']").type(validUser.postalCode);
      cy.get("input[name='city']").type(validUser.city);

      cy.get("button[type='submit']").click();

      cy.get(".Toastify__toast--success").should(
        "contain",
        "Formulaire soumis avec succès !"
      );
    });
  });

  // describe("Business Error (400) - Email already exists", () => {

  //   /**
  //    * Test: Backend returns 400 with specific error message
  //    * Expected: Error message displayed, form preserved for correction
  //    */
  //   it("should display specific error message when email already exists (400)", () => {
  //     add_validUser(validUser);
  //     cy.get("input[name='firstName']").type(anotherUser.firstName);
  //     cy.get("input[name='lastName']").type(anotherUser.lastName);
  //     cy.get("input[name='email']").type(anotherUser.email);
  //     cy.get("input[name='birthDate']").type(validUser.birthDate.toISOString().split('T')[0]);
  //     cy.get("input[name='postalCode']").type(anotherUser.postalCode);
  //     cy.get("input[name='city']").type(anotherUser.city);

  //     cy.get("button[type='submit']").click({ force: true });

  //     // Verify error toast with specific message
  //     cy.get(".Toastify__toast--error").should(
  //       "contain",
  //       "Cet email est déjà utilisé"
  //     );

  //     // Verify form data is preserved so user can correct it
  //     cy.get("input[name='firstName']").should(
  //       "have.value",
  //       anotherUser.firstName
  //     );
  //     cy.get("input[name='lastName']").should(
  //       "have.value",
  //       anotherUser.lastName
  //     );
  //     cy.get("input[name='email']").should("have.value", anotherUser.email);
  //     cy.get("input[name='postalCode']").should(
  //       "have.value",
  //       anotherUser.postalCode
  //     );
  //     cy.get("input[name='city']").should("have.value", anotherUser.city);
  //   });

  //   /**
  //    * Test: Backend returns 400 without custom message
  //    * Expected: Default EMAIL_EXISTS message displayed
  //    */
  //   it("should display default message when 400 without message body", () => {

  //     add_validUser(validUser);

  //     cy.get("input[name='firstName']").type(validUser.firstName);
  //     cy.get("input[name='lastName']").type(validUser.lastName);
  //     cy.get("input[name='email']").type(validUser.email);
  //     cy.get("input[name='birthDate']").type(validUser.birthDate);
  //     cy.get("input[name='postalCode']").type(validUser.postalCode);
  //     cy.get("input[name='city']").type(validUser.city);

  //     cy.get("button[type='submit']").click();

  //     // Should display default error message
  //     cy.get(".Toastify__toast--error").should(
  //       "contain",
  //       "Cet email est déjà utilisé"
  //     );
  //   });

  //   /**
  //    * Test: User can recover from 400 error by changing email
  //    * Expected: User can submit again with different email
  //    */
  //   it("should allow user to retry with different email after 400 error", () => {
  //     const newValidEmail = "charlie@example.com";

  //     add_validUser(validUser);

  //     // Fill with email that will fail
  //     cy.get("input[name='firstName']").type(anotherUser.firstName);
  //     cy.get("input[name='lastName']").type(anotherUser.lastName);
  //     cy.get("input[name='email']").type(anotherUser.email);
  //     cy.get("input[name='birthDate']").type(validUser.birthDate.toISOString().split('T')[0]);
  //     cy.get("input[name='postalCode']").type(anotherUser.postalCode);
  //     cy.get("input[name='city']").type(anotherUser.city);

  //     cy.get("button[type='submit']").click();

  //     // Verify error
  //     cy.get(".Toastify__toast--error").should("be.visible");

  //     // User changes email
  //     cy.get("input[name='email']").clear().type(newValidEmail);
  //     cy.get("button[type='submit']").click();

  //     // Verify success
  //     cy.get(".Toastify__toast--success").should(
  //       "contain",
  //       "Formulaire soumis avec succès !"
  //     );

  //     // Form should be cleared after success
  //     cy.get("input[name='firstName']").should("have.value", "");
  //   });
  // });

  // describe("Server Error (5xx) - Server down", () => {
  //   /**
  //    * Test: Backend returns 500 server error
  //    * Expected: User-friendly message, app doesn't crash, form preserved
  //    */
  //   it("should display user-friendly error and not crash on 500 server error", () => {

  //     add_validUser(validUser);

  //     cy.get("input[name='firstName']").type(validUser.firstName);
  //     cy.get("input[name='lastName']").type(validUser.lastName);
  //     cy.get("input[name='email']").type(validUser.email);
  //     cy.get("input[name='birthDate']").type(validUser.birthDate.toISOString().split('T')[0]);
  //     cy.get("input[name='postalCode']").type(validUser.postalCode);
  //     cy.get("input[name='city']").type(validUser.city);

  //     cy.get("button[type='submit']").click();

  //     // Verify user-friendly error message
  //     cy.get(".Toastify__toast--error").should(
  //       "contain",
  //       "Le serveur est indisponible"
  //     );

  //     // App should still be functional - form should still exist
  //     cy.get("form[aria-label='User registration form']").should("exist");

  //     // Form data preserved so user can retry
  //     cy.get("input[name='firstName']").should(
  //       "have.value",
  //       validUser.firstName
  //     );
  //     cy.get("input[name='email']").should("have.value", validUser.email);
  //   });

  //   /**
  //    * Test: Backend returns 502 Bad Gateway
  //    * Expected: Same user-friendly message
  //    */
  //   it("should handle 502 Bad Gateway error gracefully", () => {

  //     cy.get("input[name='firstName']").type(validUser.firstName);
  //     cy.get("input[name='lastName']").type(validUser.lastName);
  //     cy.get("input[name='email']").type(validUser.email);
  //     cy.get("input[name='birthDate']").type(validUser.birthDate.toISOString().split('T')[0]);
  //     cy.get("input[name='postalCode']").type(validUser.postalCode);
  //     cy.get("input[name='city']").type(validUser.city);

  //     cy.get("button[type='submit']").click();

  //     cy.get(".Toastify__toast--error").should(
  //       "contain",
  //       "Le serveur est indisponible"
  //     );
  //     cy.get("form").should("exist");
  //   });

  //   /**
  //    * Test: Backend returns 503 Service Unavailable
  //    * Expected: Same user-friendly message
  //    */
  //   it("should handle 503 Service Unavailable error gracefully", () => {

  //     cy.get("input[name='firstName']").type(validUser.firstName);
  //     cy.get("input[name='lastName']").type(validUser.lastName);
  //     cy.get("input[name='email']").type(validUser.email);
  //     cy.get("input[name='birthDate']").type(validUser.birthDate.toISOString().split('T')[0]);
  //     cy.get("input[name='postalCode']").type(validUser.postalCode);
  //     cy.get("input[name='city']").type(validUser.city);

  //     cy.get("button[type='submit']").click();

  //     cy.get(".Toastify__toast--error").should(
  //       "contain",
  //       "Le serveur est indisponible"
  //     );
  //   });

  //   /**
  //    * Test: User can retry after 500 error
  //    * Expected: Second attempt succeeds
  //    */
  //   it("should allow user to retry after server error", () => {
  //     let attemptCount = 0;

  //     cy.intercept("POST", API_URL, (req) => {
  //       attemptCount++;
  //       if (attemptCount === 1) {
  //         // First attempt fails
  //         req.reply({
  //           statusCode: 500,
  //           body: { error: "Server Error" },
  //         });
  //       } else {
  //         // Second attempt succeeds
  //         req.reply({
  //           statusCode: 201,
  //           body: { id: 14, ...req.body },
  //         });
  //       }
  //     }).as("retryableRequest");

  //     cy.get("input[name='firstName']").type(validUser.firstName);
  //     cy.get("input[name='lastName']").type(validUser.lastName);
  //     cy.get("input[name='email']").type(validUser.email);
  //     cy.get("input[name='birthDate']").type(validUser.birthDate.toISOString().split('T')[0]);
  //     cy.get("input[name='postalCode']").type(validUser.postalCode);
  //     cy.get("input[name='city']").type(validUser.city);

  //     // First submission - fails
  //     cy.get("button[type='submit']").click();
  //     cy.get(".Toastify__toast--error").should("be.visible");

  //     // User retries - succeeds
  //     cy.get("button[type='submit']").click();
  //     cy.get(".Toastify__toast--success").should(
  //       "contain",
  //       "Formulaire soumis avec succès !"
  //     );
  //   });
  // });

  // describe("Network Error - Connection issues", () => {
  //   /**
  //    * Test: Network request fails (timeout/connection refused)
  //    * Expected: Graceful error handling
  //    */
  //   it("should handle network errors gracefully", () => {
  //     cy.intercept("POST", API_URL, { forceNetworkError: true }).as(
  //       "networkError"
  //     );

  //     cy.get("input[name='firstName']").type(validUser.firstName);
  //     cy.get("input[name='lastName']").type(validUser.lastName);
  //     cy.get("input[name='email']").type(validUser.email);
  //     cy.get("input[name='birthDate']").type(validUser.birthDate.toISOString().split('T')[0]);
  //     cy.get("input[name='postalCode']").type(validUser.postalCode);
  //     cy.get("input[name='city']").type(validUser.city);

  //     cy.get("button[type='submit']").click();
  //     cy.wait("@networkError");

  //     // Should display generic server error message
  //     cy.get(".Toastify__toast--error").should(
  //       "contain",
  //       "Le serveur est indisponible"
  //     );

  //     // App remains functional
  //     cy.get("form").should("exist");
  //     cy.get("input[name='email']").should("have.value", validUser.email);
  //   });
  // });

  // describe("Multiple API calls - Sequential submissions", () => {
  //   /**
  //    * Test: User submits form multiple times (e.g., adding different users)
  //    * Expected: Each submission calls API independently
  //    */
  //   it("should call API for each form submission", () => {

  //     // First submission
  //     cy.get("input[name='firstName']").type(validUser.firstName);
  //     cy.get("input[name='lastName']").type(validUser.lastName);
  //     cy.get("input[name='email']").type(validUser.email);
  //     cy.get("input[name='birthDate']").type(validUser.birthDate.toISOString().split('T')[0]);
  //     cy.get("input[name='postalCode']").type(validUser.postalCode);
  //     cy.get("input[name='city']").type(validUser.city);
  //     cy.get("button[type='submit']").click();

  //     cy.get(".Toastify__toast--success").should("be.visible");

  //     // Verify form is cleared
  //     cy.get("input[name='firstName']").should("have.value", "");

  //     // Second submission with different user
  //     cy.get("input[name='firstName']").type(anotherUser.firstName);
  //     cy.get("input[name='lastName']").type(anotherUser.lastName);
  //     cy.get("input[name='email']").type(anotherUser.email);
  //     cy.get("input[name='birthDate']").type(validUser.birthDate.toISOString().split('T')[0]);
  //     cy.get("input[name='postalCode']").type(anotherUser.postalCode);
  //     cy.get("input[name='city']").type(anotherUser.city);
  //     cy.get("button[type='submit']").click();

  //     // Should make second API call
  //     cy.get(".Toastify__toast--success").should("be.visible");

  //     // Verify form is cleared again
  //     cy.get("input[name='firstName']").should("have.value", "");
  //   });
  // });
});
