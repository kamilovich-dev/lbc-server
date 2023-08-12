import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface moduleAttributes {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type modulePk = "id";
export type moduleId = module[modulePk];
export type moduleOptionalAttributes = "id" | "description" | "createdAt" | "updatedAt";
export type moduleCreationAttributes = Optional<moduleAttributes, moduleOptionalAttributes>;

export class module extends Model<moduleAttributes, moduleCreationAttributes> implements moduleAttributes {
  id!: number;
  name!: string;
  description?: string;
  user_id!: number;
  createdAt?: Date;
  updatedAt?: Date;

  // module belongsTo user via user_id
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof module {
    return module.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'module',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "module_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
