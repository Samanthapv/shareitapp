const express = require("express");
const router = express.Router();
require("dotenv").config();
const models = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const isLoggedIn = require("../guards/isLoggedIn");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1108081",
  key: "2985b7ef897701726d64",
  secret: "11dbeb549e59bd3fae6e",
  cluster: "eu",
  useTLS: true,
});

router.post("/messages/:id", isLoggedIn, (req, res) => {
  const receiver_id = req.params.id;
  const sender_id = req.userId;
  const text = req.body.message;

  // Store message in database
  try {
    models.Message.create({ text, sender_id, receiver_id });
  } catch (err) {
    res.status(500).send(err);
  }

  // Define channel name
  const ids = [sender_id, receiver_id].sort();
  const channel = `chat-${ids[0]}-${ids[1]}`;

  // Trigger an event to Pusher

  pusher.trigger(channel, "message", {
    sender_id,
    receiver_id,
    text,
  });

  res.send({ msg: "Sent" });
});

// Get all conversations

router.get("/messages", isLoggedIn, async (req, res) => {
  const { userId } = req;

  try {
    const data = await models.Message.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
      },
      group: ["sender_id", "receiver_id"],
      attributes: ["sender_id", "receiver_id"],
      include: ["sender", "receiver"],
    });

    const conversations = data
      .map((e) => (e.receiver.id !== userId ? e.receiver : e.sender))
      .reduce(
        (unique, item) =>
          unique.some((e) => e.id === item.id) ? unique : [...unique, item],
        []
      );

    res.send(conversations);
  } catch (error) {
    console.log(error);
  }
});

// Get all messages between two users

router.get("/messages/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  const messages = await models.Message.findAll({
    where: {
      sender_id: {
        [Op.in]: [userId, id],
      },
      receiver_id: {
        [Op.in]: [userId, id],
      },
    },
    include: ["sender", "receiver"],
    limit: 10,
    order: [["id", "DESC"]],
  });

  res.send(messages.reverse());
});

module.exports = router;