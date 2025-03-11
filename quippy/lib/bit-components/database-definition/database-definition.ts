import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes
} from "sequelize";
import { sequelize } from "@cd/core.database.sequelize.default-connection";
import { createNewValidUUID } from "@cd/core.database.util.uuid-handler";

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
  }): Promise<TEMPLATE> {
    const entry = await TEMPLATE.findOne({ where: options });

    if (!entry)
      throw new Error(`No entry found in TEMPLATE`);

    return entry;
  }

  static async isEntry(options: {
    uuid: string;
  }): Promise<boolean> {
    const entry = await TEMPLATE.findOne({ where: options });

    return !!entry;
  }
}

TEMPLATE.init({
  uuid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
},
  {
    sequelize,
    tableName: 'template'
  });