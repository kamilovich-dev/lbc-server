import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { module, moduleId } from './module';
import type { user, userId } from './user';

export interface bookmark_moduleAttributes {
  id: number;
  user_id: number;
  module_id: number;
}

export type bookmark_modulePk = "id";
export type bookmark_moduleId = bookmark_module[bookmark_modulePk];
export type bookmark_moduleOptionalAttributes = "id";
export type bookmark_moduleCreationAttributes = Optional<bookmark_moduleAttributes, bookmark_moduleOptionalAttributes>;

export class bookmark_module extends Model<bookmark_moduleAttributes, bookmark_moduleCreationAttributes> implements bookmark_moduleAttributes {
  id!: number;
  user_id!: number;
  module_id!: number;

  // bookmark_module belongsTo module via module_id
  module!: module;
  getModule!: Sequelize.BelongsToGetAssociationMixin<module>;
  setModule!: Sequelize.BelongsToSetAssociationMixin<module, moduleId>;
  createModule!: Sequelize.BelongsToCreateAssociationMixin<module>;
  // bookmark_module belongsTo user via user_id
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof bookmark_module {
    return bookmark_module.init({
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
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'module',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'bookmark_module',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "bookmark_module_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
