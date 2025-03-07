import request from 'supertest'
import { describe, it, expect } from 'vitest'
import { APP_URL } from '../utils/constants'

describe('App', () => {
  const app = APP_URL

  describe('App', () => {
    it('should return hello (GET)', async () => {
      const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          query {
            hello {
              message
            }
          }
        `,
      })
      .expect(200)
      
      expect(response.body.data.hello.message).toMatch('Hello World!')
    })
  })
})
