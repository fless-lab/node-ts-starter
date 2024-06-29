import { Document } from 'mongoose';
import { BaseRepository } from '../repositories/base.repo';
import ErrorResponse from '../utils/handlers/error/response';
import { SuccessResponseType, ErrorResponseType } from '../utils/types';
import { escapeRegex, slugify } from '../../helpers/string';

export class BaseService<T extends Document, R extends BaseRepository<T>> {
  protected repository: R;
  protected handleSlug: boolean;
  protected uniqueFields: string[];
  protected populateFields: string[];
  protected allowedFilterFields?: string[];
  protected searchFields?: string[];

  constructor(
    repository: R,
    handleSlug = false,
    populateFields: string[] = [],
  ) {
    this.repository = repository;
    this.handleSlug = handleSlug;
    this.uniqueFields = this.detectUniqueFields();
    this.populateFields = populateFields;
  }

  private detectUniqueFields(): string[] {
    const uniqueFields: string[] = [];
    for (const path in this.repository['model'].schema.paths) {
      if (this.repository['model'].schema.paths[path].options?.unique) {
        uniqueFields.push(path);
      }
    }
    return uniqueFields;
  }

  private filterQueryFields(query: Record<string, any>): Record<string, any> {
    const filteredQuery: Record<string, any> = {};
    Object.keys(query)
      .filter((key) => this.allowedFilterFields?.includes(key))
      .forEach((key) => {
        filteredQuery[key] = query[key];
      });
    return filteredQuery;
  }

  private async ensureUniqueField(
    doc: Partial<T>,
    field: keyof T,
  ): Promise<void> {
    if (!doc[field]) return;
    const exists = await this.repository.findOne({
      [field]: doc[field],
      _id: { $ne: doc['_id'] },
    } as any);
    if (exists) {
      throw new ErrorResponse(
        'UNIQUE_FIELD_ERROR',
        `The ${String(field)} must be unique.`,
        [`Choose a different ${String(field)}.`],
      );
    }
  }

  private async ensureUniqueSlug(
    doc: Partial<T>,
    inputSlugField: keyof T = 'name' as any,
    slugField: keyof T = 'slug' as any,
  ): Promise<void> {
    if (!this.handleSlug || !doc[inputSlugField]) return;

    let slug = slugify(doc[inputSlugField] as unknown as string);
    let count = 0;
    let exists;
    do {
      exists = await this.repository.findOne({
        [slugField]: slug,
        _id: { $ne: doc['_id'] },
      } as any);
      if (exists)
        slug = `${slugify(doc[inputSlugField] as unknown as string)}-${++count}`;
    } while (exists);

    doc[slugField] = slug as unknown as T[keyof T];
  }

  private async ensureRequiredFields(input: Partial<T>): Promise<void> {
    const requiredFields: string[] = [];
    for (const path in this.repository['model'].schema.paths) {
      if (
        this.repository['model'].schema.paths[path].isRequired &&
        !Object.prototype.hasOwnProperty.call(input, path)
      ) {
        requiredFields.push(path);
      }
    }
    if (requiredFields.length > 0) {
      throw new ErrorResponse(
        'REQUIRED_FIELD_MISSING',
        `Required field(s) missing: ${requiredFields.join(', ')}.`,
        [`Please provide all required fields: ${requiredFields.join(', ')}.`],
      );
    }
  }

