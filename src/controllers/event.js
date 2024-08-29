const Event = require("../models/event");
const createError = require("http-errors");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

// Controller to create a new event
const createEvent = async (req, res) => {
  try {
    const { name, description, date, location, ticketsAvailable } = req.body;

    const newEvent = new Event({
      name,
      description,
      date,
      location,
      ticketsAvailable,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to get all upcoming events
const getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();
    const events = await Event.find({ date: { $gte: today } }).sort("date");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to book a ticket for an event
const bookTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.payload.aud;

    const event = await Event.findById(eventId);

    if (!event) throw createError.NotFound("Event not found");

    if (event.ticketsAvailable <= 0)
      throw createError.BadRequest("No tickets available");

    // Create a new ticket
    const ticket = {
      userId,
      ticketNumber: uuidv4(),
    };

    event.tickets.push(ticket);
    event.ticketsAvailable -= 1;

    const qrCodeContent = JSON.stringify({
      userId: ticket.userId,
      ticketNumber: ticket.ticketNumber,
    });

    // Generate QR code URL
    const qrCodeUrl = await QRCode.toDataURL(qrCodeContent);

    // Ideally, store the QR code in the ticket, not the event
    ticket.qrCodeUrl = qrCodeUrl;

    await event.save();

    res.status(200).json({
      message: "Ticket booked successfully",
      ticket: {
        userId: ticket.userId,
        ticketNumber: ticket.ticketNumber,
        qrCodeUrl: ticket.qrCodeUrl,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
module.exports = { createEvent, getUpcomingEvents, bookTicket };
