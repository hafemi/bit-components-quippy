import { sequelize } from "@cd/core.database.sequelize.default-connection";
import { createNewValidUUID } from "@cd/core.database.util.uuid-handler";
import { DatabaseChannelIds } from "@hafemi/quippy.lib.types";
import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes
} from "@sequelize/core";

/**
 * In case of adding more Ids, please make sure to do these steps so "/serverconfig list" is up to date:
 * add iteration in getStringRecordWithServerConfig function
 * add empty validation in isServerConfigEmpty function
*/

export class ServerConfig extends Model<InferAttributes<ServerConfig>, InferCreationAttributes<ServerConfig>> {
  declare uuid: string;
  declare guildId: string;
  declare channelIds: Partial<DatabaseChannelIds>;

  static async isValidUUID(uuid: string): Promise<boolean> {
    const entry = await ServerConfig.findOne({ where: { uuid: uuid } });

    return !entry;
  }

  static async createNewValidUUID(): Promise<string> {
    return await createNewValidUUID(this.isValidUUID);
  }

  static async getEntry(options: {
    guildId: string;
  }): Promise<ServerConfig | false> {
    const entry = await ServerConfig.findOne({ where: options });

    if (!entry)
      return false;

    return entry;
  }

  static async isEntry(options: {
    uuid: string;
  }): Promise<boolean> {
    const entry = await ServerConfig.findOne({ where: options });

    return !!entry;
  }
}

ServerConfig.init({
  uuid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  guildId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  channelIds: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  }
},
  {
    sequelize,
    tableName: 'server_config'
  });