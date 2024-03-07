import { Exclude, Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  ValidatePromise,
} from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import LogType from "../../types/LogType";
import { BookingEntity } from "./bookingEntity";
import { FacilityEntity } from "./facilityEntity";
import GenericEntity from "./genericEntity";
import {
  AvailabilityEvent,
  BookingEvent,
  LogEntity,
  ModificationEvent,
} from "./logEntity";
import { SessionEntity } from "./sessionEntity";

@Entity({ name: "user", schema: "rucores" })
export class UserEntity extends GenericEntity {
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

  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @Column()
  @IsBoolean()
  isProvider: boolean;

  @JoinTable({
    joinColumn: { name: "userId" },
    inverseJoinColumn: { name: "facilityId" },
  })
  @ManyToMany(() => FacilityEntity, (facility) => facility.providers, {
    cascade: true,
  })
  @ValidateNested()
  @Type(() => FacilityEntity)
  managedFacilities: Promise<FacilityEntity[]>;

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
  bookings: Promise<BookingEntity[]>;

  @OneToMany(() => SessionEntity, (session) => session.user, {
    nullable: true,
    onDelete: "CASCADE",
    cascade: true,
  })
  @ValidateNested()
  @ValidatePromise()
  @Type(() => SessionEntity)
  @Exclude()
  sessions: Promise<SessionEntity[]>;

  @Exclude()
  @ValidateNested()
  @OneToMany(() => LogEntity, (log) => log.user)
  @Type(() => LogEntity, {
    discriminator: {
      property: "LogType",
      subTypes: [
        { value: BookingEvent, name: LogType.BookingEvent },
        { value: AvailabilityEvent, name: LogType.AvailabilityEvent },
        { value: ModificationEvent, name: LogType.ModificationEvent },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  logs: (BookingEvent | AvailabilityEvent | ModificationEvent)[];
  // @Transform((value) => {
  //   if (!Array.isArray(value)) throw new Error('Invalid type');

  //   return value.map((item: LogEntity) => {
  //     switch (item.LogType) {
  //       case LogType.BookingEvent:
  //         return Object.assign(new BookingEvent(), item);
  //       case LogType.AvailabilityEvent:
  //         return Object.assign(new AvailabilityEvent(), item);
  //       case LogType.ModificationEvent:
  //         return Object.assign(new ModificationEvent(), item);
  //       default:
  //         throw new Error('Invalid type');
  //     }
  //   });
  // })
  //log: (BookingEvent | AvailabilityEvent | ModificationEvent)[];

  @Exclude()
  getName = () => "User";

  //Need to create an after load function in order to cast the logs to the correct type
}
