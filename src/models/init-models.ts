import type { Sequelize } from "sequelize";
import { card as _card } from "./card";
import type { cardAttributes, cardCreationAttributes } from "./card";
import { module as _module } from "./module";
import type { moduleAttributes, moduleCreationAttributes } from "./module";
import { refresh_token as _refresh_token } from "./refresh_token";
import type { refresh_tokenAttributes, refresh_tokenCreationAttributes } from "./refresh_token";
import { user as _user } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";

export {
  _card as card,
  _module as module,
  _refresh_token as refresh_token,
  _user as user,
};

export type {
  cardAttributes,
  cardCreationAttributes,
  moduleAttributes,
  moduleCreationAttributes,
  refresh_tokenAttributes,
  refresh_tokenCreationAttributes,
  userAttributes,
  userCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const card = _card.initModel(sequelize);
  const module = _module.initModel(sequelize);
  const refresh_token = _refresh_token.initModel(sequelize);
  const user = _user.initModel(sequelize);

  card.belongsTo(user, { as: "module", foreignKey: "module_id"});
  user.hasMany(card, { as: "cards", foreignKey: "module_id"});
  module.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(module, { as: "modules", foreignKey: "user_id"});
  refresh_token.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(refresh_token, { as: "refresh_tokens", foreignKey: "user_id"});

  return {
    card: card,
    module: module,
    refresh_token: refresh_token,
    user: user,
  };
}
