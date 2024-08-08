// /src/lib/overrideConsole.js
import { logToFile } from './logger'

// Save the original console methods
const originalConsoleLog = console.log
const originalConsoleError = console.error

// Override console.log
console.log = (...args) => {
  // Log to the original console
  originalConsoleLog(...args)

  // Convert arguments to string and log to the file
  logToFile(args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' '))
}

// Override console.error
console.error = (...args) => {
  // Log to the original console
  originalConsoleError(...args)

  // Convert arguments to string and log to the file
  logToFile(args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' '))
}
