import { NotFoundError } from "routing-controllers";
import { Repository } from "typeorm";
import { AvailabilityEntity } from "../database/Entities/availabilityEntity";
import { UserEntity } from "../database/Entities/userEntity";
import AppDataSource from "../database/data-source";
import { AvailabilityModel } from "../types/AvailabilityModel";
import FacilityService from "./FacilityService";

class AvailabilityService {
  repository: Repository<AvailabilityEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(AvailabilityEntity);
  }

  public async validateAvailability(
    availability: AvailabilityModel,
  ): Promise<void> {
    if (availability.startTime >= availability.endTime)
      throw new Error("Start time must be before end time");

    //availability should not be longer for 12 hours
    if (availability.endTime.getDate() !== availability.Date.getDate())
      throw new Error(
        "Availability start and end time must be on the same date",
      );

    const facility = await new FacilityService().getOne(
      availability.facility_id,
    );
    if (!facility) {
      throw new NotFoundError("Facility not found");
    }
    return;
  }

  public async verifyOwnership(
    user: UserEntity,
    facility_id: number,
  ): Promise<boolean> {
    const facility = await new FacilityService().getOne(facility_id);
    if (!facility) {
      throw new NotFoundError("Facility not found");
    }
    if (!facility.providers.some((provider) => provider.id === user.id)) {
      throw new NotFoundError("User does not have access to this facility");
    }
    return true;
  }

  public async checkConflictingAvailabilities(
    establishedAvailability: AvailabilityEntity,
    proposedAvailability: AvailabilityModel,
  ): Promise<boolean> {
    //check if the new availability start time or end time is within the range of the old availability
    if (
      (proposedAvailability.startTime >= establishedAvailability.startTime &&
        proposedAvailability.startTime <= establishedAvailability.endTime) ||
      (proposedAvailability.endTime >= establishedAvailability.startTime &&
        proposedAvailability.endTime <= establishedAvailability.endTime)
    )
      return true;

    return false;
  }

  public async getAvailabilityByID(id: number) {
    const availability = this.repository
      .findOne({ where: { availabilityId: id } })
      .catch((error) => {
        throw new Error(error);
      });
    if (!availability) {
      throw new NotFoundError("Availability not found");
    }
    return availability;
  }

  public async getAvailabilityByFacilityID(facility_id: number) {
    const facility = await new FacilityService().getOne(facility_id);
    if (!facility) {
      throw new NotFoundError("Facility not found");
    }
    return facility.availabilities;
  }

  public async createAvailability(
    user: UserEntity,
    availability: AvailabilityModel,
  ): Promise<AvailabilityEntity> {
    //validate the availability
    await this.validateAvailability(availability);

    const facility_id = availability.facility_id;
    //verify that the user has the right to control this facility
    if (!this.verifyOwnership(user, facility_id)) {
      throw new NotFoundError("User does not have access to this facility");
    }
    //Go through the list of availabilities in the facility and check if the new availability
    //starttime or end time conflicts with any of the existing availabilities
    const currentFacilityAvailabilities =
      await this.getAvailabilityByFacilityID(facility_id);
    for (const currentAvailability of currentFacilityAvailabilities) {
      if (
        await this.checkConflictingAvailabilities(
          currentAvailability,
          availability,
        )
      ) {
        throw new Error(
          "New Availability Conflicts with existing availability",
        );
      }
    }
    //Create a new availability
    const newAvailability = new AvailabilityEntity();
    newAvailability.startTime = availability.startTime;
    newAvailability.endTime = availability.endTime;
    newAvailability.Date = availability.Date;
    newAvailability.facility = await new FacilityService().getOne(facility_id);
    return this.repository.save(newAvailability);
  }

  public async updateAvailability(
    user: UserEntity,
    availability_id: number,
    availability: AvailabilityModel,
  ): Promise<AvailabilityEntity> {
    //validate the availability
    await this.validateAvailability(availability);

    const oldAvailability = await this.getAvailabilityByID(availability_id);
    if (!oldAvailability) {
      throw new NotFoundError("Availability not found");
    }
    const facility_id = oldAvailability.facility.id;

    //verify ownership
    if (!this.verifyOwnership(user, facility_id)) {
      throw new NotFoundError("User does not have access to this facility");
    }
    const currentFacilityAvailabilities =
      await this.getAvailabilityByFacilityID(facility_id);

    //Go through the list of availabilities in the facility and check if the new availability
    //starttime or end time conflicts with any of the existing availabilities
    for (const currentAvailability of currentFacilityAvailabilities) {
      if (currentAvailability.availabilityId === availability_id) continue;
      if (
        await this.checkConflictingAvailabilities(
          currentAvailability,
          availability,
        )
      ) {
        throw new Error(
          "New Availability Conflicts with existing availability",
        );
      }
    }
    //Update the availability
    oldAvailability.startTime = availability.startTime;
    oldAvailability.endTime = availability.endTime;
    oldAvailability.Date = availability.Date;
    oldAvailability.facility = await new FacilityService().getOne(facility_id);

    return this.repository.save(oldAvailability);
  }

  public async deleteAvailability(id: number): Promise<void> {
    const availabilityToDelete = await this.getAvailabilityByID(id);
    if (!availabilityToDelete) {
      throw new NotFoundError("Availability not found");
    }
    await this.repository.remove(availabilityToDelete);
  }
}

export default AvailabilityService;
