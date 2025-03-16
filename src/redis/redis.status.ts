function handleConnect() {
  console.log('Connecting to Redis...', { type: 'REDIS_CONNECTING' })
}

function handleReady() {
  console.log('Redis connected!', { type: 'REDIS_CONNECTED' })
}

function handleClose() {
  console.log('Redis disconnected!', { type: 'REDIS_DISCONNECTED' })
}

function handleReconnecting() {
  console.log('Redis reconnecting!', { type: 'REDIS_RECONNECTING' })
}

function handleEnd() {
  console.log('Redis connection ended!', { type: 'REDIS_CONN_ENDED' })
}

function handleError(err: any) {
  console.log('Redis error occurred!', { type: 'REDIS_ERROR', err })
}

export const redisStatus = {
  handleClose,
  handleConnect,
  handleReady,
  handleReconnecting,
  handleEnd,
  handleError,
}
