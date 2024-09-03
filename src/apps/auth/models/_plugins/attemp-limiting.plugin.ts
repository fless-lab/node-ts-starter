/**
 * Ceci c'est juste un exemple de plugin
 */

import { Schema } from 'mongoose';

export const attemptLimitingPlugin = (
  schema: Schema,
  options?: { maxAttempts?: number },
) => {
  schema.add({ attempts: { type: Number, default: 0 } });

  schema.methods.incrementAttempts = async function () {
    this.attempts += 1;
    const maxAttempts = options?.maxAttempts || 3;

    if (this.attempts >= maxAttempts) {
      this.used = true;
      this.isFresh = false;
    }
    await this.save();
  };
};
