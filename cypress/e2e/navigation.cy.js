const generateUniqueUser = () => ({
    firstName: "Foo",
    lastName: "Bar",
    email: `foo.bar.${Date.now()}@example.com`, // Unique per test
    birthDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
    postalCode: "69001",
    city: "Lyon",
});

describe("Navigation Scenarios - E2E", {tags: '@database-up'}, () => {

    let newUser;
    let newUser2;


    beforeEach(() => {
        // Generate fresh users for each test to avoid reusing persisted emails
        newUser = generateUniqueUser();
        newUser2 = generateUniqueUser();
    });

    context("Scénario Nominal", ()=>{
        it('should add a valid user', () => {
            // Direct API check (without intercept)
            cy.request("http://localhost:8000/users").its("status").should("eq", 200);

            // Accueil
            cy.visit("/");
            
            // Reload page to ensure UI reflects API data
            cy.reload();
            cy.get("strong", { timeout: 20000 }).should("be.visible");

            // Navigation vers le formulaire d'inscription
            cy.contains("Register", { timeout: 20000 }).click();
            cy.url().should("include", "/register");
            cy.get("input[name='firstName']", { timeout: 20000 }).should("be.visible");

            
            // Remplissage du formulaire valide
            cy.get("input[name='firstName']").type(newUser.firstName);
            cy.get("input[name='lastName']").type(newUser.lastName);
            cy.get("input[name='email']").type(newUser.email);
            cy.get("input[name='birthDate']").type(newUser.birthDate.toISOString().split('T')[0]);
            cy.get("input[name='postalCode']").type(newUser.postalCode);
            cy.get("input[name='city']").type(newUser.city);

            //Validation du formulaire
            cy.get("button[type='submit']").should("be.enabled").click();
            
            cy.get(".Toastify__toast").should("contain", "Formulaire soumis avec succès !");            

            // API must be healthy after submit and contain created user
            cy.request("http://localhost:8000/users").then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.some((u) => u.email === newUser.email)).to.eq(true);
            });

            cy.visit("/");
            cy.reload();
            
            // Verify UI shows correct count
            cy.get("strong", { timeout: 20000 }).should("be.visible");
            cy.get("#user-list", { timeout: 5000 }).should("exist");
            cy.get("#user-list").contains(newUser.firstName);
            cy.get("#user-list").contains(newUser.lastName);
        })
    })

    context("Scénario d'Erreur", () => {
        it("Tentative d'ajout invalide par email déjà pris", () => {
            // Direct API check (without intercept)
            cy.request("http://localhost:8000/users").its("status").should("eq", 200);

            // Navigation vers formulaire
            cy.visit("/register");
            
            cy.get("input[name='firstName']").type(newUser.firstName);
            cy.get("input[name='lastName']").type(newUser.lastName);
            cy.get("input[name='email']").type(newUser.email);
            cy.get("input[name='birthDate']").type(newUser.birthDate.toISOString().split('T')[0]);
            cy.get("input[name='postalCode']").type(newUser.postalCode);
            cy.get("input[name='city']").type(newUser.city);
            
            cy.get("button[type='submit']").should("be.enabled").click();

            // First creation should be persisted
            cy.request("http://localhost:8000/users").then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.some((u) => u.email === newUser.email)).to.eq(true);
            });

            // Wait for form to be cleared after successful submission
            cy.get("input[name='firstName']", { timeout: 10000 }).should("have.value", "");

            // Remplissage invalide (email déjà pris)
            cy.get("input[name='firstName']").type(newUser2.firstName);
            cy.get("input[name='lastName']").type(newUser2.lastName);
            cy.get("input[name='email']").type(newUser.email);
            cy.get("input[name='birthDate']").type(newUser2.birthDate.toISOString().split('T')[0]);
            cy.get("input[name='postalCode']").type(newUser2.postalCode);
            cy.get("input[name='city']").type(newUser2.city);

            //Validation du formulaire
            cy.get("button[type='submit']").should("be.enabled").click();
            
            // Wait for error response from API (real env requires timeout)
            cy.get(".Toastify__toast--error", { timeout: 8000 }).should("contain", "Cet email est déjà utilisé");

            // API stays healthy and duplicate email is still unique in DB
            cy.request("http://localhost:8000/users").then((response) => {
                expect(response.status).to.eq(200);
                const sameEmailUsers = response.body.filter((u) => u.email === newUser.email);
                expect(sameEmailUsers.length).to.eq(1);
            });

            // Form data should be preserved
            cy.get("input[name='firstName']").should("have.value", newUser2.firstName);
            cy.get("input[name='email']").should("have.value", newUser.email);
        });

        it("Tentative d'ajout invalide par champ Ville vide", () => {
            // Navigation vers formulaire
            cy.visit("/register");
            cy.get("input[name='firstName']", { timeout: 10000 }).should("be.visible");

            // Remplissage invalide (email déjà pris)
            cy.get("input[name='firstName']").type(newUser2.firstName);
            cy.get("input[name='lastName']").type(newUser2.lastName);
            cy.get("input[name='email']").type(newUser2.email);
            cy.get("input[name='birthDate']").type(newUser2.birthDate.toISOString().split('T')[0]);
            cy.get("input[name='postalCode']").type(newUser2.postalCode);
            // City field is NOT filled

            //Validation du formulaire - button should be disabled
            cy.get("button[type='submit']").should("be.disabled").click({ force: true });
        });
    });
})