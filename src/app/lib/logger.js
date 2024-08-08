// /src/lib/logger.js
import fs from 'fs'
import path from 'path'

// Define the log file path
const logFilePath = path.join(process.cwd(), '/tmp', 'api.log')

// Ensure the logs directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true })
}

export const logToFile = (message) => {
  const timestamp = new Date().toISOString()
  const logMessage = `${timestamp} - ${message}\n`

  fs.appendFileSync(logFilePath, logMessage, 'utf8')
}
