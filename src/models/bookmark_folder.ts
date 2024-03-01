import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { folder, folderId } from './folder';
import type { user, userId } from './user';

export interface bookmark_folderAttributes {
  id: number;
  user_id: number;
  folder_id: number;
}

export type bookmark_folderPk = "id";
export type bookmark_folderId = bookmark_folder[bookmark_folderPk];
export type bookmark_folderOptionalAttributes = "id";
export type bookmark_folderCreationAttributes = Optional<bookmark_folderAttributes, bookmark_folderOptionalAttributes>;

export class bookmark_folder extends Model<bookmark_folderAttributes, bookmark_folderCreationAttributes> implements bookmark_folderAttributes {
  id!: number;
  user_id!: number;
  folder_id!: number;

  // bookmark_folder belongsTo folder via folder_id
  folder!: folder;
  getFolder!: Sequelize.BelongsToGetAssociationMixin<folder>;
  setFolder!: Sequelize.BelongsToSetAssociationMixin<folder, folderId>;
  createFolder!: Sequelize.BelongsToCreateAssociationMixin<folder>;
  // bookmark_folder belongsTo user via user_id
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof bookmark_folder {
    return bookmark_folder.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    folder_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'folder',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'bookmark_folder',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "bookmark_folder_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
