import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { bookmark_module, bookmark_moduleId } from './bookmark_module';
import type { folder, folderId } from './folder';
import type { user, userId } from './user';

export interface moduleAttributes {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  folder_id?: number;
  is_published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type modulePk = "id";
export type moduleId = module[modulePk];
export type moduleOptionalAttributes = "id" | "description" | "folder_id" | "is_published" | "createdAt" | "updatedAt";
export type moduleCreationAttributes = Optional<moduleAttributes, moduleOptionalAttributes>;

export class module extends Model<moduleAttributes, moduleCreationAttributes> implements moduleAttributes {
  id!: number;
  name!: string;
  description?: string;
  user_id!: number;
  folder_id?: number;
  is_published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // module belongsTo folder via folder_id
  folder!: folder;
  getFolder!: Sequelize.BelongsToGetAssociationMixin<folder>;
  setFolder!: Sequelize.BelongsToSetAssociationMixin<folder, folderId>;
  createFolder!: Sequelize.BelongsToCreateAssociationMixin<folder>;
  // module hasMany bookmark_module via module_id
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
    },
    folder_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'folder',
        key: 'id'
      }
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: true
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
