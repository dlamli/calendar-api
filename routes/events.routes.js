const { Router } = require("express");
const { check } = require("express-validator");

const { validateField } = require("../middlewares/field-validator");
const { validateJWT } = require("../middlewares/jwt-validator");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");
const { validateDate } = require("../helpers/date");

const router = Router();

router.use(validateJWT);

//GET
router.get("/", getEvents);

//POST
router.post(
  "/",
  [
    check("title", "Title is required").not().isEmpty(),
    check("start", "Start Date is required").custom(validateDate),
    check("end", "End Date is required").custom(validateDate),
    validateField,
  ],
  createEvent
);

//PUT
router.put(
  "/:eventId",
  [
    check("title", "Title is required").not().isEmpty(),
    check("start", "Start Date is required").custom(validateDate),
    check("end", "End Date is required").custom(validateDate),
    validateField,
  ],
  updateEvent
);

//DELETE
router.delete("/:eventId", deleteEvent);

module.exports = router;
