import { FacilityEntity } from "../database/Entities/facilityEntity";
import { TransactionEntity } from "../database/Entities/transactionEntity";

export class monthlyData {
  month: string;
  year: number;
  spending: number;
  time: number; //total time spent in a facility that month
  coinsSpent: coinsByFacility[];
  //timeSpent: timeByFacility[];
}

export class coinsByFacility {
  facility: string;
  coins: number;
}

export class timeByFacility {
  facility: string;
  time: number; //In minutes
}

export class userStats {
  monthlySummary: {
    total: number;
    average: number;
    totalTime: number; //total time spent in facilities
    averageTime: number; //average time spent in facilities each month
  };
  monthlyData: monthlyData[];
  coinsSpent: coinsByFacility[]; //total coins spent per facility in the past 12 months
  timeScheduled: timeByFacility[]; //total time scheduled within the last 12 months
  //timeSpent: timeByFacility[];
}

export class monthlyProviderData {
  month: string;
  year: number;
  earnings: number;
  totalUnbooked: number;
  totalBooked: number;
}

export class providerStats {
  monthlySummary: {
    name: string;
    totalEarning: number;
    averageEarning: number;
    totalUnbooked: number;
    totalBooked: number;
  };
  monthlyData: monthlyProviderData[];
}

export class TransactionNotRefill extends TransactionEntity {
  facility: FacilityEntity;
}
