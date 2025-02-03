"use strict";

const { pop } = require("../../../../config/middlewares");
const access = require("../../access/controllers/access");

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const user = ctx.state.user;
    const entryId = ctx.params.id ? ctx.params.id : undefined;
    let entry = {};

    if (entryId) {
      entry = await strapi.documents("api::snapshot.snapshot").findOne({
        documentId: entryId,
        populate: {
          doc: {
            populate: {
              accesses: {
                populate: ["user"],
              },
            },
          },
        },
      });
    }

    const hasAccess = entry.doc.accesses.some(
      (access) => access.user.documentId === user.documentId
    );

    if (!hasAccess) {
      return ctx.unauthorized("This action is unauthorized.");
    }
    return next();
  };
};
