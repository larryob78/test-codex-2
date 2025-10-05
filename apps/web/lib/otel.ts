import { trace, context } from '@opentelemetry/api';

export function withSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const tracer = trace.getTracer('web');
  return tracer.startActiveSpan(name, (span) => {
    return fn()
      .then((result) => {
        span.end();
        return result;
      })
      .catch((error) => {
        span.recordException(error as Error);
        span.setStatus({ code: 2 });
        span.end();
        throw error;
      });
  }, undefined, context.active());
}
