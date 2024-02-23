import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { UserEntity } from "./userEntity";
import { AvailabilityEntity } from "./availabilityEntity";
import { Type } from "class-transformer";

@Entity()
export class FacilityEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @ManyToOne(
    () => UserEntity,
    (provider: UserEntity) => provider.managedFacilities,
    {
      onDelete: "SET NULL",
    },
  )
  @Type(() => UserEntity)
  provider: UserEntity;

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
