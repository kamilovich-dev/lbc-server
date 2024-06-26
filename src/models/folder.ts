import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { bookmark_folder, bookmark_folderId } from './bookmark_folder';
import type { user, userId } from './user';

export interface folderAttributes {
  id: number;
  name: string;
  description?: string;
  is_published?: boolean;
  user_id?: number;
  module_ids?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type folderPk = "id";
export type folderId = folder[folderPk];
export type folderOptionalAttributes = "id" | "description" | "is_published" | "user_id" | "module_ids" | "createdAt" | "updatedAt";
export type folderCreationAttributes = Optional<folderAttributes, folderOptionalAttributes>;

export class folder extends Model<folderAttributes, folderCreationAttributes> implements folderAttributes {
  id!: number;
  name!: string;
  description?: string;
  is_published?: boolean;
  user_id?: number;
  module_ids?: number[];
  createdAt?: Date;
  updatedAt?: Date;

  // folder hasMany bookmark_folder via folder_id
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
  // folder belongsTo user via user_id
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof folder {
    return folder.init({
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
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    module_ids: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'folder',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "folder_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
