import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { bookmark_folder, bookmark_folderId } from './bookmark_folder';
import type { bookmark_module, bookmark_moduleId } from './bookmark_module';
import type { card, cardId } from './card';
import type { folder, folderId } from './folder';
import type { module, moduleId } from './module';
import type { personal_data, personal_dataCreationAttributes, personal_dataId } from './personal_data';
import type { refresh_token, refresh_tokenId } from './refresh_token';

export interface userAttributes {
  id: number;
  login: string;
  email: string;
  password: string;
  avatar_url?: string;
  activation_link?: string;
  is_activated: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type userPk = "id";
export type userId = user[userPk];
export type userOptionalAttributes = "id" | "avatar_url" | "activation_link" | "createdAt" | "updatedAt";
export type userCreationAttributes = Optional<userAttributes, userOptionalAttributes>;

export class user extends Model<userAttributes, userCreationAttributes> implements userAttributes {
  id!: number;
  login!: string;
  email!: string;
  password!: string;
  avatar_url?: string;
  activation_link?: string;
  is_activated!: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // user hasMany bookmark_folder via user_id
  bookmark_folders!: bookmark_folder[];
  getBookmark_folders!: Sequelize.HasManyGetAssociationsMixin<bookmark_folder>;
  setBookmark_folders!: Sequelize.HasManySetAssociationsMixin<bookmark_folder, bookmark_folderId>;
  addBookmark_folder!: Sequelize.HasManyAddAssociationMixin<bookmark_folder, bookmark_folderId>;
  addBookmark_folders!: Sequelize.HasManyAddAssociationsMixin<bookmark_folder, bookmark_folderId>;
  createBookmark_folder!: Sequelize.HasManyCreateAssociationMixin<bookmark_folder>;
  removeBookmark_folder!: Sequelize.HasManyRemoveAssociationMixin<bookmark_folder, bookmark_folderId>;
  removeBookmark_folders!: Sequelize.HasManyRemoveAssociationsMixin<bookmark_folder, bookmark_folderId>;
  hasBookmark_folder!: Sequelize.HasManyHasAssociationMixin<bookmark_folder, bookmark_folderId>;
  hasBookmark_folders!: Sequelize.HasManyHasAssociationsMixin<bookmark_folder, bookmark_folderId>;
  countBookmark_folders!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany bookmark_module via user_id
  bookmark_modules!: bookmark_module[];
  getBookmark_modules!: Sequelize.HasManyGetAssociationsMixin<bookmark_module>;
  setBookmark_modules!: Sequelize.HasManySetAssociationsMixin<bookmark_module, bookmark_moduleId>;
  addBookmark_module!: Sequelize.HasManyAddAssociationMixin<bookmark_module, bookmark_moduleId>;
  addBookmark_modules!: Sequelize.HasManyAddAssociationsMixin<bookmark_module, bookmark_moduleId>;
  createBookmark_module!: Sequelize.HasManyCreateAssociationMixin<bookmark_module>;
  removeBookmark_module!: Sequelize.HasManyRemoveAssociationMixin<bookmark_module, bookmark_moduleId>;
  removeBookmark_modules!: Sequelize.HasManyRemoveAssociationsMixin<bookmark_module, bookmark_moduleId>;
  hasBookmark_module!: Sequelize.HasManyHasAssociationMixin<bookmark_module, bookmark_moduleId>;
  hasBookmark_modules!: Sequelize.HasManyHasAssociationsMixin<bookmark_module, bookmark_moduleId>;
  countBookmark_modules!: Sequelize.HasManyCountAssociationsMixin;
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
  // user hasMany folder via user_id
  folders!: folder[];
  getFolders!: Sequelize.HasManyGetAssociationsMixin<folder>;
  setFolders!: Sequelize.HasManySetAssociationsMixin<folder, folderId>;
  addFolder!: Sequelize.HasManyAddAssociationMixin<folder, folderId>;
  addFolders!: Sequelize.HasManyAddAssociationsMixin<folder, folderId>;
  createFolder!: Sequelize.HasManyCreateAssociationMixin<folder>;
  removeFolder!: Sequelize.HasManyRemoveAssociationMixin<folder, folderId>;
  removeFolders!: Sequelize.HasManyRemoveAssociationsMixin<folder, folderId>;
  hasFolder!: Sequelize.HasManyHasAssociationMixin<folder, folderId>;
  hasFolders!: Sequelize.HasManyHasAssociationsMixin<folder, folderId>;
  countFolders!: Sequelize.HasManyCountAssociationsMixin;
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
  // user hasOne personal_data via user_id
  personal_datum!: personal_data;
  getPersonal_datum!: Sequelize.HasOneGetAssociationMixin<personal_data>;
  setPersonal_datum!: Sequelize.HasOneSetAssociationMixin<personal_data, personal_dataId>;
  createPersonal_datum!: Sequelize.HasOneCreateAssociationMixin<personal_data>;
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
    login: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(1024),
      allowNull: false
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
