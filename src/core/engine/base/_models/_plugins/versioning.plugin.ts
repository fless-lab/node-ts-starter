import { Schema, Document } from 'mongoose';

interface IVersionedDocument extends Document {
  __version__: number;
}

const versioningPlugin = (schema: Schema) => {
  schema.add({ __version__: { type: Number, default: 0 } });

  const incrementVersion = (update: any) => {
    if (update) {
      if (!update.$set) {
        update.$set = {};
      }
      update.$set.__version__ = (update.$set.__version__ || 0) + 1;
    }
  };

  schema.pre<IVersionedDocument>('save', function (next) {
    if (!this.isNew) {
      this.__version__ += 1;
    }
    next();
  });

  schema.pre('updateOne', function (next) {
    incrementVersion(this.getUpdate());
    next();
  });

  schema.pre('updateMany', function (next) {
    incrementVersion(this.getUpdate());
    next();
  });

  schema.pre('findOneAndUpdate', function (next) {
    incrementVersion(this.getUpdate());
    next();
  });
};

export default versioningPlugin;
