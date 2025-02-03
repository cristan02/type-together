"use strict";

/**
 * doc router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::doc.doc", {
  config: {
    find: {
      middlewares: ["api::doc.get-docs"],
    },
    findOne: {
      middlewares: ["api::doc.has-access"],
    },
    update: {
      middlewares: ["api::doc.has-access"],
    },
    delete: {
      middlewares: ["api::doc.has-access"],
    },

    create: {
      middlewares: ["api::doc.after-create"],
    },
  },
});
