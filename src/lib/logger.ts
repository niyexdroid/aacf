/**
 * Simple in-memory logging system for monitoring
 * Stores recent logs with timestamps and log levels
 */

export type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'cache' | 'db' | 'api';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 500; // Keep last 500 logs
  private listeners: Set<(logs: LogEntry[]) => void> = new Set();

  /**
   * Add a log entry
   */
  log(level: LogLevel, message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      message,
      metadata,
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Notify listeners
    this.notifyListeners();

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      const emoji = this.getEmoji(level);
      console.log(`${emoji} [${level.toUpperCase()}] ${message}`, metadata || '');
    }
  }

  /**
   * Convenience methods
   */
  info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, metadata);
  }

  success(message: string, metadata?: Record<string, any>) {
    this.log('success', message, metadata);
  }

  warning(message: string, metadata?: Record<string, any>) {
    this.log('warning', message, metadata);
  }

  error(message: string, metadata?: Record<string, any>) {
    this.log('error', message, metadata);
  }

  cache(message: string, metadata?: Record<string, any>) {
    this.log('cache', message, metadata);
  }

  db(message: string, metadata?: Record<string, any>) {
    this.log('db', message, metadata);
  }

  api(message: string, metadata?: Record<string, any>) {
    this.log('api', message, metadata);
  }

  /**
   * Get recent logs
   */
  getLogs(limit?: number): LogEntry[] {
    if (limit) {
      return this.logs.slice(-limit);
    }
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: LogLevel, limit?: number): LogEntry[] {
    const filtered = this.logs.filter(log => log.level === level);
    if (limit) {
      return filtered.slice(-limit);
    }
    return filtered;
  }

  /**
   * Clear all logs
   */
  clear() {
    this.logs = [];
    this.notifyListeners();
  }

  /**
   * Subscribe to log updates
   */
  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all subscribers
   */
  private notifyListeners() {
    this.listeners.forEach(listener => {
      listener(this.getLogs());
    });
  }

  /**
   * Get emoji for log level
   */
  private getEmoji(level: LogLevel): string {
    const emojis: Record<LogLevel, string> = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      cache: '💾',
      db: '🗄️',
      api: '🔌',
    };
    return emojis[level] || '📝';
  }

  /**
   * Get statistics
   */
  getStats() {
    const stats: Record<LogLevel, number> = {
      info: 0,
      success: 0,
      warning: 0,
      error: 0,
      cache: 0,
      db: 0,
      api: 0,
    };

    this.logs.forEach(log => {
      stats[log.level]++;
    });

    return {
      total: this.logs.length,
      byLevel: stats,
    };
  }
}

// Singleton instance
const logger = new Logger();

// Log initialization
logger.info('Logger initialized', { timestamp: new Date().toISOString() });

export default logger;

/**
 * Middleware-style logger for API routes
 */
export function logApiRequest(method: string, path: string, duration: number, status: number) {
  const level: LogLevel = status >= 500 ? 'error' : status >= 400 ? 'warning' : 'success';
  logger.api(`${method} ${path} - ${status}`, { method, path, duration, status });
}

/**
 * Log cache operations
 */
export function logCacheOperation(operation: 'hit' | 'miss' | 'set' | 'delete', key: string) {
  const messages = {
    hit: `Cache HIT: ${key}`,
    miss: `Cache MISS: ${key}`,
    set: `Cache SET: ${key}`,
    delete: `Cache DELETE: ${key}`,
  };
  logger.cache(messages[operation], { operation, key });
}

/**
 * Log database operations
 */
export function logDbOperation(operation: string, table: string, duration: number) {
  logger.db(`${operation} on ${table} (${duration.toFixed(0)}ms)`, { operation, table, duration });
}
