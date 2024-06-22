import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  PipelineStage,
} from 'mongoose';

export class BaseRepository<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(input: Partial<T>): Promise<T> {
    const document = new this.model(input);
    return await document.save();
  }

  async findAll(
    query: FilterQuery<T> = {},
    options: QueryOptions = {},
  ): Promise<T[]> {
    return await this.model.find(query, null, options).exec();
  }

  async findOne(
    query: FilterQuery<T>,
    options: QueryOptions = {},
  ): Promise<T | null> {
    return await this.model.findOne(query, null, options).exec();
  }

  async update(
    query: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: QueryOptions = {},
  ): Promise<T | null> {
    return await this.model
      .findOneAndUpdate(query, update, { new: true, ...options })
      .exec();
  }

  async delete(
    query: FilterQuery<T>,
    options: QueryOptions = {},
  ): Promise<T | null> {
    return await this.model.findOneAndDelete(query, options).exec();
  }

  async countDocuments(query: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(query).exec();
  }

  async aggregate(pipeline: PipelineStage[]): Promise<any[]> {
    return await this.model.aggregate(pipeline).exec();
  }
}
