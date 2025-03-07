import { beforeEach } from 'vitest'
import resetDb from './reset-db'

beforeEach(async () => {
  await resetDb()
})
//docker-compose down --rmi all --volumes --remove-orphans
