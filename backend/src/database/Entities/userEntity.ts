import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { FacilityEntity } from "./facilityEntity";
import { BookingEntity } from "./bookingEntity";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

@Entity()
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

  @Column({ nullable: true })
  @IsBoolean()
  isProvider: boolean;

  @Column({ nullable: true })
  @IsNumber()
  apikey: number;

  @Column({ nullable: true })
  @IsDateString()
  apiKeyExpiration: Date;

  // @Column({nullable: true})
  // managedFacilities: Facility[];

  @OneToMany(() => FacilityEntity, (facility) => facility.provider, {
    nullable: true,
    onDelete: "SET NULL",
    cascade: true,
    eager: true,
  })
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
  })
  @ValidateNested()
  @Type(() => BookingEntity)
  bookings: BookingEntity[];
}
