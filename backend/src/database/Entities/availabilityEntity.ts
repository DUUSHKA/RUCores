import { Exclude, Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { BookingEntity } from "./bookingEntity";
import { FacilityEntity } from "./facilityEntity";
import GenericEntity from "./genericEntity";

@Entity({ name: "availability", schema: "rucores" })
export class AvailabilityEntity extends GenericEntity {
  @Column()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  Date: Date;

  @Column()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startTime: Date;

  @Column()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endTime: Date;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  price: number;

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

  @DeleteDateColumn()
  deletedAt?: Date;

  @Exclude()
  getName = () => "Availability";
}
