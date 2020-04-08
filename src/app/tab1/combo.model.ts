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
  ) { }
}
