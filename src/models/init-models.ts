import type { Sequelize } from "sequelize";
import { bookmark_folder as _bookmark_folder } from "./bookmark_folder";
import type { bookmark_folderAttributes, bookmark_folderCreationAttributes } from "./bookmark_folder";
import { bookmark_module as _bookmark_module } from "./bookmark_module";
import type { bookmark_moduleAttributes, bookmark_moduleCreationAttributes } from "./bookmark_module";
import { card as _card } from "./card";
import type { cardAttributes, cardCreationAttributes } from "./card";
import { folder as _folder } from "./folder";
import type { folderAttributes, folderCreationAttributes } from "./folder";
import { module as _module } from "./module";
import type { moduleAttributes, moduleCreationAttributes } from "./module";
import { personal_data as _personal_data } from "./personal_data";
import type { personal_dataAttributes, personal_dataCreationAttributes } from "./personal_data";
import { refresh_token as _refresh_token } from "./refresh_token";
import type { refresh_tokenAttributes, refresh_tokenCreationAttributes } from "./refresh_token";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";

export {
  _bookmark_folder as bookmark_folder,
  _bookmark_module as bookmark_module,
  _card as card,
  _folder as folder,
  _module as module,
  _personal_data as personal_data,
  _refresh_token as refresh_token,
  _user as user,
};

export type {
  bookmark_folderAttributes,
  bookmark_folderCreationAttributes,
  bookmark_moduleAttributes,
  bookmark_moduleCreationAttributes,
  cardAttributes,
  cardCreationAttributes,
  folderAttributes,
  folderCreationAttributes,
  moduleAttributes,
  moduleCreationAttributes,
  personal_dataAttributes,
  personal_dataCreationAttributes,
  refresh_tokenAttributes,
  refresh_tokenCreationAttributes,
  userAttributes,
  userCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const bookmark_folder = _bookmark_folder.initModel(sequelize);
  const bookmark_module = _bookmark_module.initModel(sequelize);
  const card = _card.initModel(sequelize);
  const folder = _folder.initModel(sequelize);
  const module = _module.initModel(sequelize);
  const personal_data = _personal_data.initModel(sequelize);
  const refresh_token = _refresh_token.initModel(sequelize);
  const user = _user.initModel(sequelize);

  bookmark_folder.belongsTo(folder, { as: "folder", foreignKey: "folder_id"});
  folder.hasMany(bookmark_folder, { as: "bookmark_folders", foreignKey: "folder_id"});
  bookmark_module.belongsTo(module, { as: "module", foreignKey: "module_id"});
  module.hasMany(bookmark_module, { as: "bookmark_modules", foreignKey: "module_id"});
  bookmark_folder.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(bookmark_folder, { as: "bookmark_folders", foreignKey: "user_id"});
  bookmark_module.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(bookmark_module, { as: "bookmark_modules", foreignKey: "user_id"});
  card.belongsTo(user, { as: "module", foreignKey: "module_id"});
  user.hasMany(card, { as: "cards", foreignKey: "module_id"});
  folder.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(folder, { as: "folders", foreignKey: "user_id"});
  module.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(module, { as: "modules", foreignKey: "user_id"});
  personal_data.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasOne(personal_data, { as: "personal_datum", foreignKey: "user_id"});
  refresh_token.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(refresh_token, { as: "refresh_tokens", foreignKey: "user_id"});

  return {
    bookmark_folder: bookmark_folder,
    bookmark_module: bookmark_module,
    card: card,
    folder: folder,
    module: module,
    personal_data: personal_data,
    refresh_token: refresh_token,
    user: user,
  };
}
