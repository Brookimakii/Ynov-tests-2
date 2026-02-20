describe("Navigation Scenarios - E2E", () => {
    const API_URL = "https://jsonplaceholder.typicode.com/users";

    const newUser = {
        firstName: "Foo",
        lastName: "Bar",
        email: "foo.bar@example.com",
        birthDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
        postalCode: "69001",
        city: "Lyon",
    }
    const newUser2 = {
        firstName: "FooBaril",
        lastName: "BarFool",
        email: "foo.bar2@example.com",
        birthDate: new Date(new Date().getFullYear() - 20, new Date().getMonth(), new Date().getDate()),
        postalCode: "75001",
        city: "Paris",
    }

    beforeEach(() => {
        // Clear localStorage before each top-level test run
        cy.visit("/");
        cy.clearLocalStorage();
    });

    context("Scénario Nominal", ()=>{
        it('should add a valid user', () => {
            // Mock successful API response
            cy.intercept("GET", API_URL, {
                statusCode: 200,
                body: [],
            }).as("getUsersEmpty");

            
            cy.intercept("POST", API_URL, {
                statusCode: 201,
                body: {
                    id: 1,
                    ...newUser,
                    timestamp: new Date().toISOString(),
                },
            }).as("createUserSuccess");

            // Accueil
            cy.visit("/");
            cy.wait("@getUsersEmpty");
            cy.contains("0 utilisateur inscrit");
            cy.get("#user-list").should("not.exist");

            // Navigation vers le formulaire d'inscription
            cy.contains("Register").click();
            cy.url().should("include", "/register");

            
            // Remplissage du formulaire valide
            cy.get("input[name='firstName']").type(newUser.firstName);
            cy.get("input[name='lastName']").type(newUser.lastName);
            cy.get("input[name='email']").type(newUser.email);
            cy.get("input[name='birthDate']").type(newUser.birthDate.toISOString().split('T')[0]);
            cy.get("input[name='postalCode']").type(newUser.postalCode);
            cy.get("input[name='city']").type(newUser.city);

            //Validation du formulaire
            cy.get("button[type='submit']").should("be.enabled").click();
            
            // Wait for API call
            cy.wait("@createUserSuccess");
            
            cy.get(".Toastify__toast").should("contain", "Formulaire soumis avec succès !");
            
            // Retour à l'accueil et vérification de l'ajout de l'utilisateur
            
            cy.intercept("GET", API_URL, {
                statusCode: 200,
                body: [
                    {
                        id: 1,
                        ...newUser,
                        timestamp: new Date().toISOString(),
                    }
                ],
            }).as("getUsersWithOneUser");

            cy.visit("/");
            cy.wait("@getUsersWithOneUser");
            cy.contains("1 utilisateur inscrit");
            cy.get("#user-list").should("exist");
            cy.get("#user-list").contains(newUser.firstName);
            cy.get("#user-list").contains(newUser.lastName);
        })
    })

    context("Scénario d'Erreur", () => {
        it("Tentative d'ajout invalide par email déjà pris", () => {
            // Mock 400 error when email exists
            cy.intercept("POST", API_URL, {
                statusCode: 400,
                body: { message: "Cet email est déjà utilisé" },
            }).as("emailExists");

            // Navigation vers formulaire
            cy.visit("/register");

            // Remplissage invalide (email déjà pris)
            cy.get("input[name='firstName']").type(newUser2.firstName);
            cy.get("input[name='lastName']").type(newUser2.lastName);
            cy.get("input[name='email']").type(newUser.email);
            cy.get("input[name='birthDate']").type(newUser2.birthDate.toISOString().split('T')[0]);
            cy.get("input[name='postalCode']").type(newUser2.postalCode);
            cy.get("input[name='city']").type(newUser2.city);

            //Validation du formulaire
            cy.get("button[type='submit']").should("be.enabled").click();
            
            // Wait for API call
            cy.wait("@emailExists");

            // Vérifier l'erreur
            cy.get(".Toastify__toast--error").should("contain", "Cet email est déjà utilisé");

            // Form data should be preserved
            cy.get("input[name='firstName']").should("have.value", newUser2.firstName);
            cy.get("input[name='email']").should("have.value", newUser.email);
        });

        it("Tentative d'ajout invalide par champ Ville vide", () => {
            // Mock successful response but field is empty so validation should fail
            cy.intercept("POST", API_URL, {
                statusCode: 201,
                body: { id: 12 },
            }).as("createUser");

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

            // API should NOT be called because form is invalid
            cy.get("@createUser.all").then((interceptions) => {
                expect(interceptions).to.have.length(0);
            });
        });
    });
})