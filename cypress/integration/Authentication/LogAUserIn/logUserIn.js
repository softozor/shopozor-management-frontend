import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
const moment = require('moment')

import { connectWithUserCredentials } from './Helpers'
import './SessionDurationType'
import './PersonaType'
import { injectResponseFixtureIfFaked } from '../../common/fakeServer'

before(() => {
  cy.log(
    'Will this run before all LogAUserIn.feature test, but NEVER for other feature files?'
  )
})

beforeEach(() => {
  cy.log('This will run before every scenario of LogAUserIn.feature test, but NEVER for other feature files')
})

let loginMoment

Given('un utilisateur non identifié', () => {
  cy.getCookie('user_session').should('not.exist')
})

When(
  "un utilisateur s'identifie avec un e-mail et un mot de passe invalides",
  function () {
    injectResponseFixtureIfFaked('Authentication/LogAUserIn/Responses/InvalidCredentials')
    cy.visit('/login')
    cy.fixture('Authentication/LogAUserIn/Credentials/InvalidEmailAndPassword')
      .then(user => connectWithUserCredentials(user.email, user.password))
  }
)

When(
  "un {PersonaType} s'identifie avec un e-mail et un mot de passe valides",
  function (persona) {
    injectResponseFixtureIfFaked(`Authentication/LogAUserIn/Responses/${persona}`)
    cy.fixture(`Authentication/LogAUserIn/Credentials/${persona}`)
      .then(user => connectWithUserCredentials(user.email, user.password))
    loginMoment = moment()
  }
)

When(
  "un {PersonaType} s'identifie avec un e-mail valide et un mot de passe invalide",
  function (persona) {
    injectResponseFixtureIfFaked('Authentication/LogAUserIn/Responses/InvalidCredentials')
    cy.fixture(`Authentication/LogAUserIn/Credentials/${persona}`)
      .then(user => connectWithUserCredentials(user.email, user.password + 'a'))
  }
)

Then("sa session s'ouvre", () => {
  // TODO: decode the token and get the expiry!
  const cookie = cy.getCookie('user_session')
  console.log('cookie = ', cookie.expiry)
  cookie
    .should('exist')
    .and('have.property', 'expiry')
  if (cookie.expiry !== undefined) {
    const expiryDate = moment(cookie.expiry)
    expect(
      moment.duration(expiryDate.diff(loginMoment)).asSeconds()
    ).to.be.closeTo(duration.asSeconds(), 60)
  }
})

Then(
  "il obtient un message d'erreur stipulant que ses identifiants sont incorrects",
  () => {
    cy.get('.incorrectIdentifiers')
      .should('exist')
      .and('be.visible')
  }
)

Then("il ne peut plus accéder à l'interface d'identification", () => {
  cy.visit('/login')
  cy.url().should('not.match', '/login')
})
