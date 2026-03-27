


describe('Home page spec', {tags: '@database-up'}, () => {
    it('deployed react app to localhost', () => {
        cy.visit('http://localhost:3000');
        // cy.contains("1 user(s) already registered");
    })
})