import { NotFoundError } from "routing-controllers";
import { AvailabilityEntity } from "../database/Entities/availabilityEntity";
import { FacilityEntity } from "../database/Entities/facilityEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { AvailabilityModel } from "../types/AvailabilityModel";
import FacilityService from "./FacilityService";
import GenericService from "./GenericService";

class AvailabilityService extends GenericService<AvailabilityEntity> {
  constructor() {
    super(AvailabilityEntity);
  }

  // Verify availability times and facility id is valid
  public async validateAvailability(
    availability: AvailabilityModel,
  ): Promise<FacilityEntity> {
    if (availability.startTime >= availability.endTime)
      throw new Error("Start time must be before end time");

    //availability time span must be within the same day
    if (availability.endTime.getDate() !== availability.Date.getDate())
      throw new Error(
        "Availability start and end time must be on the same date",
      );

    const facility = await new FacilityService().getOneByID(
      availability.facility_id,
    );
    if (!facility) {
      throw new NotFoundError("Facility not found");
    }
    return facility;
  }

  public async verifyOwnership(
    user: UserEntity,
    facility: FacilityEntity,
  ): Promise<boolean> {
    const providers = await facility.providers;
    if (!providers.some((provider) => provider.id === user.id)) {
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

  public async getAvailabilityByFacilityID(facility_id: number) {
    const facility = await new FacilityService().getOneByID(facility_id);
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
    const facility = await this.validateAvailability(availability);

    //verify that the user has the right to control this facility
    if (!(await this.verifyOwnership(user, facility))) {
      throw new NotFoundError("User does not have access to this facility");
    }
    //Go through the list of availabilities in the facility and check if the new availability
    //starttime or end time conflicts with any of the existing availabilities
    const currentFacilityAvailabilities = await facility.availabilities;
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
    newAvailability.facility = Promise.resolve(facility);
    return this.repository.save(newAvailability);
  }

  public async updateAvailability(
    user: UserEntity,
    availability_id: number,
    availability: AvailabilityModel,
  ): Promise<AvailabilityEntity> {
    //validate the availability
    const facility = await this.validateAvailability(availability);

    const existingAvailability = await this.getOneByID(availability_id);
    if (!existingAvailability) {
      throw new NotFoundError("Availability not found");
    }

    //verify ownership
    if (!(await this.verifyOwnership(user, facility))) {
      throw new NotFoundError("User does not have access to this facility");
    }
    const currentFacilityAvailabilities = await facility.availabilities;

    //Go through the list of availabilities in the facility and check if the new availability
    //starttime or end time conflicts with any of the existing availabilities
    for (const currentAvailability of currentFacilityAvailabilities) {
      if (currentAvailability.id === availability_id) continue;
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
    existingAvailability.startTime = availability.startTime;
    existingAvailability.endTime = availability.endTime;
    existingAvailability.Date = availability.Date;
    existingAvailability.facility = Promise.resolve(facility);

    return this.repository.save(existingAvailability);
  }

  public async deleteAvailability(user: UserEntity, availability_id: number) {
    const availability = await this.getOneByID(availability_id);
    if (!availability) {
      throw new NotFoundError("Availability not found");
    }
    const facility = await availability.facility;
    if (!(await this.verifyOwnership(user, facility))) {
      throw new NotFoundError("User does not have access to this facility");
    }
    return this.repository.delete(availability_id);
  }
}

export default AvailabilityService;
