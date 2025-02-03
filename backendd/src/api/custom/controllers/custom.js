module.exports = {
  async postRecent(ctx) {
    const { user } = ctx.state;
    const { documentId } = user;

    const findUser = await strapi
      .documents("plugin::users-permissions.user")
      .findOne({
        documentId: documentId,
      });

    const data = ctx.request.body;

    let recents = findUser?.recents || [];
    if (recents.includes(data.documentId)) {
      recents = [
        data.documentId,
        ...recents.filter((id) => id !== data.documentId).slice(0, 3),
      ];
    } else {
      recents = [data.documentId, ...recents];
    }

    const updateRecent = await strapi
      .documents("plugin::users-permissions.user")
      .update({
        documentId: documentId,
        data: {
          recents: recents,
        },
      });

    return ctx.send(updateRecent, 200);
  },

  async getStarredDocs(ctx) {
    const { user } = ctx.state;
    const { starred } = user;

    // loop through starred and find doc from doc
    const docs = await Promise.all(
      (starred || []).map(async (id) => {
        const doc = await strapi.documents("api::doc.doc").findOne({
          documentId: id,
        });

        return doc;
      })
    );

    return ctx.send(docs, 200);
  },

  async getStarredDoc(ctx) {
    try {
      const { user } = ctx.state;
      const { starred } = user;
      const { documentId } = ctx.params;

      if (!(starred || []).includes(documentId)) {
        return ctx.send(false, 200);
      }

      return ctx.send(true, 200);
    } catch (error) {
      console.log(error.message);
      return ctx.internalServerError();
    }
  },

  async postStarredDoc(ctx) {
    const { user } = ctx.state;
    const { documentId } = user;

    const findUser = await strapi
      .documents("plugin::users-permissions.user")
      .findOne({
        documentId: documentId,
      });

    const data = ctx.request.body;
    let starred = findUser?.starred || [];
    if (data.starred) {
      // Add to starred
      if (starred.includes(data.documentId)) {
        starred = [
          data.documentId,
          ...starred.filter((id) => id !== data.documentId),
        ];
      } else {
        starred = [data.documentId, ...starred];
      }
    } else {
      // Remove from starred
      starred = starred.filter((id) => id !== data.documentId);
    }

    const updateRecent = await strapi
      .documents("plugin::users-permissions.user")
      .update({
        documentId: documentId,
        data: {
          starred: starred,
        },
      });

    return ctx.send(updateRecent, 200);
  },

  async getStarredAndRecents(ctx) {
    try {
      const { user } = ctx.state;
      const { starred, recents } = user;

      // loop through starred and find doc from doc
      const starredDocs = await Promise.all(
        (starred || []).map(async (id) => {
          const doc = await strapi.documents("api::doc.doc").findOne({
            documentId: id,
          });

          return doc;
        })
      );

      // loop through recents and find doc from doc
      const recentsDocs = await Promise.all(
        (recents || []).map(async (id) => {
          const doc = await strapi.documents("api::doc.doc").findOne({
            documentId: id,
          });

          return doc;
        })
      );

      return ctx.send({ starred: starredDocs, recents: recentsDocs }, 200);
    } catch (error) {
      console.log(error.message);
      return ctx.internalServerError();
    }
  },
};
