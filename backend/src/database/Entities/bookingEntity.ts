import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from "typeorm";
import { User } from "./userEntity";
import { Availability } from "./availabilityEntity";
//import { Provider } from './Provider';

@Entity()
export class Booking {
  @PrimaryColumn()
  bookingId: number;

  @Column()
  startDateTime: Date;

  @Column()
  endDateTime: Date;

  @ManyToOne(() => User, (user: User) => user.bookings)
  @JoinColumn({ name: "userId" }) //specify join name for instance if you already have a DB
  user: User;

  @ManyToOne(
    () => Availability,
    (availability: Availability) => availability.bookings,
  )
  @JoinColumn({ name: "availabilityId" })
  availability: Availability;

  // @ManyToOne(() => Provider, (provider: Provider) => provider.bookings)
  // @JoinColumn({ name: "userId"})
  // provider: Provider;
}
