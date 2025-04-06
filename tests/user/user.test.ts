import request from 'supertest'
import { describe, it, expect } from 'vitest'
import { API, APP_URL, END_POINT, VER } from '../utils/constants'

describe('Auth', () => {
  const app = APP_URL
  const endPoint = `${API}/${VER}/${END_POINT}`

  describe('User', () => {
    describe('MUTATION > createUser', () => {
      it('should return created user data', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                role: { id: 1},
                status: { id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.data.createUser.firstName).toMatch('Joe')
        expect(response.body.data.createUser.lastName).toMatch('Doe')
        expect(response.body.data.createUser.email).toMatch(
          'joe.doe@joedoe.com'
        )
        expect(response.body.data.createUser.password).toMatch(
          /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
        )
        expect(response.body.data.createUser.provider).toMatch('email')
        expect(response.body.data.createUser.status.id).toBe(1)
        expect(response.body.data.createUser.role.id).toBe(1)
      })
      it('should throw error when firstName is empty', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Firstname cannot be empty and must be a string. Firstname must be longer than 1 character.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Firstname cannot be empty and must be a string. Firstname must be longer than 1 character./i
        )
      })
      it('should throw error when firstName less than 2 characters long', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "J",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Firstname must be longer than 1 character.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Firstname must be longer than 1 character./i
        )
      })
      it('should throw error when firstName contains special characters', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "@#@#",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Firstname cannot contain special characters or numbers.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Firstname cannot contain special characters or numbers./i
        )
      })
      it('should throw error when firstName consists of only numbers', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "123",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Firstname cannot contain special characters or numbers.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Firstname cannot contain special characters or numbers./i
        )
      })
      it('should throw error when lastName is empty', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "Joe",
                lastName: "",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Lastname cannot be empty and must be a string.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Lastname cannot be empty and must be a string./i
        )
      })
      it('should throw error when lastName less than 2 characters long', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "Joe",
                lastName: "D",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Lastname must be longer than 1 character.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Lastname must be longer than 1 character./i
        )
      })
      it('should throw error when lastName contains special characters', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "Joe",
                lastName: "#$#$#",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Lastname cannot contain special characters or numbers.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Lastname cannot contain special characters or numbers./i
        )
      })
      it('should throw error when lastName consists of only numbers', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "Joe",
                lastName: "123",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Lastname cannot contain special characters or numbers.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Lastname cannot contain special characters or numbers./i
        )
      })
      it('should throw error when password is empty', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Password cannot be empty.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Password cannot be empty./i
        )
      })
      it('should throw error when password is less than 6 characters long', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Pas1!",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Password must be at least 6 characters long.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Password must be at least 6 characters long./i
        )
      })
      it('should throw error when password is more than 20 characters long', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!Password123!Password123!Password123!Password123!Password123!",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Passwword can contain 20 characters at the most.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Passwword can contain 20 characters at the most./i
        )
      })
      it('should throw error when password is weak', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Pas",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Password must be at least 6 characters long. Password is too weak'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Password must be at least 6 characters long. Password is too weak/i
        )
      })
      it('should throw error when email is invalid', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              createUser(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doejoedoe.com",
                password: "Password123!",
                role: {id: 1},
                status: {id: 1}
              }) {
                firstName
                lastName
                email
                provider
                password
                status { id }
                role { id }
              }
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch('Email is invalid.')
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Email is invalid./i
        )
      })
    })
  })
})
