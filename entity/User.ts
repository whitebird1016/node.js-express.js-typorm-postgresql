import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column()
  public firstname: string;
  @Column()
  public lastname: string;
  @Column()
  public email: string;
  @Column()
  public address1: string;
  @Column()
  public address2: string;
  @Column()
  public city: string;
  @Column()
  public state: string;
  @Column()
  public phone: string;
  @Column()
  public password: string;
}
export default User;
