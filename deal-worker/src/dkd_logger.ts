export type DkdLogLevel = 'debug' | 'info' | 'warn' | 'error';

export function dkdLog(dkdLevel: DkdLogLevel, dkdMessage: string, dkdMeta: Record<string, unknown> = {}): void {
  const dkdPayload = {
    dkd_time: new Date().toISOString(),
    dkd_level: dkdLevel,
    dkd_message: dkdMessage,
    ...dkdMeta
  };
  const dkdLine = JSON.stringify(dkdPayload);
  if (dkdLevel === 'error') console.error(dkdLine);
  else if (dkdLevel === 'warn') console.warn(dkdLine);
  else console.log(dkdLine);
}

export function dkdSafeError(dkdError: unknown): Record<string, unknown> {
  if (dkdError instanceof Error) {
    return {
      dkd_error_name: dkdError.name,
      dkd_error_message: dkdError.message,
      dkd_error_stack: dkdError.stack
    };
  }

  if (dkdError && typeof dkdError === 'object') {
    try {
      return {
        dkd_error_message: JSON.stringify(dkdError),
        dkd_error_type: 'object'
      };
    } catch {
      return {
        dkd_error_message: '[unserializable object]',
        dkd_error_type: 'object'
      };
    }
  }

  return { dkd_error_message: String(dkdError) };
}
