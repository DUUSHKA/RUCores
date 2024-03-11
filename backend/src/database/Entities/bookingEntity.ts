import { Exclude, Expose, Type, instanceToPlain } from "class-transformer";
import { IsDate, IsNumber, ValidateNested } from "class-validator";
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import LogType from "../../types/LogType";
import AppDataSource from "../data-source";
import { AvailabilityEntity } from "./availabilityEntity";
import GenericEntity from "./genericEntity";
import {
  BookingEvent,
  ModificationEvent,
  modificationEntity,
  modificatonType,
} from "./logEntity";
import { TransactionEntity } from "./transactionEntity";
import { UserEntity } from "./userEntity";
//import { Provider } from './Provider';

@Entity({ name: "booking", schema: "rucores" })
export class BookingEntity extends GenericEntity {
  @Column()
  @IsDate()
  @Expose()
  @Type(() => Date)
  startDateTime: Date;

  @Column()
  @IsDate()
  @Expose()
  @Type(() => Date)
  endDateTime: Date;

  @Column()
  @IsNumber()
  @Expose()
  cost: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.bookings)
  @JoinColumn({ name: "userId" }) //specify join name for instance if you already have a DB
  @ValidateNested()
  @Type(() => UserEntity)
  user: Promise<UserEntity>;

  @ManyToOne(
    () => AvailabilityEntity,
    (availability: AvailabilityEntity) => availability.bookings,
  )
  @JoinColumn({ name: "availabilityId" })
  @ValidateNested()
  @Type(() => AvailabilityEntity)
  availability: Promise<AvailabilityEntity>;

  // @ManyToOne(() => Provider, (provider: Provider) => provider.bookings)
  // @JoinColumn({ name: "userId"})
  // provider: Provider;

  @OneToMany(() => TransactionEntity, (transactions) => transactions.booking, {
    nullable: true,
  })
  transactions: TransactionEntity[];

  @Exclude()
  getName = () => "Booking";

  //Need to make a log that we are creating, updating, or deleting a booking
  @AfterInsert()
  async CreateLog() {
    const log = new BookingEvent();
    log.LogType = LogType.BookingEvent;
    log.booking = this;
    log.message = "Booking Created";
    log.balance = this.cost;
    log.user = await this.user;
    log.facility = await (await this.availability).facility;
    //save the booking event by getting the repository and saving the log
    const logRepository = AppDataSource.getRepository(BookingEvent);
    await logRepository.save(log);

    //Now create a modification event for the booking
    const modLog = new ModificationEvent();
    modLog.LogType = LogType.ModificationEvent;
    modLog.message = "Booking Created";
    modLog.modificationEntity = modificationEntity.booking;
    modLog.modificationType = modificatonType.create;
    modLog.modificationEntityJSON = JSON.stringify(
      instanceToPlain(this, { strategy: "excludeAll" }),
    );
    const modLogRepository = AppDataSource.getRepository(ModificationEvent);
    await modLogRepository.save(modLog);
  }

  @AfterUpdate()
  async UpdateLog() {
    const log = new BookingEvent();
    log.LogType = LogType.BookingEvent;
    log.booking = this;
    log.message = "Booking Updated";
    log.balance = this.cost;
    log.user = await this.user;
    log.facility = await (await this.availability).facility;
    //save the booking event by getting the repository and saving the log
    const logRepository = AppDataSource.getRepository(BookingEvent);
    await logRepository.save(log);

    //Now create a modification event for the booking
    const modLog = new ModificationEvent();
    modLog.LogType = LogType.ModificationEvent;
    modLog.user = await this.user;
    modLog.message = "Booking Updated";
    modLog.modificationEntity = modificationEntity.booking;
    modLog.modificationType = modificatonType.update;
    modLog.modificationEntityJSON = JSON.stringify(
      instanceToPlain(this, { strategy: "excludeAll" }),
    );
    const modLogRepository = AppDataSource.getRepository(ModificationEvent);
    await modLogRepository.save(modLog);
  }

  @AfterRemove()
  async DeleteLog() {
    const log = new BookingEvent();
    log.LogType = LogType.BookingEvent;
    log.booking = this;
    log.message = "Booking Deleted";
    log.balance = this.cost;
    log.user = await this.user;
    log.facility = await (await this.availability).facility;
    //save the booking event by getting the repository and saving the log
    const logRepository = AppDataSource.getRepository(BookingEvent);
    await logRepository.save(log);

    //Now create a modification event for the booking
    const modLog = new ModificationEvent();
    modLog.message = "Booking Deleted";
    modLog.user = await this.user;
    modLog.modificationEntity = modificationEntity.booking;
    modLog.modificationType = modificatonType.delete;
    modLog.modificationEntityJSON = JSON.stringify(
      instanceToPlain(this, { strategy: "excludeAll" }),
    );
    const modLogRepository = AppDataSource.getRepository(ModificationEvent);
    await modLogRepository.save(modLog);
  }
}
