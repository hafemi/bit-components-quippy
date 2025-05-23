import { sequelize } from "@cd/core.database.sequelize.default-connection";
import { createNewValidUUID } from "@cd/core.database.util.uuid-handler";
import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes
} from "@sequelize/core";

export class TEMPLATE extends Model<InferAttributes<TEMPLATE>, InferCreationAttributes<TEMPLATE>> {
  declare uuid: string;

  static async isValidUUID(uuid: string): Promise<boolean> {
    const entry = await TEMPLATE.findOne({ where: { uuid: uuid } });

    return !entry;
  }

  static async createNewValidUUID(): Promise<string> {
    return await createNewValidUUID(this.isValidUUID);
  }

  static async getEntry(options: {
    uuid: string;
  }): Promise<TEMPLATE | false> {
    const entry = await TEMPLATE.findOne({ where: options });

    if (!entry)
      return false;

    return entry;
  }

  static async isEntry(options: {
    uuid: string;
  }): Promise<boolean> {
    const entry = await TEMPLATE.findOne({ where: options });

    return !!entry;
  }
}

// Uncomment this when you want to setup the table

// TEMPLATE.init({
//   uuid: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
// },
//   {
//     sequelize,
//     tableName: 'template'
//   });