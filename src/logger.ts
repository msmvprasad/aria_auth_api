class Logger {
  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }

  info(message: string): void {
    console.log(this.format('info', message));
  }

  warn(message: string): void {
    console.warn(this.format('warn', message));
  }

  error(message: string): void {
    console.error(this.format('error', message));
  }
}

export default new Logger();
