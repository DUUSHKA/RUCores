import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Facility } from "./facilityEntity";
import { Booking } from "./bookingEntity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  isProvider: boolean;

  @Column({ nullable: true })
  apikey: number;

  @Column({ nullable: true })
  apiKeyExpiration: Date;

  // @Column({nullable: true})
  // managedFacilities: Facility[];

  @OneToMany(() => Facility, (facility) => facility.provider, {
    nullable: true,
    onDelete: "SET NULL",
    cascade: true,
    eager: true,
  })
  managedFacilities: Facility[];

  // @ManyToMany(() => Facility, facility => facility.users, {nullable: true, onDelete: 'SET NULL'})
  // @JoinTable()
  // facilities: Facility[];

  // @OneToMany(() => Availability, availability => availability.user, {nullable: true, onDelete: 'SET NULL'})
  // @JoinTable()
  // facilities: Facility[];

  @OneToMany(() => Booking, (booking) => booking.user, {
    nullable: true,
    onDelete: "CASCADE",
    cascade: true,
  })
  bookings: Booking[];
}
