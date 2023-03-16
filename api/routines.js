const express = require("express");
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
} = require("../db");
const router = express.Router();
const { UnauthorizedError, UnauthorizedUpdateError } = require("../errors");
// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const result = await getAllPublicRoutines();
    res.send(result);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/routines
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      next({ name: "UnauthorizedError", message: UnauthorizedError() });
      return;
    }
    const creatorId = req.user.id;
    const result = await createRoutine({ creatorId, ...req.body });
    res.send(result);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// PATCH /api/routines/:routineId
router.patch("/:routineId", async (req, res, next) => {
  const { routineId } = req.params;
  const id = routineId;
  try {
    if (!req.user) {
      next({ name: "UnauthorizedError", message: UnauthorizedError() });
      return;
    }
    const routine = await getRoutineById(id);
    if (routine.creatorId !== req.user.id) {
      res.status(403);
      next({
        name: "UnauthorizedError",
        message: UnauthorizedUpdateError(req.user.username, routine.name),
      });
      return;
    }
    const result = await updateRoutine({ id, ...req.body });
    if (!result) {
      return;
    }
    res.send(result);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// DELETE /api/routines/:routineId
router.delete("/:routineId", async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const id = routineId;
    const routine = await getRoutineById(id);
    if (routine.creatorId !== req.user.id) {
      res.status(403);
      next({
        name: "UnauthorizedError",
        message: UnauthorizedUpdateError(req.user.username, routine.name),
      });
      return;
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/routines/:routineId/activities

router.post("/:routineId/activities", async (req, res, next) => {});
module.exports = router;
