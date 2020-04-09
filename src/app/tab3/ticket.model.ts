export class Ticket {
  constructor(
    public id: string,
    public comboId: string,
    public title: string,
    public imgUrl: string,
    public rate: number,
    public startDest: string,
    public name: string,
    public phoneNumber: string,
    public email: string,
    public note: string,
    public coupon: string,
    public startDate: Date,
    public numTickets: number,
    public userId: string,
  ) {
  }
}
