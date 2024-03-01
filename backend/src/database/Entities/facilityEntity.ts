import { Exclude, Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { AvailabilityEntity } from "./availabilityEntity";
import GenericEntity from "./genericEntity";
import { UserEntity } from "./userEntity";

@Entity({ name: "facility", schema: "rucores" })
export class FacilityEntity extends GenericEntity {
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsString()
  address: string;

  @ManyToMany(
    () => UserEntity,
    (provider: UserEntity) => provider.managedFacilities,
    { nullable: true, onDelete: "CASCADE" },
  )
  @Type(() => UserEntity)
  @Exclude()
  @ValidateNested()
  providers: Promise<UserEntity[]>;

  // @ManyToMany(() => User, (user: User) => user.facilities, {onDelete: 'SET NULL'})
  // users: User[];

  // @OneToMany(() => Booking, (booking: Booking) => booking.facility, {onDelete: 'SET NULL'})
  // bookings: Booking[];

  @OneToMany(
    () => AvailabilityEntity,
    (availability: AvailabilityEntity) => availability.facility,
    { nullable: true, cascade: true, onDelete: "CASCADE" },
  )
  @ValidateNested()
  @Type(() => AvailabilityEntity)
  availabilities: Promise<AvailabilityEntity[]>;

  @Exclude()
  getName = () => "Facility";
}
