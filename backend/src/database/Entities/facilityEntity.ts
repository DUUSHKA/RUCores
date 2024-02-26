import { Type } from "class-transformer";
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AvailabilityEntity } from "./availabilityEntity";
import { UserEntity } from "./userEntity";

@Entity({ name: "facility", schema: "rucores" })
export class FacilityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @ManyToMany(
    () => UserEntity,
    (provider: UserEntity) => provider.managedFacilities,
  )
  @Type(() => UserEntity)
  providers: UserEntity[];

  // @ManyToMany(() => User, (user: User) => user.facilities, {onDelete: 'SET NULL'})
  // users: User[];

  // @OneToMany(() => Booking, (booking: Booking) => booking.facility, {onDelete: 'SET NULL'})
  // bookings: Booking[];

  @OneToMany(
    () => AvailabilityEntity,
    (availability: AvailabilityEntity) => availability.facility,
    { nullable: true, cascade: true, onDelete: "CASCADE" },
  )
  @Type(() => AvailabilityEntity)
  availabilities: AvailabilityEntity[];
}
