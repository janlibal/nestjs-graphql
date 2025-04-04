//eslint-disable-next-line
require('dotenv').config()

export const API_PREFIX = '/api/graphql'

export const loggingRedactPaths = [
  'id',
  'password',
  'provider',
  'role',
  'status',
]
