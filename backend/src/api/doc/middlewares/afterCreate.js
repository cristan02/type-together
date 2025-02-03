"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    await next();

    const user = ctx.state.user;

    await strapi.documents("api::access.access").create({
      data: {
        doc: ctx.response.body.data.documentId,
        user: user.documentId,
        permission: "edit",
      },
    });
  };
};
