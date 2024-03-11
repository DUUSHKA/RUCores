import { Exclude, Expose, Type, instanceToPlain } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
} from "typeorm";
import LogType from "../../types/LogType";
import AppDataSource from "../data-source";
import { AvailabilityEntity } from "./availabilityEntity";
import GenericEntity from "./genericEntity";
import {
  ModificationEvent,
  modificationEntity,
  modificatonType,
} from "./logEntity";
import { TransactionEntity } from "./transactionEntity";
import { UserEntity } from "./userEntity";

@Entity({ name: "facility", schema: "rucores" })
export class FacilityEntity extends GenericEntity {
  @Column()
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Expose()
  description: string;

  @Column()
  @IsNumber()
  @IsOptional()
  @Expose()
  balance: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Expose()
  equipment: string;

  @Column()
  @IsString()
  @Expose()
  address: string;

  @Expose()
  @ManyToMany(
    () => UserEntity,
    (provider: UserEntity) => provider.managedFacilities,
    { nullable: true, onDelete: "CASCADE" },
  )
  @Type(() => UserEntity)
  @Exclude()
  @ValidateNested()
  providers: Promise<UserEntity[]>;

  // @ManyToMany(() => User, (user: User) => user.facilities, {onDelete: 'SET NULL'})
  // users: User[];

  // @OneToMany(() => Booking, (booking: Booking) => booking.facility, {onDelete: 'SET NULL'})
  // bookings: Booking[];

  @OneToMany(
    () => AvailabilityEntity,
    (availability: AvailabilityEntity) => availability.facility,
    { nullable: true, cascade: true, onDelete: "CASCADE" },
  )
  @ValidateNested()
  @Type(() => AvailabilityEntity)
  availabilities: Promise<AvailabilityEntity[]>;

  @OneToMany(() => TransactionEntity, (transactions) => transactions.facility, {
    nullable: true,
  })
  transactions: TransactionEntity[];

  @Exclude()
  getName = () => "Facility";

  @AfterInsert()
  async CreateLog() {
    const log = new ModificationEvent();
    log.LogType = LogType.ModificationEvent;
    log.message = "Facility Created";
    log.modificationEntity = modificationEntity.facility;
    log.modificationType = modificatonType.create;
    log.modificationEntityJSON = JSON.stringify(
      instanceToPlain(this, { strategy: "excludeAll" }),
    );
    //save the booking event by getting the repository and saving the log
    const logRepository = AppDataSource.getRepository(ModificationEvent);
    await logRepository.save(log);
  }

  @AfterUpdate()
  async UpdateLog() {
    const log = new ModificationEvent();
    log.LogType = LogType.ModificationEvent;
    log.message = "Facility Updated";
    log.modificationEntity = modificationEntity.facility;
    log.modificationType = modificatonType.update;
    log.modificationEntityJSON = JSON.stringify(
      instanceToPlain(this, { strategy: "excludeAll" }),
    );
    //save the booking event by getting the repository and saving the log
    const logRepository = AppDataSource.getRepository(ModificationEvent);
    await logRepository.save(log);
  }

  @AfterRemove()
  async DeleteLog() {
    const log = new ModificationEvent();
    log.LogType = LogType.ModificationEvent;
    log.message = "Facility Deleted";
    log.modificationEntity = modificationEntity.facility;
    log.modificationType = modificatonType.delete;
    log.modificationEntityJSON = JSON.stringify(
      instanceToPlain(this, { strategy: "excludeAll" }),
    );
    //save the booking event by getting the repository and saving the log
    const logRepository = AppDataSource.getRepository(ModificationEvent);
    await logRepository.save(log);
  }
}
