export class Combo {

  constructor(
    public id: string,
    public title: string,
    public imgUrl: string,
    public price: number,
    public discount: number,
    public rate: number,
    public startDest: string,
    public travelDest: string,
    public wifi: boolean,
    public breakfast: boolean,
    public hotelRating: number,
    public taxi: boolean,
    public description: string,
    public availableWeek: AvailableWeek,
    public coupon: Coupon,
  ) { }
}

export interface Coupon {
  [key: string]: number;
}

export class AvailableWeek {
  constructor(
    public mon: boolean,
    public tue: boolean,
    public wed: boolean,
    public thu: boolean,
    public fri: boolean,
    public sat: boolean,
    public sun: boolean,
  ) { }
}
