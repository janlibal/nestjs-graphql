import request from 'supertest'
import { describe, it, expect } from 'vitest'
import { API, APP_URL, END_POINT, VER } from '../utils/constants'

describe('App', () => {
  const app = APP_URL
  const endPoint = `${API}/${VER}/${END_POINT}`

  describe('App', () => {
    describe('QUEY > hello', () => {
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
          `,
          })
          .expect(200)
        expect(response.body.data.hello.message).toMatch(
          `Hello World! ${mockName}`,
        )
      })
    })
  })
})
