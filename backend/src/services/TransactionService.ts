import {
  TransactionEntity,
  TransactionType,
} from "../database/Entities/transactionEntity";
import { UserEntity } from "../database/Entities/userEntity";
import { GetAllQuery } from "../types/GenericUtilTypes";
import { TransactionModel } from "../types/TransactionModel";
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
    const facility = await new FacilityService().getOneByID(
      transaction.facility_id,
    );
    newTransaction.eventDesription = transaction.eventDescription;
    newTransaction.date = transaction.date;
    newTransaction.user = user;
    newTransaction.facility = facility;
    newTransaction.amountChanged = transaction.amountChanged;
    if (newTransaction.amountChanged > 0) {
      newTransaction.transactionType = TransactionType.Refill;
    } else {
      newTransaction.transactionType = TransactionType.Transfer;
    }

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

  public async changeBalance(transaction: TransactionModel) {
    const user = await new UserService().getOneByID(transaction.user_id);

    user.balance = user.balance + transaction.amountChanged;

    return this.repository.save(user);
  }
}

export default TransactionService;
