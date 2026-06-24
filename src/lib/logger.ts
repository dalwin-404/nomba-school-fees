type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: Record<string, unknown>;
  requestId?: string;
}

export function log(entry: Omit<LogEntry, 'timestamp'>) {
  const full: LogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  switch (entry.level) {
    case 'error':
      console.error(JSON.stringify(full));
      break;
    case 'warn':
      console.warn(JSON.stringify(full));
      break;
    default:
      console.log(JSON.stringify(full));
  }
}

export function logInfo(context: string, message: string, data?: Record<string, unknown>) {
  log({ level: 'info', context, message, data });
}

export function logWarn(context: string, message: string, data?: Record<string, unknown>) {
  log({ level: 'warn', context, message, data });
}

export function logError(context: string, message: string, data?: Record<string, unknown>) {
  log({ level: 'error', context, message, data });
}
