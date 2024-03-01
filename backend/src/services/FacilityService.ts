/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotFoundError } from "routing-controllers";
import { FacilityEntity } from "../database/Entities/facilityEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { FacilityModel } from "../types/FacilityModel";
import GenericService from "./GenericService";
import UserService from "./UserService";

class FacilityService extends GenericService<FacilityEntity> {
  constructor() {
    super(FacilityEntity);
  }

  public async createFacility(
    facility: FacilityModel,
  ): Promise<FacilityEntity> {
    const facilityEntity = new FacilityEntity();
    facilityEntity.name = facility.name;
    facilityEntity.address = facility.address;
    facilityEntity.description = facility.description;
    const users = new UserService().getAllByID(facility.providers);
    facilityEntity.providers = users;
    return this.repository.save(facilityEntity);
  }

  public async getOneByName(name: string): Promise<FacilityEntity> {
    const facility = await this.repository.findOne({
      where: { name: name },
    });
    if (!facility) {
      throw new NotFoundError("Facility not found");
    }
    return facility;
  }

  public async deleteFacility(
    currentUser: UserEntity,
    id: number,
  ): Promise<void> {
    const facility = await this.getOneByID(id, {
      providers: {
        id: currentUser.id,
      },
    });
    if (!facility) {
      throw new NotFoundError("Facility not found for this user");
    }
    return this.delete(id);
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
      const users = await new UserService().getAllByID(facility.providers);
      facilityToUpdate.providers = Promise.resolve(
        users.filter((user: UserEntity) => {
          return user.isProvider;
        }),
      );
    }
    return this.repository.save(facilityToUpdate);
  }
}

export default FacilityService;
