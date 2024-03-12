import { NotFoundError } from "routing-controllers";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  IsNull,
  Not,
  Repository,
} from "typeorm";
import GenericEntity from "../database/Entities/genericEntity";
import AppDataSource from "../database/data-source";
import { GetAllQuery } from "../types/GenericUtilTypes";

class GenericService<T extends GenericEntity> {
  repository: Repository<T>;
  name: string;

  constructor(_T: new () => T) {
    this.repository = AppDataSource.getRepository(_T);
    this.name = new _T().getName();
  }

  public async getOneByID(
    id: number,
    extraOptionsWhere?: FindOptionsWhere<T>,
  ): Promise<T> {
    const entity = await this.repository.findOne({
      where: {
        id: id,
        ...extraOptionsWhere,
      },
    } as FindOneOptions<T>);
    if (!entity) {
      throw new NotFoundError(`${this.name} not found`);
    }
    return entity;
  }

  /*
   * Allows you to specify additional options with extraOptions
   */
  public async getAll(
    filter?: GetAllQuery,
    extraOptions?: FindManyOptions<T>,
  ): Promise<T[]> {
    filter = filter ?? {
      limit: 50,
      offset: 0,
    };
    const options: FindManyOptions<T> = {
      order: {
        [filter.orderBy ?? "id"]: filter.order ?? "ASC",
      },
      skip: filter.offset,
      take: filter.limit,
      ...extraOptions,
    } as FindManyOptions<T>;
    return this.repository.find(options);
  }

  public async delete(id: number) {
    const entity = await this.getOneByID(id);
    if (!entity) {
      throw new NotFoundError(`${this.name} not found`);
    }
    await this.repository.softRemove(entity);
  }

  public async getAllWithDeleted(
    filter?: GetAllQuery,
    extraOptions?: FindManyOptions<T>,
  ): Promise<T[]> {
    filter = filter ?? {
      limit: 50,
      offset: 0,
    };
    const options: FindManyOptions<T> = {
      order: {
        [filter.orderBy ?? "id"]: filter.order ?? "ASC",
      },
      skip: filter.offset,
      take: filter.limit,
      withDeleted: true,
      ...extraOptions,
    } as FindManyOptions<T>;
    return this.repository.find(options);
  }

  public async getDeleted(
    filter?: GetAllQuery,
    extraOptions?: FindManyOptions<T>,
    extraOptionsWhere?: FindOptionsWhere<T>,
  ): Promise<T[]> {
    filter = filter ?? {
      limit: 50,
      offset: 0,
    };
    const options: FindManyOptions<T> = {
      order: {
        [filter.orderBy ?? "id"]: filter.order ?? "ASC",
      },
      skip: filter.offset,
      take: filter.limit,
      where: {
        deletedAt: Not(IsNull()),
        ...extraOptionsWhere,
      },
      withDeleted: true,
      ...extraOptions,
    } as FindManyOptions<T>;
    return this.repository.find(options);
  }

  public async getDeletedByID(
    id: number,
    extraOptionsWhere?: FindOptionsWhere<T>,
  ): Promise<T> {
    const entity = await this.repository.findOne({
      where: {
        id: id,
        deletedAt: Not(IsNull()),
        ...extraOptionsWhere,
      },
      withDeleted: true,
    } as FindOneOptions<T>);
    if (!entity) {
      throw new NotFoundError(`${this.name} not found`);
    }
    return entity;
  }
}

export default GenericService;
