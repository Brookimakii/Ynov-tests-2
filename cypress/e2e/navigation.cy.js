describe("Navigation Scenarios - E2E", () => {
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

            // Accueil
            cy.visit("/");
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
            cy.get(".Toastify__toast").should("contain", "Formulaire soumis avec succès !");
            
            // Retour à l'accueil et vérification de l'ajout de l'utilisateur
            cy.visit("/");
            cy.contains("1 utilisateur inscrit");
            cy.get("#user-list").should("exist");
            cy.get("#user-list").contains(newUser.firstName);
            cy.get("#user-list").contains(newUser.lastName);
        })
    })

    context("Scénario d'Erreur", () => {
        beforeEach(() => {
            // Recréer l'état précédent avec 1 utilisateur
            cy.visit("/");
            cy.window().then((win) => {
                win.localStorage.setItem("users", JSON.stringify([newUser]));
            });
        });
        it("Tentative d'ajout invalide par email déjà pris", () => {
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
            cy.get("button[type='submit']").should("be.disabled").click({ force: true });

            // Vérifier l'erreur
            cy.get(".error-message").contains("Cet email est déjà utilisé").should("exist");

            // Retour vers Accueil
            cy.visit("/");

            // Vérification Accueil toujours 1 utilisateur
            cy.contains("1 utilisateur inscrit");
            cy.get("#user-list").contains(newUser.firstName);
            cy.get("#user-list").contains(newUser.lastName);
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

            //Validation du formulaire
            cy.get("button[type='submit']").should("be.disabled").click({ force: true });

            // Retour vers Accueil
            cy.visit("/");

            // Vérification Accueil toujours 1 utilisateur
            cy.contains("1 utilisateur inscrit");
            cy.get("#user-list").contains(newUser.firstName);
            cy.get("#user-list").contains(newUser.lastName);
        });
    });
})