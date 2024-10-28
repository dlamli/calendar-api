const { request, response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req = request, res = response) => {
  try {
    const events = await Event.find().populate("user", "name");

    return res.status(200).json({
      ok: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contact with the administrator.",
    });
  }
};

const createEvent = async (req = request, res = response) => {
  try {
    const event = new Event(req.body);

    event.user = req.id;
    const eventSaved = await event.save();

    return res.status(201).json({
      ok: true,
      event: eventSaved,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contact with the administrator.",
    });
  }
};

const updateEvent = async (req = request, res = response) => {
  const eventId = req.params.eventId;
  const id = req.id;

  try {
    const event = await Event.findById(eventId);

    if (!event)
      return res.status(404).json({
        ok: false,
        msg: "Event not found with this ID",
      });

    if (event.user.toString() !== id)
      return res.status(401).json({
        ok: false,
        msg: "No authorized to edit this event.",
      });

    const newEvent = {
      ...req.body,
      user: id,
    };

    const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent);

    return res.status(200).json({
      ok: true,
      event: eventUpdated,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contact with the administrator.",
    });
  }
};

const deleteEvent = async (req = request, res = response) => {
  const eventId = req.params.eventId;
  const id = req.id;

  try {
    const event = await Event.findById(eventId);

    if (!event)
      return res.status(404).json({
        ok: false,
        msg: "Event not found with this ID",
      });

    if (event.user.toString() !== id)
      return res.status(401).json({
        ok: false,
        msg: "No authorized to edit this event.",
      });

    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contact with the administrator.",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
