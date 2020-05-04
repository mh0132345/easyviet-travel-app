export class User {

  public phoneNumber: string;

  constructor(
    public id: string,
    public email: string,
    public token: string,
    public name: string,
    public photoUrl: string,
  ) {}
}
