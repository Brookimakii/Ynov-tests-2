// /**
//  * E2E Tests for Server Error Scenarios
//  * Tests error handling when backend is unavailable
//  */
// describe("Registration Form E2E - Server Error Scenarios", () => {
//   const API_URL = "https://localhost:3000/users";

//   const validUser = {
//     firstName: "Diana",
//     lastName: "Prince",
//     email: "diana@example.com",
//     birthDate: "1990-08-10",
//     postalCode: "75005",
//     city: "Marseille",
//   };

//   beforeEach(() => {
//     cy.visit("/register");
//   });

//   describe("Server Errors (5xx)", () => {
//     /**
//      * Test: Backend returns 500 Internal Server Error
//      * Expected: User-friendly error message, app doesn't crash, form preserved
//      */
//     it("should handle 500 Internal Server Error without crashing", () => {
//       cy.intercept("POST", API_URL, {
//         statusCode: 500,
//         body: {
//           error: "Internal Server Error",
//           message: "Database connection failed",
//         },
//       }).as("serverError");

//       // Fill form
//       cy.get("input[name='firstName']").type(validUser.firstName);
//       cy.get("input[name='lastName']").type(validUser.lastName);
//       cy.get("input[name='email']").type(validUser.email);
//       cy.get("input[name='birthDate']").type(validUser.birthDate);
//       cy.get("input[name='postalCode']").type(validUser.postalCode);
//       cy.get("input[name='city']").type(validUser.city);

//       // Submit
//       cy.get("button[type='submit']").click();

//       // Wait for failed API call
//       cy.wait("@serverError");

//       // Verify error toast
//       cy.get(".Toastify__toast--error").should(
//         "contain",
//         "Le serveur est indisponible"
//       );

//       // Verify app didn't crash - form is still there
//       cy.get("form[aria-label='User registration form']").should("exist");

//       // Verify form title is visible
//       cy.get("form h1").should("contain", "Registration Form");

//       // Verify form data is preserved
//       cy.get("input[name='firstName']").should(
//         "have.value",
//         validUser.firstName
//       );
//       cy.get("input[name='lastName']").should(
//         "have.value",
//         validUser.lastName
//       );
//       cy.get("input[name='email']").should("have.value", validUser.email);
//       cy.get("input[name='postalCode']").should(
//         "have.value",
//         validUser.postalCode
//       );
//       cy.get("input[name='city']").should("have.value", validUser.city);
//     });

//     /**
//      * Test: User can retry after 500 error
//      * Expected: Second attempt with new API response succeeds
//      */
//     it("should allow user to retry after 500 server error", () => {
//       let attemptCount = 0;

//       cy.intercept("POST", API_URL, (req) => {
//         attemptCount++;
//         if (attemptCount === 1) {
//           // First attempt fails
//           req.reply({
//             statusCode: 500,
//             body: { error: "Server temporarily unavailable" },
//           });
//         } else {
//           // Second attempt succeeds
//           req.reply({
//             statusCode: 201,
//             body: {
//               id: 50,
//               ...req.body,
//             },
//           });
//         }
//       }).as("retryableRequest");

//       // Fill form
//       cy.get("input[name='firstName']").type(validUser.firstName);
//       cy.get("input[name='lastName']").type(validUser.lastName);
//       cy.get("input[name='email']").type(validUser.email);
//       cy.get("input[name='birthDate']").type(validUser.birthDate);
//       cy.get("input[name='postalCode']").type(validUser.postalCode);
//       cy.get("input[name='city']").type(validUser.city);

//       // First submission - fails
//       cy.get("button[type='submit']").click();
//       cy.wait("@retryableRequest");

//       cy.get(".Toastify__toast--error").should(
//         "contain",
//         "Le serveur est indisponible"
//       );

//       // Form data still there
//       cy.get("input[name='firstName']").should(
//         "have.value",
//         validUser.firstName
//       );

//       // User clicks submit again - succeeds
//       cy.get("button[type='submit']").click();
//       cy.wait("@retryableRequest");

