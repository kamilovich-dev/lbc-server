import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface refresh_tokenAttributes {
  id: number;
  token: string;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type refresh_tokenPk = "id";
export type refresh_tokenId = refresh_token[refresh_tokenPk];
export type refresh_tokenOptionalAttributes = "id" | "createdAt" | "updatedAt";
export type refresh_tokenCreationAttributes = Optional<refresh_tokenAttributes, refresh_tokenOptionalAttributes>;

export class refresh_token extends Model<refresh_tokenAttributes, refresh_tokenCreationAttributes> implements refresh_tokenAttributes {
  id!: number;
  token!: string;
  user_id!: number;
  createdAt?: Date;
  updatedAt?: Date;

  // refresh_token belongsTo user via user_id
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof refresh_token {
    return refresh_token.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'refresh_token',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "refresh_token_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
