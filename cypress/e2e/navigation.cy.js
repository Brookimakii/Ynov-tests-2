const generateUniqueUser = () => ({
    firstName: "Foo",
    lastName: "Bar",
    email: `foo.bar.${Date.now()}@example.com`, // Unique per test
    birthDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
    postalCode: "69001",
    city: "Lyon",
});

describe("Navigation Scenarios - E2E", () => {

    let newUser;
    let newUser2;

    beforeEach(() => {
        // Generate unique users for each test (real env persistence requires fresh data)
        newUser = generateUniqueUser();
        newUser2 = generateUniqueUser();
        
        // Open home and wait until async users loading is complete
        cy.visit("/");
        cy.clearLocalStorage();

        // App renders "Chargement..." first; wait for real home content
        cy.contains("Welcome", { timeout: 20000 }).should("be.visible");
        cy.get("strong", { timeout: 20000 }).should("be.visible");
    });

    context("Scénario Nominal", ()=>{
        it('should add a valid user', () => {
            let initialCount;
            // Accueil
            cy.visit("/");
            cy.get("strong", { timeout: 20000 }).should("be.visible");
            
            cy.get("strong").then(($strong) => {
                initialCount = parseInt($strong.text());
                cy.log(`Initial user count: ${initialCount}`);
            });

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

            cy.visit("/");
            cy.get("strong").then(($strong) => {
                const finalCount = parseInt($strong.text());
                cy.log(`Final user count: ${finalCount}`);
                expect(finalCount).to.equal(initialCount + 1);
            });
            cy.get("#user-list", { timeout: 5000 }).should("exist");
            cy.get("#user-list").contains(newUser.firstName);
            cy.get("#user-list").contains(newUser.lastName);
        })
    })

    context("Scénario d'Erreur", () => {
        it("Tentative d'ajout invalide par email déjà pris", () => {
            // Navigation vers formulaire
            cy.visit("/register");
            
            cy.get("input[name='firstName']").type(newUser.firstName);
            cy.get("input[name='lastName']").type(newUser.lastName);
            cy.get("input[name='email']").type(newUser.email);
            cy.get("input[name='birthDate']").type(newUser.birthDate.toISOString().split('T')[0]);
            cy.get("input[name='postalCode']").type(newUser.postalCode);
            cy.get("input[name='city']").type(newUser.city);
            
            cy.get("button[type='submit']").should("be.enabled").click();

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

            // Form data should be preserved
            cy.get("input[name='firstName']").should("have.value", newUser2.firstName);
            cy.get("input[name='email']").should("have.value", newUser.email);
        });

        it("Tentative d'ajout invalide par champ Ville vide", () => {
            // Navigation vers formulaire
            cy.visit("/register");

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