  async create(
    input: Partial<T>,
  ): Promise<SuccessResponseType<T> | ErrorResponseType> {
    try {
      for (const field of this.uniqueFields) {
        await this.ensureUniqueField(input, field as keyof T);
      }
      if (this.handleSlug) await this.ensureUniqueSlug(input);
      await this.ensureRequiredFields(input);
      const document = await this.repository.create(input);
      return { success: true, document };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse('DATABASE_ERROR', (error as Error).message),
      };
    }
  }

  async findAll({
    query = {},
    sort = {},
    page = 1,
    limit = 10,
    searchTerm = '',
    paginate = true,
  }: {
    query?: Record<string, any>;
    sort?: Record<string, any>;
    page?: number;
    limit?: number;
    searchTerm?: string;
    paginate?: boolean;
  } = {}): Promise<SuccessResponseType<T> | ErrorResponseType> {
    try {
      let searchQuery = this.filterQueryFields(query);
      if (searchTerm && this.searchFields?.length) {
        const regex = new RegExp(escapeRegex(searchTerm), 'i');
        const searchConditions = this.searchFields.map((field) => ({
          [field]: regex,
        }));
        searchQuery = { ...searchQuery, $or: searchConditions };
      }
      const documents = await this.repository.findAll(searchQuery, {
        sort,
        skip: (page - 1) * limit,
        limit: paginate ? limit : undefined,
      });
      const total = await this.repository.countDocuments();
      const _results = await this.repository.countDocuments(searchQuery);
      const results = paginate ? documents.length : total;
      return {
        success: true,
        total,
        _results,
        results,
        documents,
        page: paginate ? page : undefined,
        limit: paginate ? limit : undefined,
      };
    } catch (error) {
      return {
        success: false,
        total: 0,
        _results: 0,
        results: 0,
        documents: [],
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse('DATABASE_ERROR', (error as Error).message),
      };
    }
  }

  async findOne(
    query: Record<string, any>,
  ): Promise<SuccessResponseType<T> | ErrorResponseType> {
    try {
      const document = await this.repository.findOne(query);
      if (!document) {
        throw new ErrorResponse(
          'NOT_FOUND_ERROR',
          'The requested document was not found.',
        );
      }
      return { success: true, document };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse('DATABASE_ERROR', (error as Error).message),
      };
    }
  }

  async update(
    query: Record<string, any>,
    updateInput: Partial<T>,
  ): Promise<SuccessResponseType<T> | ErrorResponseType> {
    try {
      const documentToUpdate = await this.repository.findOne(query);
      if (!documentToUpdate) {
        throw new ErrorResponse(
          'NOT_FOUND_ERROR',
          'Document to update not found.',
        );
      }
      const fieldsToUpdate: Partial<T> = {};
      for (const key in updateInput) {
        if (updateInput[key] !== documentToUpdate[key]) {
          fieldsToUpdate[key as keyof T] = updateInput[key];
        }
      }
      for (const field of this.uniqueFields) {
        if (
          fieldsToUpdate[field as keyof T] &&
          fieldsToUpdate[field as keyof T] !==
            documentToUpdate[field as keyof T]
        ) {
          await this.ensureUniqueField(fieldsToUpdate, field as keyof T);
        }
      }
      const slugUpdateContext = {
        ...fieldsToUpdate,
        _id: documentToUpdate._id,
      };
      if (
        this.handleSlug &&
        (fieldsToUpdate as any).name &&
        (documentToUpdate as any).name !== (fieldsToUpdate as any).name
      ) {
        await this.ensureUniqueSlug(
          slugUpdateContext,
          'name' as any,
          'slug' as any,
        );
        (fieldsToUpdate as any).slug = (slugUpdateContext as any)
          .slug as unknown as T[keyof T];
      }
      const updatedDocument = await this.repository.update(
        query,
        fieldsToUpdate,
      );
      if (!updatedDocument) {
        throw new ErrorResponse(
          'NOT_FOUND_ERROR',
          'Updated document not found.',
        );
      }
      return { success: true, document: updatedDocument };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse('DATABASE_ERROR', (error as Error).message),
      };
    }
  }

  async delete(
    query: Record<string, any>,
  ): Promise<SuccessResponseType<T> | ErrorResponseType> {
    try {
      const deletedDocument = await this.repository.delete(query);
      if (!deletedDocument) {
        throw new ErrorResponse(
          'NOT_FOUND_ERROR',
          'Document to delete not found.',
        );
      }
      return { success: true, document: deletedDocument };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof ErrorResponse
            ? error
            : new ErrorResponse('DATABASE_ERROR', (error as Error).message),
      };
    }
  }
}
