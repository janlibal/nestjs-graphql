import { Options } from 'pino-http'
//import * as rfs from 'rotating-file-stream' --- any of use eventually?

export function consoleLoggingConfig(): Options {
  return {
    messageKey: 'msg',
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          level: 'debug',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignorePaths: ['pid', 'hostname']
          }
        },
        {
          target: 'pino/file',
          level: 'debug',
          options: {
            destination: './logs/app.log',
            mkdir: true
          }
        },
        {
          target: 'pino/file',
          level: 'error',
          options: {
            destination: './logs/app-error.log',
            mkdir: true
          }
        }
      ]
    }
  }
}
