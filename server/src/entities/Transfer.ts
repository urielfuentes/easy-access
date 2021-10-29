import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { User } from "./User";
import { File } from "./File";

@Entity()
export class Transfer {
  @PrimaryKey()
  id!: number;

  @Property()
  phrase!: string;

  @Property()
  duration!: number;

  @ManyToOne(() => User)
  owner!: User;

  @Property()
  is_public!: boolean;

  @OneToMany(() => File, (file) => file.file_transfer)
  transfer_files = new Collection<File>(this);

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
