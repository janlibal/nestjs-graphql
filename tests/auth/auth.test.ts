import request from 'supertest'
import { describe, it, expect } from 'vitest'
import { API, APP_URL, END_POINT, VER } from '../utils/constants'
import { usr } from '../helpers/mock.data'

describe('Auth', () => {
  const app = APP_URL
  const endPoint = `${API}/${VER}/${END_POINT}`

  describe('Auth', () => {
    describe('MUTATION > logout', () => {
      let newUserApiToken: any
      let bareToken: any
      it('should logout user and return true', async () => {
        await request(app)
          .post(`/${endPoint}`)
          .send({
            query: `
                mutation {
                    login (input: {
                        email: "daniel.doe@joedoe.com", 
                        password: "Password123!"
                    })
                    {
                       token
                    }
                    }
              `
          })
          .expect(200)
          .then((loginResponse) => {
            ;(bareToken = loginResponse.body.data.login.token),
              (newUserApiToken = 'jwt ' + bareToken)
          })
        const response = await request(app)
          .post(`/${endPoint}`)
          .set('Authorization', newUserApiToken)
          .send({
            query: `
            mutation {
              logout
            }
          `
          })
          .expect(200)
      })
    })
    describe('QUERY > me', () => {
      let newUserApiToken: any
      let bareToken: any
      it('should return user data', async () => {
        await request(app)
          .post(`/${endPoint}`)
          .send({
            query: `
                mutation {
                    login (input: {
                        email: "daniel.doe@joedoe.com", 
                        password: "Password123!"
                    })
                    {
                       token
                    }
                    }
              `
          })
          .expect(200)
          .then((loginResponse) => {
            ;(bareToken = loginResponse.body.data.login.token),
              (newUserApiToken = 'jwt ' + bareToken)
          })

        const response = await request(app)
          .post(`/${endPoint}`)
          .set('Authorization', newUserApiToken)
          .send({
            query: `
                query {
                    me
                    {
                       id,
                       email,
                       firstName,
                       lastName,
                       role { id }
                       status { id }
                    }
                    }
              `
          })
          .expect(200)
        expect(response.body.data.me.id).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
        )
        expect(response.body.data.me.email).toMatch(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        )
        expect(response.body.data.me.firstName).toMatch(usr.firstName)
        expect(response.body.data.me.lastName).toMatch(usr.lastName)
        expect(response.body.data.me.role.id).toBe(usr.roleId)
        expect(response.body.data.me.status.id).toBe(usr.statusId)
      })

      it('should fail with no token provided', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', newUserApiToken)
          .send({
            query: `
                query {
                    me
                    {
                       id,
                       email,
                       firstName,
                       lastName,
                       role { id }
                       status { id }
                    }
                    }
              `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('me')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('me')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(401)
        expect(response.body.errors[0].message).toMatch('No authorization!')
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /UnauthorizedException: No authorization!/i
        )
      })

      it('should fail with missing jwt prefix', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          .set('Authorization', 'newUserApiToken')
          .send({
            query: `
                query {
                    me
                    {
                       id,
                       email,
                       firstName,
                       lastName,
                       role { id }
                       status { id }
                    }
                    }
              `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('me')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('me')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(401)
        expect(response.body.errors[0].message).toMatch('No jwt!')
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /UnauthorizedException: No jwt!/i
        )
      })

      it('should fail when no token provided', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          .set('Authorization', 'jwt ')
          .send({
            query: `
                query {
                    me
                    {
                       id,
                       email,
                       firstName,
                       lastName,
                       role { id }
                       status { id }
                    }
                    }
              `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('me')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('me')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(401)
        expect(response.body.errors[0].message).toMatch('No token provided')
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /UnauthorizedException: No token provided/i
        )
      })
    })
    describe('MUTATION > login', () => {
      it('should return session data after successful login', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
                mutation {
                    login (input: {
                        email: "daniel.doe@joedoe.com", 
                        password: "Password123!"
                    })
                    {
                      user { 
                          email
                          firstName
                          lastName
                          status { id }
                          role { id }
                       }
                       token,
                       refreshToken,
                       tokenExpires
 
                    }
                    }
              `
          })
          .expect(200)
        expect(response.body.data.login.user.email).toMatch(usr.email)
        expect(response.body.data.login.user.firstName).toMatch(usr.firstName)
        expect(response.body.data.login.user.lastName).toMatch(usr.lastName)
        expect(response.body.data.login.user.status.id).toBe(usr.statusId)
        expect(response.body.data.login.user.role.id).toBe(usr.roleId)
        expect(response.body.data.login.token).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
        )
        expect(response.body.data.login.refreshToken).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
        )
        expect(response.body.data.login.tokenExpires).toBeDefined()
      })
      it('should throw error when password is empty', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
                mutation {
                    login (input: {
                        email: "jan.libal@joedoe.com", 
                        password: ""
                    })
                    {
                      user { 
                          email
                          firstName
                          lastName
                          status { id }
                          role { id }
                       }
                       token,
                       refreshToken,
                       tokenExpires
 
                    }
                    }
              `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('login')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('login')
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
      it('should throw error when email is invalid', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
                mutation {
                    login (input: {
                        email: "jan.libaljoedoe.com", 
                        password: "Password123!"
                    })
                    {
                      user { 
                          email
                          firstName
                          lastName
                          status { id }
                          role { id }
                       }
                       token,
                       refreshToken,
                       tokenExpires
 
                    }
                    }
              `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('login')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('login')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch('Email is invalid.')
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Email is invalid./i
        )
      })
      it('should throw error when email is invalid and password is empty', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
                mutation {
                    login (input: {
                        email: "jan.libaljoedoe.com", 
                        password: ""
                    })
                    {
                      user { 
                          email
                          firstName
                          lastName
                          status { id }
                          role { id }
                       }
                       token,
                       refreshToken,
                       tokenExpires
 
                    }
                    }
              `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('login')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('login')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Password cannot be empty. Email is invalid.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Password cannot be empty. Email is invalid./i
        )
      })
      it('should throw error when email and password are empty', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
                mutation {
                    login (input: {
                        email: "", 
                        password: ""
                    })
                    {
                      user { 
                          email
                          firstName
                          lastName
                          status { id }
                          role { id }
                       }
                       token,
                       refreshToken,
                       tokenExpires
 
                    }
                    }
              `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('login')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('login')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Password cannot be empty. Email is invalid.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Password cannot be empty. Email is invalid./i
        )
      })
    })

    describe('MUTATION > register', () => {
      it('should register a new user and return true', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              register(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
              })
            }
          `
          })
          .expect(200)
      })
      it('should throw error when firstName is empty', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              register(input: {
                firstName: "",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!"
              })
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
              register(input: {
                firstName: "J",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!"
              }) 
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
                register(input: {
                firstName: "@#@#",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                
              })
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
                register(input: {
                firstName: "123",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                
              })
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
                register(input: {
                firstName: "Joe",
                lastName: "",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                
              })
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
                register(input: {
                firstName: "Joe",
                lastName: "D",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                
              })
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
              register(input: {
                firstName: "Joe",
                lastName: "#$#$#",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                 
                  
              })   
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
              register(input: {
                firstName: "Joe",
                lastName: "123",
                email: "joe.doe@joedoe.com",
                password: "Password123!",
                 
                  
              })   
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
              register(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "",
                 
                  
              })   
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
              register(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Pas1!",
                 
                  
              })   
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
              register(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Password123!Password123!Password123!Password123!Password123!Password123!",
                 
                  
              })   
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
              register(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doe@joedoe.com",
                password: "Pas",
                 
                  
              })   
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
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
              register(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "joe.doejoedoe.com",
                password: "Password123!",
                 
                  
              })   
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch('Email is invalid.')
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Email is invalid./i
        )
      })
      it('should throw error when only firstName is valid', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              register(input: {
                firstName: "Joe",
                lastName: "",
                email: "",
                password: "",
                 
                  
              })   
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Lastname cannot be empty and must be a string. Lastname must be longer than 1 character. Password cannot be empty. Password must be at least 6 characters long. Password is too weak Email is invalid.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Lastname cannot be empty and must be a string. Lastname must be longer than 1 character. Password cannot be empty. Password must be at least 6 characters long. Password is too weak Email is invalid./i
        )
      })
      it('should throw error when only firstName and lastName are valid', async () => {
        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              register(input: {
                firstName: "Joe",
                lastName: "Doe",
                email: "",
                password: "",
                 
                  
              })   
            }
          `
          })
          .expect(200)
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
        )
        expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(400)
        expect(response.body.errors[0].message).toMatch(
          'Password cannot be empty. Password must be at least 6 characters long. Password is too weak Email is invalid.'
        )
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /BadRequestException: Password cannot be empty. Password must be at least 6 characters long. Password is too weak Email is invalid./i
        )
      })
      /*it('should throw error when email already exists', async () => {
        await request(app)
          .post(`/${endPoint}`)
          .send({
            query: `
            mutation {
              register(input: {
                firstName: "Jane",
                lastName: "Doe",
                email: "jane.doe@janedoe.com",
                password: "hasehedPassword123!",
              })   
            }
          `,
          })

        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            mutation {
              register(input: {
                firstName: "Jane",
                lastName: "Doe",
                email: "jane.doe@janedoe.com",
                password: "hasehedPassword123!",
              })   
            }
          `,
          })
          .expect(200)
          expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].timestamp).toMatch(
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
        )
          expect(response.body.errors[0].path).toMatch('register')
        expect(response.body.errors[0].locations[0].line).toBeDefined()
        expect(response.body.errors[0].locations[0].column).toBeDefined()
        expect(response.body.errors[0].code).toBe(409)
        expect(response.body.errors[0].message).toMatch('User already exists')
        expect(response.body.errors[0].statusCode).toBe(500)
        expect(response.body.errors[0].stack).toMatch(
          /ConflictException: User already exists/i,
        )
      })*/
    })
  })
})
