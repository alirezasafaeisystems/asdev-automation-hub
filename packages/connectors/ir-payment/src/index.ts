export async function runAction(ctx: { idempotencyKey: string }, input: { amount: string }) {
  return { output: { invoiceId: `inv_${ctx.idempotencyKey}`, payUrl: `https://local.pay/${input.amount}` } };
}
