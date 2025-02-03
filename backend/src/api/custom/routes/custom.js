module.exports = {
  routes: [
    {
      method: "POST",
      path: "/recents",
      handler: "custom.postRecent",
    },
    {
      method: "GET",
      path: "/starred",
      handler: "custom.getStarredDocs",
    },
    {
      method: "GET",
      path: "/starred/:documentId",
      handler: "custom.getStarredDoc",
    },
    {
      method: "POST",
      path: "/starred",
      handler: "custom.postStarredDoc",
    },
    {
      method: "GET",
      path: "/starred-and-recents", //to get starred and recents in single call
      handler: "custom.getStarredAndRecents",
    },
  ],
};
