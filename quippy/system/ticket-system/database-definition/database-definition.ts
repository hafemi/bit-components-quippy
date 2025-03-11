import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from "sequelize";
import { sequelize } from "@cd/core.database.sequelize.default-connection";
import { createNewValidUUID } from "@cd/core.database.util.uuid-handler";

export class TicketType extends Model<InferAttributes<TicketType>, InferCreationAttributes<TicketType>> {
  declare uuid: string;
  declare guildID: string;
  declare typeName: string;
  declare roleID: string;
  declare prefix: string;

  static async isValidUUID(uuid: string): Promise<boolean> {
    const entry = await TicketType.findOne({ where: { uuid: uuid } });

    return !entry;
  }

  static async createNewValidUUID(): Promise<string> {
    return await createNewValidUUID(this.isValidUUID);
  }

  static async getEntry(options: {
    guildID: string;
    typeName: string;
  }): Promise<TicketType> {
    const entry = await TicketType.findOne({ where: options });

    if (!entry)
      throw new Error(`No entry found in TicketType`);

    return entry;
  }

  static async isEntry(options: any): Promise<boolean> {
    const entry = await TicketType.findOne({ where: options });

    return !!entry;
  }
}

TicketType.init({
  uuid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  guildID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roleID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prefix: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
  {
    sequelize,
    tableName: 'ticket_type'
});