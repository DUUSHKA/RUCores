import { Exclude, Expose, Type, instanceToPlain } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  ValidatePromise,
} from "class-validator";
import {
  AfterInsert,
  AfterLoad,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import LogType from "../../types/LogType";
import AppDataSource from "../data-source";
import { BookingEntity } from "./bookingEntity";
import { FacilityEntity } from "./facilityEntity";
import GenericEntity from "./genericEntity";
import {
  AvailabilityEvent,
  BookingEvent,
  LogEntity,
  ModificationEvent,
  modificationEntity,
  modificatonType,
} from "./logEntity";
import { SessionEntity } from "./sessionEntity";

@Entity({ name: "user", schema: "rucores" })
export class UserEntity extends GenericEntity {
  @Column()
  @IsString()
  @Expose()
  firstName: string;

  @Column()
  @IsString()
  @Expose()
  lastName: string;

  @Column()
  @IsString()
  @Expose()
  email: string;

  @Column()
  @IsString()
  @Expose()
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
  @Expose()
  roles: string[];

  @Column()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  balance: number;

  @Column()
  @IsBoolean()
  @Expose()
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

  @ValidateNested()
  @OneToMany(() => LogEntity, (log) => log.user, {
    nullable: true,
    cascade: true,
  })
  @Type(() => LogEntity, {
    //when sending the logs to the client in a JSON, we need to cast them to the correct type
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

  //Need to create an after load function in order to cast the logs to the correct type

  @AfterLoad()
  logTypeCasting() {
    // Cast the logs to the correct type becuase TypeORM reads the logs as LogEntity
    if (!this.logs) return;

    this.logs = this.logs.map((item: LogEntity) => {
      switch (item.LogType) {
        case LogType.BookingEvent:
          return Object.assign(new BookingEvent(), item);
        case LogType.AvailabilityEvent:
          return Object.assign(new AvailabilityEvent(), item);
        case LogType.ModificationEvent:
          return Object.assign(new ModificationEvent(), item);
        default:
          throw new Error("Invalid type");
      }
    });
  }

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

  //Make a modification even log after creating a user
  @AfterInsert()
  async logCreation() {
    const log = new ModificationEvent();
    log.LogType = LogType.ModificationEvent;
    log.message = "User created";
    log.modificationType = modificatonType.create;
    log.modificationEntity = modificationEntity.user;
    log.modificationEntityJSON = JSON.stringify(
      instanceToPlain(this, { strategy: "excludeAll" }),
    );
    //Because relations are really just a shortcut way to do join operations,
    //Saving the user on the logEntity table will populate user.logs
    //user.logs is just looking in the logEntity table for foreign keys that point to the user
    log.user = this;
    const logRepository = AppDataSource.getRepository(ModificationEvent);
    await logRepository.save(log);
  }

  //Make a modification even log before updating a user
  @AfterUpdate()
  async logUpdate() {
    const log = new ModificationEvent();
    log.LogType = LogType.ModificationEvent;
    log.message = "User updated";
    log.modificationType = modificatonType.update;
    log.modificationEntity = modificationEntity.user;
    log.modificationEntityJSON = JSON.stringify(
      instanceToPlain(this, { strategy: "excludeAll" }),
    );
    log.user = this;
    const logRepository = AppDataSource.getRepository(ModificationEvent);
    await logRepository.save(log);
  }

  @AfterRemove()
  async logDelete() {
    const log = new ModificationEvent();
    log.LogType = LogType.ModificationEvent;
    log.message = "User deleted";
    log.modificationType = modificatonType.delete;
    log.modificationEntity = modificationEntity.user;
    log.modificationEntityJSON = JSON.stringify(
      instanceToPlain(this, { strategy: "excludeAll" }),
    );
    //save log
    const logRepository = AppDataSource.getRepository(ModificationEvent);
    await logRepository.save(log);
  }
}
