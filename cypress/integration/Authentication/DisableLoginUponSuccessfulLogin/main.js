import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

import '../../../../common/cypress/integration/Authentication/common/PersonaType'
import { login } from '../../../../common/cypress/integration/Authentication/common/Helpers'

before(() => {
  cy.log(
    'Will this run before all DisableLoginUponSuccessfulLogin.feature test, but NEVER for other feature files?'
  )
})

beforeEach(() => {
  cy.log('This will run before every scenario of DisableLoginUponSuccessfulLogin.feature test, but NEVER for other feature files')
})

Given("un {PersonaType} identifié", function (persona) {
  login(persona)
})

When("il accède à l'interface admin", function () {
  cy.visit('/')
})

Then("il est redirigé vers la page d'accueil", function () {
  cy.url().should('not.include', '/login')
  cy.get('[id="LoginForm"]').should('not.exist')
})