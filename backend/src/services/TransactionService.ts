import { NotFoundError } from "routing-controllers";
import { TransactionEntity } from "../database/Entities/transactionEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { GetAllQuery } from "../types/GenericUtilTypes";
import { TransactionModel } from "../types/TransactionModel";
import BookingService from "./BookingService";
import FacilityService from "./FacilityService";
import GenericService from "./GenericService";
import UserService from "./UserService";

class TransactionService extends GenericService<TransactionEntity> {
  constructor() {
    super(TransactionEntity);
  }

  public async createTransaction(
    transaction: TransactionModel,
  ): Promise<TransactionEntity> {
    const newTransaction = new TransactionEntity();
    const user = await new UserService().getOneByID(transaction.user_id);
    if (transaction.facility_id !== undefined) {
      const facility = await new FacilityService().getOneByID(
        transaction.facility_id,
      );
      newTransaction.facility = facility;
    }
    if (transaction.booking_id !== undefined) {
      const bookingSave = await new BookingService().getOneByID(
        transaction.booking_id,
      );
      newTransaction.booking = bookingSave;
    }
    if (transaction.duration !== undefined) {
      newTransaction.duration = transaction.duration;
    }
    newTransaction.eventDesription = transaction.eventDescription;
    newTransaction.date = transaction.date;
    newTransaction.user = user;
    newTransaction.amountChanged = transaction.amountChanged;
    newTransaction.transactionType = transaction.transactionType;
    return this.repository.save(newTransaction);
  }

  public async getAllTransaction(user: UserEntity, filter: GetAllQuery) {
    return await this.getAll(filter, {
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  public async getTransactionByFacilityID(
    facility_id: number,
    filter: GetAllQuery,
  ) {
    const facility = await new FacilityService().getOneByID(facility_id);
    if (!facility) {
      throw new NotFoundError("Facility not found");
    }
    return await this.getAll(filter, {
      where: {
        facility: {
          id: facility_id,
        },
      },
    });
  }

  public async deleteTransaction(id: number): Promise<void> {
    this.delete(id);
  }

  public async changeBalance(transaction: TransactionModel) {
    const user = await new UserService().getOneByID(transaction.user_id);
    user.balance = user.balance + transaction.amountChanged;
    return this.repository.save(user);
  }
}

export default TransactionService;
