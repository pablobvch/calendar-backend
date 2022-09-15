/*
Events routes
host + /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/events");
const { isDate } = require("../helper/isDate");
const { validateFields } = require("../middlewares/validateFields");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();
router.use(validateJWT);

router.get("/", getEvents);
router.post(
  "/",
  [
    check("title", "The title must be mandatory").not().isEmpty(),
    check("start", "The start date must be mandatory").custom(isDate),
    check("end", "The end date must be mandatory").custom(isDate),
    validateFields
  ],
  createEvent
);
router.put(
  "/:id",
  [
    check("title", "The title must be mandatory").not().isEmpty(),
    check("start", "The start date must be mandatory").custom(isDate),
    check("end", "The end date must be mandatory").custom(isDate),
    validateFields
  ],
  updateEvent
);
router.delete("/:id", deleteEvent);

module.exports = router;
