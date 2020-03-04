export class Ticket {
  constructor(
    public id: string,
    public title: string,
    public imgUrl: string,
    public rate: number,
    public startDate: Date,
    public startDest: string,
    public numTickets: number
  ) { }
}
