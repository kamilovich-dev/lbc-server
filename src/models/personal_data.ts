import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface personal_dataAttributes {
  user_id: number;
  first_name?: string;
  last_name?: string;
  father_name?: string;
  birth_date?: string;
}

export type personal_dataPk = "user_id";
export type personal_dataId = personal_data[personal_dataPk];
export type personal_dataOptionalAttributes = "first_name" | "last_name" | "father_name" | "birth_date";
export type personal_dataCreationAttributes = Optional<personal_dataAttributes, personal_dataOptionalAttributes>;

export class personal_data extends Model<personal_dataAttributes, personal_dataCreationAttributes> implements personal_dataAttributes {
  user_id!: number;
  first_name?: string;
  last_name?: string;
  father_name?: string;
  birth_date?: string;

  // personal_data belongsTo user via user_id
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof personal_data {
    return personal_data.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    first_name: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    father_name: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personal_data',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "personal_data_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
