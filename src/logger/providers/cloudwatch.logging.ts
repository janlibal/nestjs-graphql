import { Options } from 'pino-http'

export function cloudwatchLoggingConfig(): Options {
  // FIXME: Implement AWS CloudWatch logging configuration
  return {
    messageKey: 'msg',
    transport: {
      target: 'pino-cloudwatch', // Use the pino-cloudwatch transport
      options: {
        logGroupName: 'test-log-group', // CloudWatch Log Group name
        logStreamName: 'test-log-stream', // CloudWatch Log Stream name
        region: 'us-east-1', // AWS Region
        createLogGroup: true, // Automatically create log group if it doesn't exist
        createLogStream: true, // Automatically create log stream if it doesn't exist
        pinoOptions: {
          level: 'info', // Optional: Set logging level for Pino
          timestamp: new Date(Date.now()).toISOString()
        }
      }
    }
  }
}
