import request from 'supertest'
import { describe, it, expect } from 'vitest'
import { API, APP_URL, END_POINT, VER } from '../utils/constants'

describe('Auth', () => {
  const app = APP_URL
  const endPoint = `${API}/${VER}/${END_POINT}`

  describe('User', () => {
    describe('MUTATION > creaateUser', () => {
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
          `,
          })
          .expect(200)
        expect(response.body.data.createUser.firstName).toMatch('Joe')
        expect(response.body.data.createUser.lastName).toMatch('Doe')
        expect(response.body.data.createUser.email).toMatch(
          'joe.doe@joedoe.com',
        )
        expect(response.body.data.createUser.password).toMatch(
          /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        )
        expect(response.body.data.createUser.provider).toMatch('email')
        expect(response.body.data.createUser.status.id).toBe(1)
        expect(response.body.data.createUser.role.id).toBe(1)
      })
      it('should throw erro when firstName is empty', async () => {
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
          `,
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
        )
        expect(response.body.errors[0].path).toMatch('createUser')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Firstname cannot be empty and must be a string. Firstname must be longer than 1 character.',
        )
        //expect(response.body.errors[0].error).toMatch('Bad request')
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Firstname cannot be empty and must be a string. Firstname must be longer than 1 character./i,
        )
      })
    })
  })
})
