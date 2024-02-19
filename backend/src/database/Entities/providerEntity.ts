// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { Facility } from './facilityEntity';
// import { Booking } from './bookingEntity';

// @Entity()
// export class Provider{
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     firstName: string;

//     @Column()
//     lastName: string;

//     @OneToMany(() => Facility, facility => facility.providers)
//     facilities: Facility[];

//     @OneToMany(() => Booking, booking => booking.user)
//     bookings: Booking[];
// }