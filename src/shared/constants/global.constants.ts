//eslint-disable-next-line
require('dotenv').config()

export const API_PREFIX = '/api/graphql'

export const sensitiveKeys = [
  'id',
  'password',
  'provider',
  'role',
  'status',
  'token',
  'refreshToken',
  'headers.authorization'
]

export enum LogService {
  CONSOLE = 'console',
  GOOGLE_LOGGING = 'google_logging',
  AWS_CLOUDWATCH = 'aws_cloudwatch'
}
