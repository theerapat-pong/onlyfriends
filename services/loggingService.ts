import { LogEntry, LogType } from '../types';

/**
 * Creates a new log entry object.
 * @param message The log message.
 * @param type The type of log entry.
 * @returns A new LogEntry object.
 */
export const createLogEntry = (message: string, type: LogType): LogEntry => {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    type,
    message,
  };
};
