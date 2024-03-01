import { Exclude, Type } from "class-transformer";
import {
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
  ValidatePromise,
} from "class-validator";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BookingEntity } from "./bookingEntity";
import { FacilityEntity } from "./facilityEntity";
import { SessionEntity } from "./sessionEntity";

@Entity({ name: "user", schema: "rucores" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsString()
  firstName: string;

  @Column()
  @IsString()
  lastName: string;

  @Column()
  @IsString()
  email: string;

  @Column()
  @IsString()
  username: string;

  @Column()
  @IsString()
  @Exclude()
  hashedPassword: string;

  // Send the salt to the client for hashing the password
  @Column({ nullable: true })
  @IsString()
  salt: string;

  @Column("simple-array", { nullable: true })
  @IsString({ each: true })
  roles: string[];

  @Column()
  @IsBoolean()
  isProvider: boolean;

  @JoinTable({
    joinColumn: { name: "userId" },
    inverseJoinColumn: { name: "facilityId" },
  })
  @ManyToMany(() => FacilityEntity, (facility) => facility.providers, {
    cascade: true,
    eager: true,
  })
  @ValidateNested()
  @Type(() => FacilityEntity)
  managedFacilities: FacilityEntity[];

  // @ManyToMany(() => Facility, facility => facility.users, {nullable: true, onDelete: 'SET NULL'})
  // @JoinTable()
  // facilities: Facility[];

  // @OneToMany(() => Availability, availability => availability.user, {nullable: true, onDelete: 'SET NULL'})
  // @JoinTable()
  // facilities: Facility[];

  @OneToMany(() => BookingEntity, (booking) => booking.user, {
    nullable: true,
    onDelete: "CASCADE",
    cascade: true,
    eager: true,
  })
  @ValidateNested()
  @ValidatePromise()
  @Type(() => BookingEntity)
  bookings: BookingEntity[]; // Lazy loading, also need eager to be false (default)

  @OneToMany(() => SessionEntity, (session) => session.user, {
    nullable: true,
    onDelete: "CASCADE",
    cascade: true,
  })
  @ValidateNested()
  @ValidatePromise()
  @Type(() => SessionEntity)
  @Exclude()
  sessions: SessionEntity[];
}
