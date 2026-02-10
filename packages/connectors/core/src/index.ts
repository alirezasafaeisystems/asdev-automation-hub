export async function runAction(ctx: { idempotencyKey: string }, input: Record<string, unknown>) {
  return { output: { id: `case_${ctx.idempotencyKey}`, ...input } };
}
