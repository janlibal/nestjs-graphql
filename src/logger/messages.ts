import { type IncomingMessage, type ServerResponse } from 'http'

export const customSuccessMessage = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  responseTime: number
) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - ${responseTime} ms`
}

export const customReceivedMessage = (req: IncomingMessage) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}"`
}

export const customErrorMessage = (req, res, err) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - message: ${err.message}`
}
