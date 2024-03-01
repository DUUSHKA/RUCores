/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotFoundError } from "routing-controllers";
import { FacilityEntity } from "../database/Entities/facilityEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { FacilityModel } from "../types/FacilityModel";
import BookingService from "./BookingService";
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
    facilityEntity.providers = await users;
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
      const users = new UserService().getAllByID(facility.providers);
      facilityToUpdate.providers = (await users).filter((user: UserEntity) => {
        return user.isProvider;
      });
    }
    return this.repository.save(facilityToUpdate);
  }

  public async liquidateFacilityBalance(
    id: number,
    widthrawal: number,
  ): Promise<FacilityEntity> {
    const facility = await this.getOneByID(id);
    if (!facility) {
      throw new NotFoundError("Facility not found");
    }
    //find all future bookings in order to determine pending balance
    const allBookings = await new BookingService().getAllFutureFacilityBookings(
      facility,
    );
    const pendingBalance = allBookings.reduce((acc, booking) => {
      return acc + booking.cost;
    }, 0);
    if (facility.balance - pendingBalance < widthrawal) {
      throw new Error(
        "Facility does not have enough balance to make this withdrawal",
      );
    }
    facility.balance -= widthrawal;
    return this.repository.save(facility);
  }
}

export default FacilityService;
