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
      dkd_error_message: dkdError.message
    };
  }
  return { dkd_error_message: String(dkdError) };
}
