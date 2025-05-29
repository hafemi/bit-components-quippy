import { sequelize } from "@cd/core.database.sequelize.default-connection";
import { createNewValidUUID } from "@cd/core.database.util.uuid-handler";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from "@sequelize/core";

import {
  TicketTypeModalInformation,
  ITicket,
  ITicketType
} from "@hafemi/quippy.lib.types";

export class TicketType extends Model<InferAttributes<TicketType>, InferCreationAttributes<TicketType>> implements ITicketType {
  declare uuid: string;
  declare guildID: string;
  declare typeName: string;
  declare roleID: string;
  declare prefix: string;
  declare modalInformation?: TicketTypeModalInformation;

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
  }): Promise<TicketType | false> {
    const entry = await TicketType.findOne({ where: options });

    if (!entry)
      return false;

    return entry;
  }

  static async isEntry(options: any): Promise<boolean> {
    const entry = await TicketType.findOne({ where: options });

    return !!entry;
  }
}

export class Ticket extends Model<InferAttributes<Ticket>, InferCreationAttributes<Ticket>> implements ITicket {
  declare uuid: string;
  declare guildID: string;
  declare authorID: string;
  declare threadID: string;
  declare type: string;
  declare modalInformation?: TicketTypeModalInformation;

  static async isValidUUID(uuid: string): Promise<boolean> {
    const entry = await Ticket.findOne({ where: { uuid: uuid } });

    return !entry;
  }

  static async createNewValidUUID(): Promise<string> {
    return await createNewValidUUID(this.isValidUUID);
  }

  static async getEntry(options: any): Promise<Ticket | false> {
    const entry = await Ticket.findOne({ where: options });

    if (!entry)
      return false;

    return entry;
  }

  static async isEntry(options: any): Promise<boolean> {
    const entry = await Ticket.findOne({ where: options });

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
  modalInformation: {
    type: DataTypes.JSON,
    allowNull: true,
  }
},
  {
    sequelize,
    tableName: 'ticket_type'
  });

Ticket.init({
  uuid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  guildID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  threadID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modalInformation: {
    type: DataTypes.JSON,
    allowNull: true,
  }
},
  {
    sequelize,
    tableName: 'ticket'
  });
