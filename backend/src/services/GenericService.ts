import { NotFoundError } from "routing-controllers";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
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
    filter: GetAllQuery,
    extraOptions?: FindManyOptions<T>,
  ): Promise<T[]> {
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
    await this.repository.remove(entity);
  }
}

export default GenericService;
