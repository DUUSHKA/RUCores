import { Type } from "class-transformer";
import { IsDateString, IsNumber, ValidateNested } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { AvailabilityEntity } from "./availabilityEntity";
import { UserEntity } from "./userEntity";
//import { Provider } from './Provider';

@Entity({ name: "booking", schema: "rucores" })
export class BookingEntity {
  @PrimaryColumn()
  @IsNumber()
  bookingId: number;

  @Column()
  @IsDateString()
  startDateTime: Date;

  @Column()
  @IsDateString()
  endDateTime: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.bookings)
  @JoinColumn({ name: "userId" }) //specify join name for instance if you already have a DB
  @ValidateNested()
  @Type(() => UserEntity)
  user: UserEntity;

  @ManyToOne(
    () => AvailabilityEntity,
    (availability: AvailabilityEntity) => availability.bookings,
  )
  @JoinColumn({ name: "availabilityId" })
  @ValidateNested()
  @Type(() => AvailabilityEntity)
  availability: AvailabilityEntity;

  // @ManyToOne(() => Provider, (provider: Provider) => provider.bookings)
  // @JoinColumn({ name: "userId"})
  // provider: Provider;
}
