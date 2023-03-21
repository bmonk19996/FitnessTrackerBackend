const express = require("express");
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  getRoutineById,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
} = require("../db");
const router = express.Router();
const {
  UnauthorizedError,
  UnauthorizedUpdateError,
  UnauthorizedDeleteError,
  DuplicateRoutineActivityError,
} = require("../errors");
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
      return next({ name: "UnauthorizedError", message: UnauthorizedError() });
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
      return next({ name: "UnauthorizedError", message: UnauthorizedError() });
    }
    const routine = await getRoutineById(id);
    if(!routine){
      res.status(403)
      return next({
        name: "Routine not Found Error",
        message: `Routine number ${routineId} does not exist`,
      });
    }
    if (routine.creatorId !== req.user.id) {
      res.status(403);
      return next({
        name: "UnauthorizedError",
        message: UnauthorizedUpdateError(req.user.username, routine.name),
      });
    }
    const result = await updateRoutine({ id, ...req.body });
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

    if (!req.user) {
      return next({ name: "UnauthorizedError", message: UnauthorizedError() });
    }
    if (routine.creatorId !== req.user.id) {
      res.status(403);
      return next({
        name: "UnauthorizedError",
        message: UnauthorizedDeleteError(req.user.username, routine.name),
      });
    }
    const result = await destroyRoutine(id);
    res.send(result);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
  try {
    const id = req.body.routineId
    const routineActivities = await getRoutineActivitiesByRoutine({id})
    for(let i = 0; i < routineActivities.length; i++){
        if(routineActivities[i].activityId === req.body.activityId){
            return next({
                name: "UnauthorizedError",
                message: DuplicateRoutineActivityError( req.body.routineId,req.body.activityId),
              });
        }
    }

    const result = await addActivityToRoutine({...req.body});
    res.send(result);


  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
