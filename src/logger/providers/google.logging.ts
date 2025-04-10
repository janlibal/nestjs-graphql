import { Options } from 'pino-http'

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const PinoLevelToGoogleLoggingSeverityLookup = Object.freeze({
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL'
})

export function googleLoggingConfig(): Options {
  return {
    messageKey: 'message',
    formatters: {
      level(label, number) {
        return {
          severity:
            PinoLevelToGoogleLoggingSeverityLookup[label] ||
            PinoLevelToGoogleLoggingSeverityLookup['info'],
          level: number
        }
      }
    }
  }
}
