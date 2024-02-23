import { Entity, ManyToOne, PrimaryColumn, OneToMany, Column } from "typeorm";
import { FacilityEntity } from "./facilityEntity";
import { BookingEntity } from "./bookingEntity";
import { Type } from "class-transformer";
import { IsDateString, IsNumber, ValidateNested } from "class-validator";
//import { Provider } from './Provider';

@Entity()
export class AvailabilityEntity {
  @PrimaryColumn()
  @IsNumber()
  availabilityId: number;

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
    {
      eager: true,
    },
  )
  @ValidateNested()
  @Type(() => FacilityEntity)
  facility: FacilityEntity;

  @OneToMany(
    () => BookingEntity,
    (booking: BookingEntity) => booking.availability,
    {
      cascade: true,
      eager: true,
    },
  )
  @ValidateNested()
  @Type(() => BookingEntity)
  bookings: BookingEntity[];

  // @ManyToOne(() => Provider, (provider: Provider) => provider.bookings)
  // @JoinColumn({ name: "userId"})
  // provider: Provider;
}