//       // Verify success
//       cy.get(".Toastify__toast--success").should(
//         "contain",
//         "Formulaire soumis avec succès"
//       );

//       // Form should be cleared after success
//       cy.get("input[name='firstName']").should("have.value", "");
//       cy.get("input[name='lastName']").should("have.value", "");
//       cy.get("input[name='email']").should("have.value", "");
//     });

//     /**
//      * Test: User sees navigation after server recovery
//      * Expected: Can navigate back to home after error recovery
//      */
//     it("should allow navigation after server error recovery", () => {
//       let attemptCount = 0;

//       cy.intercept("POST", API_URL, (req) => {
//         attemptCount++;
//         if (attemptCount === 1) {
//           req.reply({
//             statusCode: 500,
//             body: { error: "Maintenance" },
//           });
//         } else {
//           req.reply({
//             statusCode: 201,
//             body: { id: 51, ...req.body },
//           });
//         }
//       }).as("maintenanceRequest");

//       cy.get("input[name='firstName']").type(validUser.firstName);
//       cy.get("input[name='lastName']").type(validUser.lastName);
//       cy.get("input[name='email']").type(validUser.email);
//       cy.get("input[name='birthDate']").type(validUser.birthDate);
//       cy.get("input[name='postalCode']").type(validUser.postalCode);
//       cy.get("input[name='city']").type(validUser.city);

//       // First attempt fails
//       cy.get("button[type='submit']").click();
//       cy.wait("@maintenanceRequest");
//       cy.get(".Toastify__toast--error").should("be.visible");

//       // Retry succeeds
//       cy.get("button[type='submit']").click();
//       cy.wait("@maintenanceRequest");
//       cy.get(".Toastify__toast--success").should("be.visible");

//       // Form is cleared
//       cy.get("input[name='firstName']").should("have.value", "");

//       // Navigate back (if navigation exists)
//       cy.get("a").first().then(($link) => {
//         if ($link.text()) {
//           cy.wrap($link).click();
//           // Verify we navigated
//           cy.url().should("not.include", "/register");
//         }
//       });
//     });
//   });

//   describe("Specific 5xx Status Codes", () => {
//     /**
//      * Test: 502 Bad Gateway
//      */
//     it("should handle 502 Bad Gateway error", () => {
//       cy.intercept("POST", API_URL, {
//         statusCode: 502,
//         body: { error: "Bad Gateway" },
//       }).as("badGateway");

//       cy.get("input[name='firstName']").type(validUser.firstName);
//       cy.get("input[name='lastName']").type(validUser.lastName);
//       cy.get("input[name='email']").type(validUser.email);
//       cy.get("input[name='birthDate']").type(validUser.birthDate);
//       cy.get("input[name='postalCode']").type(validUser.postalCode);
//       cy.get("input[name='city']").type(validUser.city);

//       cy.get("button[type='submit']").click();
//       cy.wait("@badGateway");

//       cy.get(".Toastify__toast--error").should(
//         "contain",
//         "Le serveur est indisponible"
//       );
//       cy.get("form").should("exist");
//     });

//     /**
//      * Test: 503 Service Unavailable
//      */
//     it("should handle 503 Service Unavailable error", () => {
//       cy.intercept("POST", API_URL, {
//         statusCode: 503,
//         body: { error: "Service Unavailable" },
//       }).as("unavailable");

//       cy.get("input[name='firstName']").type(validUser.firstName);
//       cy.get("input[name='lastName']").type(validUser.lastName);
//       cy.get("input[name='email']").type(validUser.email);
//       cy.get("input[name='birthDate']").type(validUser.birthDate);
//       cy.get("input[name='postalCode']").type(validUser.postalCode);
//       cy.get("input[name='city']").type(validUser.city);

//       cy.get("button[type='submit']").click();
//       cy.wait("@unavailable");

//       cy.get(".Toastify__toast--error").should(
//         "contain",
//         "Le serveur est indisponible"
//       );
//       cy.get("form").should("exist");
//     });

//     /**
//      * Test: 504 Gateway Timeout
//      */
//     it("should handle 504 Gateway Timeout error", () => {
//       cy.intercept("POST", API_URL, {
//         statusCode: 504,
//         body: { error: "Gateway Timeout" },
//       }).as("timeout_test");

