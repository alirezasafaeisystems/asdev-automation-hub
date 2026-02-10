const tokenRegex = /\{\{([^}]+)\}\}/g;

export type InterpolationContext = {
  trigger: Record<string, unknown>;
  steps: Record<string, { output: Record<string, unknown> }>;
  env: Record<string, string | undefined>;
};

function readPath(source: unknown, path: string[]): unknown {
  return path.reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

export function resolveTemplate(raw: string, ctx: InterpolationContext): string {
  return raw.replace(tokenRegex, (_, expr: string) => {
    const path = expr.trim().split('.');
    const [root, ...rest] = path;
    if (!root) {
      return '';
    }

    if (root === 'trigger') {
      const value = readPath(ctx.trigger, rest);
      return value == null ? '' : String(value);
    }

    if (root === 'env') {
      const value = readPath(ctx.env, rest);
      return value == null ? '' : String(value);
    }

    const stepId = root;
    const value = readPath(ctx.steps[stepId]?.output, rest);
    return value == null ? '' : String(value);
  });
}

export function interpolateObject<T>(input: T, ctx: InterpolationContext): T {
  if (typeof input === 'string') {
    return resolveTemplate(input, ctx) as T;
  }
  if (Array.isArray(input)) {
    return input.map((item) => interpolateObject(item, ctx)) as T;
  }
  if (input && typeof input === 'object') {
    const mapped = Object.entries(input as Record<string, unknown>).map(([k, v]) => [k, interpolateObject(v, ctx)]);
    return Object.fromEntries(mapped) as T;
  }
  return input;
}
