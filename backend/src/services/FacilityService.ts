/* eslint-disable @typescript-eslint/no-unused-vars */
import { ForbiddenError, NotFoundError } from "routing-controllers";
import { Repository } from "typeorm";
import { FacilityEntity } from "../database/Entities/facilityEntity";
import { UserEntity } from "../database/Entities/userEntity";
import AppDataSource from "../database/data-source";
import { FacilityModel } from "../types/FacilityModel";
import UserService from "./UserService";

class FacilityService {
  repository: Repository<FacilityEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(FacilityEntity);
  }

  public async createFacility(
    facility: FacilityModel,
  ): Promise<FacilityEntity> {
    const facilityEntity = new FacilityEntity();
    facilityEntity.name = facility.name;
    facilityEntity.address = facility.address;
    facilityEntity.description = facility.description;
    const users = new UserService().getAllByID(facility.providers);
    facilityEntity.providers = await users;
    return this.repository.save(facilityEntity);
  }

  public async getOne(id: number): Promise<FacilityEntity> {
    const facility = await this.repository
      .findOne({
        where: { id: id },
      })
      .catch((error) => {
        throw new Error(error);
      });
    if (!facility) {
      throw new Error("User not found");
    }
    return facility;
  }

  public async getOneByName(name: string): Promise<FacilityEntity> {
    const facility = await this.repository
      .findOne({
        where: { name: name },
      })
      .catch((error) => {
        throw new Error(error);
      });
    if (!facility) {
      throw new Error("User not found");
    }
    return facility;
  }

  public async getAll(): Promise<FacilityEntity[]> {
    return this.repository.find();
  }

  public async deleteFacility(
    currentUser: UserEntity,
    id: number,
  ): Promise<void> {
    const facilityToDelete = await this.repository.findOneBy({ id });
    if (!facilityToDelete) {
      throw new NotFoundError("Facility not found");
    }
    if (facilityToDelete.providers.includes(currentUser)) {
      await this.repository.remove(facilityToDelete);
    } else {
      throw new ForbiddenError("Not a provider for this facility");
    }
  }

  public async updateFacility(
    id: number,
    facility: Partial<FacilityModel>,
  ): Promise<FacilityEntity> {
    const facilityToUpdate = await this.repository.findOneBy({ id });
    if (!facilityToUpdate) {
      throw new Error("User not found");
    }
    facilityToUpdate.name = facility.name ?? facilityToUpdate.name;
    facilityToUpdate.address = facility.address ?? facilityToUpdate.address;
    facilityToUpdate.description =
      facility.description ?? facilityToUpdate.description;

    //check if all providers suggested are actually providers
    if (facility.providers !== undefined && facility.providers.length > 0) {
      const users = new UserService().getAllByID(facility.providers);
      facilityToUpdate.providers = (await users).filter((user: UserEntity) => {
        return user.isProvider;
      });
    }
    return this.repository.save(facilityToUpdate);
  }
}

export default FacilityService;
