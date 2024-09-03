import { Schema } from 'mongoose';
const indexPlugin = (
  schema: Schema,
  options: { fields: Record<string, 1 | -1 | 'text' | 'hashed'> },
) => {
  schema.index(options.fields);
};

export default indexPlugin;
