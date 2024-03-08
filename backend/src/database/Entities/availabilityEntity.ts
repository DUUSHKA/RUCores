import { Exclude, Expose, Type, instanceToPlain } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import LogType from "../../types/LogType";
import AppDataSource from "../data-source";
import { BookingEntity } from "./bookingEntity";
import { FacilityEntity } from "./facilityEntity";
import GenericEntity from "./genericEntity";
import {
  ModificationEvent,
  modificationEntity,
  modificatonType,
} from "./logEntity";

@Entity({ name: "availability", schema: "rucores" })
export class AvailabilityEntity extends GenericEntity {
  @Column()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @Expose()
  Date: Date;

  @Column()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @Expose()
  startTime: Date;

  @Column()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @Expose()
  endTime: Date;

  @Column()
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  price: number;

  @ManyToOne(
    () => FacilityEntity,
    (facility: FacilityEntity) => facility.availabilities,
  )
  @ValidateNested()
  @Type(() => FacilityEntity)
  facility: Promise<FacilityEntity>;

  @OneToMany(
    () => BookingEntity,
    (booking: BookingEntity) => booking.availability,
    {
      cascade: true,
    },
  )
  @ValidateNested()
  @Type(() => BookingEntity)
  bookings: Promise<BookingEntity[]>;

  @Exclude()
  getName = () => "Availability";

  @BeforeInsert()
  async CreateLog() {
    const log = new ModificationEvent();
    log.LogType = LogType.ModificationEvent;
    log.message = "Availability Created";
    log.modificationType = modificatonType.create;
    log.modificationEntity = modificationEntity.availability;
    const res = instanceToPlain(this, { strategy: "excludeAll" });
    console.log(res);
    log.modificationEntityJSON = JSON.stringify(
      instanceToPlain(this, { strategy: "excludeAll" }),
    );
    const logRepository = AppDataSource.getRepository(ModificationEvent);
    await logRepository.save(log);

    // //Now create a avaialbility event for the availability
    // const availabilityLog = new AvailabilityEvent();
    // availabilityLog.LogType = LogType.AvailabilityEvent;
    // availabilityLog.message = "Availability Created";
    // availabilityLog.user = (await (await this.facility).providers)[0];
    // availabilityLog.userJSON = JSON.stringify(instanceToPlain(availabilityLog.user, { strategy: "excludeAll" }));
    // availabilityLog.availability = this;
    // availabilityLog.facility = await this.facility;
    // const availabilityLogRepository = AppDataSource.getRepository(AvailabilityEvent);
    // await availabilityLogRepository.save(availabilityLog);
  }

  @BeforeUpdate()
  async UpdateLog() {
    const log = new ModificationEvent();
    log.LogType = LogType.ModificationEvent;
    log.message = "Availability Updated";
    log.modificationType = modificatonType.update;
    log.modificationEntity = modificationEntity.availability;
    log.modificationEntityJSON = JSON.stringify(
      instanceToPlain(this, { strategy: "excludeAll" }),
    );
    const logRepository = AppDataSource.getRepository(ModificationEvent);
    await logRepository.save(log);
    // //Now create a avaialbility event for the availability
    // const availabilityLog = new AvailabilityEvent();
    // availabilityLog.LogType = LogType.AvailabilityEvent;
    // availabilityLog.user = (await (await this.facility).providers)[0];
    // availabilityLog.userJSON = JSON.stringify(instanceToPlain(availabilityLog.user, { strategy: "excludeAll" }));
    // availabilityLog.message = "Availability Updated";
    // availabilityLog.availability = this;
    // availabilityLog.facility = await this.facility;
    // const availabilityLogRepository = AppDataSource.getRepository(AvailabilityEvent);
    // await availabilityLogRepository.save(availabilityLog);
  }

  @BeforeRemove()
  async DeleteLog() {
    const log = new ModificationEvent();
    log.LogType = LogType.ModificationEvent;
    log.message = "Availability Deleted";
    log.modificationType = modificatonType.delete;
    log.modificationEntity = modificationEntity.availability;
    log.modificationEntityJSON = JSON.stringify(instanceToPlain(this));
    const logRepository = AppDataSource.getRepository(ModificationEvent);
    await logRepository.save(log);
    // //Now create a avaialbility event for the availability
    // const availabilityLog = new AvailabilityEvent();
    // availabilityLog.LogType = LogType.AvailabilityEvent;
    // availabilityLog.user = (await (await this.facility).providers)[0];
    // availabilityLog.userJSON = JSON.stringify(instanceToPlain(availabilityLog.user, { strategy: "excludeAll" }));
    // availabilityLog.message = "Availability Deleted";
    // availabilityLog.availability = this;
    // availabilityLog.facility = await this.facility;
    // const availabilityLogRepository = AppDataSource.getRepository(AvailabilityEvent);
    // await availabilityLogRepository.save(availabilityLog);
  }
}
