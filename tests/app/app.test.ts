import request from 'supertest'
import { describe, it, expect } from 'vitest'
import { API, APP_URL, END_POINT, VER } from '../utils/constants'

describe('App', () => {
  const app = APP_URL
  const endPoint = `${API}/${VER}/${END_POINT}`

  describe('App', () => {
    describe('QUERY > hello', () => {
      it('should greet with Hello World', async () => {
        const mockName: string = 'John'

        const response = await request(app)
          .post(`/${endPoint}`)
          //.set('Authorization', `Bearer ${mockToken}`)
          .send({
            query: `
            query {
              hello(name: "${mockName}") {
                message
              }
            }
          `
          })
          .expect(200)
        if (response.body.errors) {
          console.error('❌ GraphQL Errors:', JSON.stringify(response.body.errors, null, 2))
        }

        expect(response.body.errors).toBeUndefined()

        if (!response.body?.data?.hello) {
          console.error('❌ Invalid response:', JSON.stringify(response.body, null, 2))
          throw new Error('Expected data.hello to be defined but got null.')
        }
        expect(response.body.data.hello.message).toMatch(`Hello World! ${mockName}`)
      })
    })
  })
})
