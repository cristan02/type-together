"use strict";

const _ = require("lodash");
const { orderBy } = require("lodash/fp");
const isEqual = require("lodash/isEqual");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */

  bootstrap({ strapi }) {
    const { Server } = require("socket.io");
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["userid", "username", "auth"],
        credentials: false,
      },
    });

    io.on("connection", (socket) => {
      const userid = socket.handshake.headers["userid"];
      const username = socket.handshake.headers["username"];
      const auth = socket.handshake.headers["auth"];

      let latestChanges;

      socket.on("get-document", async (id) => {
        socket.join(id);

        const room = io.sockets.adapter.rooms.get(id);
        const numClients = room ? room.size : 0;

        //fix below
        const doc = await strapi.documents("api::doc.doc").findOne({
          documentId: id,
          populate: "*",
        });

        let snapshot = doc.snapshots?.[doc.snapshots.length - 1] || null;

        if (numClients === 1) {
          snapshot = await strapi.documents("api::snapshot.snapshot").create({
            data: {
              doc: id,
              content: snapshot ? snapshot?.content : {},
            },
          });
        } else {
          snapshot = snapshot;
        }
        latestChanges = snapshot?.content;

        // find from db and send to client
        socket.emit("load-document", snapshot);

        socket.on("send-changes", (data) => {
          const { delta, snapshotId, content } = data;
          socket.broadcast.to(id).emit("receive-changes", delta, id);

          strapi.documents("api::delta.delta").create({
            data: {
              doc: id,
              snapshot: snapshot.documentId,
              user: userid,
              content: delta,
            },
          });
        });

        socket.on("save-document", async (data) => {
          const { content, snapshotId } = data;

          if (!isEqual(latestChanges, content)) {
            latestChanges = content;

            const entry = await strapi
              .documents("api::snapshot.snapshot")
              .update({
                documentId: snapshot.documentId,
                data: { content: content },
              });
          }
        });

        socket.on("send-restore", async (data) => {
          const { content } = data;
          latestChanges = content;

          const entry = await strapi
            .documents("api::snapshot.snapshot")
            .update({
              documentId: snapshot.documentId,
              data: { content: content },
            });

          io.to(id).emit("recieve-restore", entry);
        });

        socket.on("send-cursor", (data) => {
          socket.broadcast.to(id).emit("receive-cursor", data, id);
        });
      });

      socket.on("chat-room", async (id) => {
        socket.join(id);

        socket.on("send-message", (message) => {
          io.to(id).emit("receive-message", message);
        });
      });
    });
  },
};
