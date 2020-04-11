export class User {
  constructor(
    public id: string,
    public email: string,
    public token: string,
    public name: string,
    public photoUrl: string,
  ) {}
}