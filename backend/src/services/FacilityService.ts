/* eslint-disable @typescript-eslint/no-unused-vars */
import { Repository } from "typeorm";
import { FacilityEntity } from "../database/Entities/facilityEntity";
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
    providers: number[],
  ): Promise<FacilityEntity> {
    const newFacility = new FacilityEntity();
    newFacility.name = facility.name;
    newFacility.address = facility.address;
    newFacility.description = facility.description;
    const users = new UserService().getAllByID(providers);
    newFacility.providers = await users;
    return this.repository.save(newFacility);
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

  // public async login(
  //   username: string,
  //   password: string,
  // ): Promise<SessionEntity> {
  //   const user = await this.repository.findOneBy({ username });
  //   if (!user) {
  //     throw new UnauthorizedError("Invalid username");
  //   }
  //   if (user.hashedPassword !== this.hashPassword(password, user)) {
  //     throw new ForbiddenError("Invalid password");
  //   }
  //   return new SessionService().createSession(user);
  // }

  public async updateFacility(
    id: number,
    facility: FacilityModel,
  ): Promise<FacilityEntity> {
    const facilityToUpdate = await this.repository.findOneBy({ id });
    if (!facilityToUpdate) {
      throw new Error("User not found");
    }
    Object.assign(facilityToUpdate, facility); //Might throw an error due to FacilityEntity provider type.
    //If error, use if statements inside the if block below
    if (facility.providerID !== undefined && facility.providerID.length > 0) {
      const users = new UserService().getAllByID(facility.providerID);
      facilityToUpdate.providers = await users;
    }
    return this.repository.save(facilityToUpdate);
  }

  public async deleteFacility(id: number): Promise<void> {
    const facilityToDelete = await this.repository.findOneBy({ id });
    if (!facilityToDelete) {
      throw new Error("User not found");
    }
    await this.repository.remove(facilityToDelete);
  }
}

export default FacilityService;
