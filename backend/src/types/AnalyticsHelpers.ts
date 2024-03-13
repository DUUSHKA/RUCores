import FacilityService from "../services/FacilityService";
import { coinsByFacility, timeByFacility } from "./AnalyticsTypes";

type GroupedWithSum<T> = Record<number, { items: T[]; sum: number }>;

export function groupByAndSum<T>(
  array: T[],
  keyGetter: (item: T) => number,
  sumProperty: keyof T,
): GroupedWithSum<T> {
  return array.reduce((result: GroupedWithSum<T>, item: T) => {
    const key = keyGetter(item);
    if (!result[key]) {
      result[key] = { items: [], sum: 0 };
    }
    result[key].items.push(item);
    result[key].sum += item[sumProperty] as number;
    return result;
  }, {});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function pushTimeData(facilityGroups: GroupedWithSum<any>) {
  const facilityTimeArr = [];
  for (const key in facilityGroups) {
    if (Object.prototype.hasOwnProperty.call(facilityGroups, key)) {
      const group = facilityGroups[key];
      const sum = group.sum;
      const data: timeByFacility = {
        facility: (await new FacilityService().getOneByID(Number(key))).name,
        time: sum,
      };
      facilityTimeArr.push(data);
    }
  }
  return facilityTimeArr;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function pushCostData(facilityGroups: GroupedWithSum<any>) {
  const facilityCostArr = [];
  for (const key in facilityGroups) {
    if (Object.prototype.hasOwnProperty.call(facilityGroups, key)) {
      const group = facilityGroups[key];
      const sum = -1 * group.sum;
      const data: coinsByFacility = {
        facility: (await new FacilityService().getOneByID(Number(key))).name,
        coins: sum,
      };
      facilityCostArr.push(data);
    }
  }
  return facilityCostArr;
}
