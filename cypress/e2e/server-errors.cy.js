/**
 * E2E Tests for server-down scenarios without mocking.
 * The database is expected to be down for this tagged suite.
 */
describe("Registration Form E2E - Server Error Scenarios", { tags: "@database-down" }, () => {
  const BACKEND_USERS_URL = "http://localhost:8000/users";

  const makeUser = () => ({
    firstName: "Diana",
    lastName: "Prince",
    email: `diana.${Date.now()}@example.com`,
    birthDate: "1990-08-10",
    postalCode: "75005",
    city: "Marseille",
  });

  const requestCreateUser = (user) =>
    cy.request({
      method: "POST",
      url: BACKEND_USERS_URL,
      body: user,
      failOnStatusCode: false,
    });

  const requestUsers = () =>
    cy.request({
      method: "GET",
      url: BACKEND_USERS_URL,
      failOnStatusCode: false,
    });

  const expectServerError = (response) => {
    expect(response.status).to.be.gte(500);
    expect(response.status).to.be.lt(600);
  };

  const fillForm = (user) => {
    cy.get("input[name='firstName']").type(user.firstName);
    cy.get("input[name='lastName']").type(user.lastName);
    cy.get("input[name='email']").type(user.email);
    cy.get("input[name='birthDate']").type(user.birthDate);
    cy.get("input[name='postalCode']").type(user.postalCode);
    cy.get("input[name='city']").type(user.city);
  };

  beforeEach(() => {
    cy.visit("/register");
    cy.url().should("include", "/register");
  });

  it("shows server unavailable error when backend rejects user creation", () => {
    const user = makeUser();

    requestCreateUser(user).then(expectServerError);

    fillForm(user);
    cy.get("button[type='submit']").click();

    cy.get(".Toastify__toast--error").should("contain", "Le serveur est indisponible");
    cy.get("form[aria-label='User registration form']").should("exist");

    // Data stays in the form so user can retry later
    cy.get("input[name='firstName']").should("have.value", user.firstName);
    cy.get("input[name='lastName']").should("have.value", user.lastName);
    cy.get("input[name='email']").should("have.value", user.email);
  });

  it("keeps all form data after a failed submit", () => {
    const user = makeUser();

    requestCreateUser(user).then(expectServerError);

    fillForm(user);
    cy.get("button[type='submit']").click();
    cy.get(".Toastify__toast--error").should("be.visible");

    cy.get("input[name='firstName']").should("have.value", user.firstName);
    cy.get("input[name='lastName']").should("have.value", user.lastName);
    cy.get("input[name='email']").should("have.value", user.email);
    cy.get("input[name='birthDate']").should("have.value", user.birthDate);
    cy.get("input[name='postalCode']").should("have.value", user.postalCode);
    cy.get("input[name='city']").should("have.value", user.city);
  });

  it("never shows a success toast when backend is down", () => {
    const user = makeUser();

    requestCreateUser(user).then(expectServerError);

    fillForm(user);

    // First try
    cy.get("button[type='submit']").click();
    cy.get(".Toastify__toast--error").should("be.visible");

    // Second try should still fail while DB is down
    cy.get("button[type='submit']").click();
    cy.get(".Toastify__toast--error").should("be.visible");

    cy.get(".Toastify__toast--success").should("not.exist");
  });

  it("keeps failing consistently while backend is down", () => {
    const user = makeUser();

    requestCreateUser(user).then(expectServerError);

    fillForm(user);

    // First try
    cy.get("button[type='submit']").click();
    cy.get(".Toastify__toast--error").should("be.visible");

    // Second try should still fail while DB is down
    cy.get("button[type='submit']").click();
    cy.get(".Toastify__toast--error").should("be.visible");

    // Verify backend is still unavailable after retries
    requestCreateUser({ ...user, email: `retry.${Date.now()}@example.com` }).then(expectServerError);
  });

  it("allows editing fields after a backend failure", () => {
    const user = makeUser();

    requestCreateUser(user).then(expectServerError);

    fillForm(user);
    cy.get("button[type='submit']").click();
    cy.get(".Toastify__toast--error").should("be.visible");

    const updatedEmail = `updated.${Date.now()}@example.com`;
    cy.get("input[name='email']").clear().type(updatedEmail);
    cy.get("input[name='email']").should("have.value", updatedEmail);

    cy.get("button[type='submit']").click();
    cy.get(".Toastify__toast--error").should("be.visible");
    cy.get(".Toastify__toast--success").should("not.exist");
  });

  it("fails for different users while server remains unavailable", () => {
    const user1 = makeUser();
    const user2 = { ...makeUser(), email: `diana.alt.${Date.now()}@example.com` };

    requestCreateUser(user1).then(expectServerError);
    requestCreateUser(user2).then(expectServerError);

    fillForm(user1);
    cy.get("button[type='submit']").click();
    cy.get(".Toastify__toast--error").should("be.visible");

    cy.get("input[name='firstName']").clear().type(user2.firstName);
    cy.get("input[name='lastName']").clear().type(user2.lastName);
    cy.get("input[name='email']").clear().type(user2.email);
    cy.get("input[name='birthDate']").clear().type(user2.birthDate);
    cy.get("input[name='postalCode']").clear().type(user2.postalCode);
    cy.get("input[name='city']").clear().type(user2.city);
    cy.get("button[type='submit']").click();

    cy.get(".Toastify__toast--error").should("be.visible");
  });

  it("keeps the app usable after backend failure", () => {
    const user = makeUser();

    requestUsers().then(expectServerError);
    requestCreateUser(user).then(expectServerError);

    fillForm(user);
    cy.get("button[type='submit']").click();

    cy.get(".Toastify__toast--error").should("contain", "Le serveur est indisponible");
    cy.get("form[aria-label='User registration form']").should("exist");
    cy.get("input[name='email']").should("have.value", user.email);

    // Backend still down after UI attempt
    requestUsers().then(expectServerError);
  });
});
