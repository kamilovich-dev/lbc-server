import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { user, userId } from './user';

export interface cardAttributes {
  id: number;
  order: number;
  term: string;
  definition?: string;
  is_favorite?: boolean;
  img_url?: string;
  module_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type cardPk = "id";
export type cardId = card[cardPk];
export type cardOptionalAttributes = "id" | "definition" | "is_favorite" | "img_url" | "createdAt" | "updatedAt";
export type cardCreationAttributes = Optional<cardAttributes, cardOptionalAttributes>;

export class card extends Model<cardAttributes, cardCreationAttributes> implements cardAttributes {
  id!: number;
  order!: number;
  term!: string;
  definition?: string;
  is_favorite?: boolean;
  img_url?: string;
  module_id!: number;
  createdAt?: Date;
  updatedAt?: Date;

  // card belongsTo user via module_id
  module!: user;
  getModule!: Sequelize.BelongsToGetAssociationMixin<user>;
  setModule!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createModule!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof card {
    return card.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    term: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    definition: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    is_favorite: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    img_url: {
      type: DataTypes.STRING(1024),
      allowNull: true
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'card',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "card_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
