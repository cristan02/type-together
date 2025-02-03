"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const user = ctx.state.user;
    const entryId = ctx.params.id ? ctx.params.id : undefined;
    let entry = {};

    if (entryId) {
      entry = await strapi.documents("api::doc.doc").findOne({
        documentId: entryId,
        populate: {
          accesses: {
            populate: ["user"],
          },
        },
      });
    }

    if (!entry) {
      return ctx.notFound("Entry not found.");
    }

    const hasAccess = entry?.accesses?.some(
      (access) => access?.user?.documentId === user?.documentId
    );

    if (
      ctx.request.method === "GET" &&
      !hasAccess &&
      entry.visibility === "closed"
    ) {
      return ctx.unauthorized("This action is unauthorized.");
    } else if (ctx.request.method !== "GET" && !hasAccess) {
      return ctx.unauthorized("This action is unauthorized.");
    }
    return next();
  };
};
