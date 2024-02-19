import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, PrimaryColumn, OneToMany, Column } from 'typeorm';
import { User } from './userEntity';
import { Facility } from './facilityEntity';
import { Booking } from './bookingEntity';
//import { Provider } from './Provider';

@Entity()
export class Availability {

    @PrimaryColumn()
    availabilityId: number;

    @Column()
    Date: Date;

    @Column() 
    startTime: Date;

    @Column()
    endTime: Date;

    @ManyToOne(() => Facility, (facility: Facility) => facility.availabilities, { eager: true})
    facility: Facility;

    @OneToMany(() => Booking, (booking: Booking) => booking.availability, {cascade: true, eager: true})
    bookings: Booking[];

    // @ManyToOne(() => Provider, (provider: Provider) => provider.bookings)
    // @JoinColumn({ name: "userId"})
    // provider: Provider;
}