//       cy.get("input[name='firstName']").type(validUser.firstName);
//       cy.get("input[name='lastName']").type(validUser.lastName);
//       cy.get("input[name='email']").type(validUser.email);
//       cy.get("input[name='birthDate']").type(validUser.birthDate);
//       cy.get("input[name='postalCode']").type(validUser.postalCode);
//       cy.get("input[name='city']").type(validUser.city);

//       cy.get("button[type='submit']").click();
//       cy.wait("@timeout_test");

//       cy.get(".Toastify__toast--error").should(
//         "contain",
//         "Le serveur est indisponible"
//       );
//     });
//   });

//   describe("Intermittent Failures", () => {
//     /**
//      * Test: Intermittent server issues - fail then succeed
//      * Expected: User can recover without data loss
//      */
//     it("should recover from intermittent server failures", () => {
//       let callCount = 0;

//       cy.intercept("POST", API_URL, (req) => {
//         callCount++;
//         if (callCount % 2 === 1) {
//           // Odd calls fail
//           req.reply({
//             statusCode: 500,
//             body: { error: "Intermittent failure" },
//           });
//         } else {
//           // Even calls succeed
//           req.reply({
//             statusCode: 201,
//             body: { id: 52, ...req.body },
//           });
//         }
//       }).as("intermittentRequest");

//       const email = "intermittent@example.com";

//       cy.get("input[name='firstName']").type(validUser.firstName);
//       cy.get("input[name='lastName']").type(validUser.lastName);
//       cy.get("input[name='email']").type(email);
//       cy.get("input[name='birthDate']").type(validUser.birthDate);
//       cy.get("input[name='postalCode']").type(validUser.postalCode);
//       cy.get("input[name='city']").type(validUser.city);

//       // Attempt 1 - fails
//       cy.get("button[type='submit']").click();
//       cy.wait("@intermittentRequest");
//       cy.get(".Toastify__toast--error").should("be.visible");

//       // Verify email is still there
//       cy.get("input[name='email']").should("have.value", email);

//       // Attempt 2 - succeeds
//       cy.get("button[type='submit']").click();
//       cy.wait("@intermittentRequest");
//       cy.get(".Toastify__toast--success").should("be.visible");
//     });

//     /**
//      * Test: Multiple sequential failures then recovery
//      */
//     it("should handle multiple failures before recovery", () => {
//       let callCount = 0;

//       cy.intercept("POST", API_URL, (req) => {
//         callCount++;
//         if (callCount < 3) {
//           // First two calls fail
//           req.reply({
//             statusCode: 500,
//             body: { error: "Service recovering" },
//           });
//         } else {
//           // Third call succeeds
//           req.reply({
//             statusCode: 201,
//             body: { id: 53, ...req.body },
//           });
//         }
//       }).as("recoveryRequest");

//       cy.get("input[name='firstName']").type(validUser.firstName);
//       cy.get("input[name='lastName']").type(validUser.lastName);
//       cy.get("input[name='email']").type(validUser.email);
//       cy.get("input[name='birthDate']").type(validUser.birthDate);
//       cy.get("input[name='postalCode']").type(validUser.postalCode);
//       cy.get("input[name='city']").type(validUser.city);

//       // Attempt 1
//       cy.get("button[type='submit']").click();
//       cy.wait("@recoveryRequest");
//       cy.get(".Toastify__toast--error").should("be.visible");

//       // Attempt 2
//       cy.get("button[type='submit']").click();
//       cy.wait("@recoveryRequest");
//       cy.get(".Toastify__toast--error").should("be.visible");

//       // Attempt 3 - succeeds
//       cy.get("button[type='submit']").click();
//       cy.wait("@recoveryRequest");
//       cy.get(".Toastify__toast--success").should(
//         "contain",
//         "Formulaire soumis avec succès"
//       );

//       // Form is cleared
//       cy.get("input[name='firstName']").should("have.value", "");
//     });
//   });
// });
