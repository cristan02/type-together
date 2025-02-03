"use strict";

/**
 * snapshot router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::snapshot.snapshot", {
  config: {
    findOne: {
      middlewares: ["api::snapshot.has-access"],
    },
    update: {
      middlewares: ["api::snapshot.has-access"],
    },
  },
});
