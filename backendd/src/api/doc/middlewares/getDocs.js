"use strict";

const { filter } = require("../../../../config/middlewares");
const doc = require("../controllers/doc");

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (!ctx.state.isAuthenticated) {
      return ctx.unauthorized("This action is unauthorized.");
    }

    if (ctx.state.auth.strategy.name === "users-permissions") {
      const user = ctx.state.user;

      const accesses = await strapi.documents("api::access.access").findMany({
        populate: {
          doc: {
            filters: {
              documentId: {
                $notNull: true,
              },
            },
          },
          user: {
            filters: {
              documentId: user.documentId,
            },
          },
        },
      });

      const entries = accesses
        .map((access) => {
          if (access?.doc && access?.user?.documentId === user?.documentId) {
            return access.doc;
          } else {
            return null;
          }
        })
        .filter((entry) => entry !== null);

      return ctx.send({ data: entries }, 200);
    }

    return next();
  };
};
