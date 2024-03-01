import { Exclude, Type } from "class-transformer";
import { IsDateString, ValidateNested } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BookingEntity } from "./bookingEntity";
import { FacilityEntity } from "./facilityEntity";
import GenericEntity from "./genericEntity";

@Entity({ name: "availability", schema: "rucores" })
export class AvailabilityEntity extends GenericEntity {
  @Column()
  @IsDateString()
  Date: Date;

  @Column()
  @IsDateString()
  startTime: Date;

  @Column()
  @IsDateString()
  endTime: Date;

  @ManyToOne(
    () => FacilityEntity,
    (facility: FacilityEntity) => facility.availabilities,
  )
  @ValidateNested()
  @Type(() => FacilityEntity)
  facility: Promise<FacilityEntity>;

  @OneToMany(
    () => BookingEntity,
    (booking: BookingEntity) => booking.availability,
    {
      cascade: true,
    },
  )
  @ValidateNested()
  @Type(() => BookingEntity)
  bookings: Promise<BookingEntity[]>;

  @Exclude()
  getName = () => "Availability";
}
