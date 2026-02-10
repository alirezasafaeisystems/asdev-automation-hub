export async function runAction(ctx: { idempotencyKey: string }, input: { to: string; message: string }) {
  return { output: { messageId: `sms_${ctx.idempotencyKey}`, to: input.to } };
}
