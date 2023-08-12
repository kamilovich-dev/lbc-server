import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { card, cardId } from './card';
import type { module, moduleId } from './module';
import type { refresh_token, refresh_tokenId } from './refresh_token';

export interface userAttributes {
  id: number;
  email: string;
  password: string;
  login?: string;
  avatar_url?: string;
  activation_link?: string;
  is_activated: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type userPk = "id";
export type userId = user[userPk];
export type userOptionalAttributes = "id" | "login" | "avatar_url" | "activation_link" | "createdAt" | "updatedAt";
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
  id!: number;
  email!: string;
  password!: string;
  login?: string;
  avatar_url?: string;
  activation_link?: string;
  is_activated!: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // user hasMany card via module_id
  cards!: card[];
  getCards!: Sequelize.HasManyGetAssociationsMixin<card>;
  setCards!: Sequelize.HasManySetAssociationsMixin<card, cardId>;
  addCard!: Sequelize.HasManyAddAssociationMixin<card, cardId>;
  addCards!: Sequelize.HasManyAddAssociationsMixin<card, cardId>;
  createCard!: Sequelize.HasManyCreateAssociationMixin<card>;
  removeCard!: Sequelize.HasManyRemoveAssociationMixin<card, cardId>;
  removeCards!: Sequelize.HasManyRemoveAssociationsMixin<card, cardId>;
  hasCard!: Sequelize.HasManyHasAssociationMixin<card, cardId>;
  hasCards!: Sequelize.HasManyHasAssociationsMixin<card, cardId>;
  countCards!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany module via user_id
  modules!: module[];
  getModules!: Sequelize.HasManyGetAssociationsMixin<module>;
  setModules!: Sequelize.HasManySetAssociationsMixin<module, moduleId>;
  addModule!: Sequelize.HasManyAddAssociationMixin<module, moduleId>;
  addModules!: Sequelize.HasManyAddAssociationsMixin<module, moduleId>;
  createModule!: Sequelize.HasManyCreateAssociationMixin<module>;
  removeModule!: Sequelize.HasManyRemoveAssociationMixin<module, moduleId>;
  removeModules!: Sequelize.HasManyRemoveAssociationsMixin<module, moduleId>;
  hasModule!: Sequelize.HasManyHasAssociationMixin<module, moduleId>;
  hasModules!: Sequelize.HasManyHasAssociationsMixin<module, moduleId>;
  countModules!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany refresh_token via user_id
  refresh_tokens!: refresh_token[];
  getRefresh_tokens!: Sequelize.HasManyGetAssociationsMixin<refresh_token>;
  setRefresh_tokens!: Sequelize.HasManySetAssociationsMixin<refresh_token, refresh_tokenId>;
  addRefresh_token!: Sequelize.HasManyAddAssociationMixin<refresh_token, refresh_tokenId>;
  addRefresh_tokens!: Sequelize.HasManyAddAssociationsMixin<refresh_token, refresh_tokenId>;
  createRefresh_token!: Sequelize.HasManyCreateAssociationMixin<refresh_token>;
  removeRefresh_token!: Sequelize.HasManyRemoveAssociationMixin<refresh_token, refresh_tokenId>;
  removeRefresh_tokens!: Sequelize.HasManyRemoveAssociationsMixin<refresh_token, refresh_tokenId>;
  hasRefresh_token!: Sequelize.HasManyHasAssociationMixin<refresh_token, refresh_tokenId>;
  hasRefresh_tokens!: Sequelize.HasManyHasAssociationsMixin<refresh_token, refresh_tokenId>;
  countRefresh_tokens!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return user.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    login: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    activation_link: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    is_activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'user',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
