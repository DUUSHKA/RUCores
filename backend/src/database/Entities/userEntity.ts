import { Exclude, Type } from "class-transformer";
import { IsNumber, IsString, ValidateNested } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BookingEntity } from "./bookingEntity";
import { FacilityEntity } from "./facilityEntity";
import { SessionEntity } from "./sessionEntity";

@Entity({ name: "user" })
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

  @Column("simple-array", { nullable: true, array: true })
  @IsString({ each: true })
  roles: string[];

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

  @OneToMany(() => SessionEntity, (session) => session.user, {
    nullable: true,
    onDelete: "CASCADE",
    cascade: true,
  })
  sessions: SessionEntity[];
}
