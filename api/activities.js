const express = require("express");
const router = express.Router();

const {
  getAllActivities,
  createActivity,
  updateActivity,
  getActivityByName,
  getPublicRoutinesByActivity,
  getRoutineActivitiesByRoutine,
  getActivityById,
} = require("../db");
const { ActivityNotFoundError, ActivityExistsError } = require("../errors");

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  const { activityId: id } = req.params;
  try {
    if (!(await getActivityById(id))) {
      next({
        name: "GetPublicRoutinesError",
        message: ActivityNotFoundError(id),
      });
      return;
    }
    const result = await getPublicRoutinesByActivity({ id });
    if (!result) {
      next({
        name: "GetPublicRoutinesError",
        message: ActivityNotFoundError(id),
      });
      return;
    }
    res.send(result);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const result = await getAllActivities();

    if (!result) {
      next({ name: "GetActivitiesError", message: ActivityNotFoundError() });
    }
    res.send(result);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/activities
router.post("/", async (req, res, next) => {
  const { name } = req.body;
  try {
    const result = await createActivity({ ...req.body });
    if (!result) {
      next({ name: "NewActivityError", message: ActivityExistsError(name) });
      return;
    }
    res.send(result);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// PATCH /api/activities/:activityId
router.patch("/:activityId", async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;
  const id = activityId;
  try {
    if (await getActivityByName(name)) {
      next({ name: "PatchActivityError", message: ActivityExistsError(name) });
    }
    const result = await updateActivity({ id, ...req.body });
    if (!result) {
      next({
        name: "PatchActivityError",
        message: ActivityNotFoundError(activityId),
      });
      return;
    }
    res.send(result);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = router;
