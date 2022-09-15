const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name");

  res.json({
    ok: true,
    events
  });
};

const createEvent = async (req, res = response) => {
  const event = new Event({ ...req.body, user: req.uid });

  try {
    const savedEvent = await event.save();
    res.json({
      ok: true,
      event: savedEvent
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error by creating an event. Please contact to the administrator"
    });
  }
};

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    const eventFound = await Event.findById(eventId);

    if (!eventFound) {
      return res.status(404).json({
        ok: false,
        msg: `There is no event by id ${eventId}`
      });
    }

    if (eventFound.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You cannot update this record. Only the record creator can do it."
      });
    }

    const newEvent = { ...req.body, user: uid };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true
    });

    res.json({
      ok: true,
      event: updatedEvent
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error by updating an event. Please contact to the administrator"
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    const eventFound = await Event.findById(eventId);

    if (!eventFound) {
      return res.status(404).json({
        ok: false,
        msg: `There is no event by id ${eventId}`
      });
    }

    if (eventFound.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You cannot delete this record. Only the record creator can do it."
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.json({
      ok: true
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error by deleting an event. Please contact to the administrator"
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
