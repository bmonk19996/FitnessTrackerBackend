const express = require('express');
const { getRoutineById, updateRoutineActivity, getRoutineActivityById, destroyRoutineActivity} = require('../db');
const { UserDoesNotExistError, UnauthorizedError, UnauthorizedUpdateError, UnauthorizedDeleteError } = require('../errors');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', async (req, res, next) => {
    const {routineActivityId:id} = req.params;
    try
    {
        if(!req.user)
        {
         return next({name:"RoutineActivityError", message:UnauthorizedError()})
        }
        const routineActivity = await getRoutineActivityById(id);
        const routine = await getRoutineById(routineActivity.routineId);
        if(routine.creatorId !== req.user.id)
        {
            return next({name:"RoutineActivityError", message:UnauthorizedUpdateError(req.user.username, routine.name)});
        }
        const result = await updateRoutineActivity({id, ...req.body});
       res.send(result);
    }
    catch({name, message})
    {
        next({name, message});
    }
});
// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', async (req, res, next) => {
    const {routineActivityId:id} = req.params;
    try
    {
        const routineActivity = await getRoutineActivityById(id);
        const routine = await getRoutineById(routineActivity.routineId);
        if(routine.creatorId !== req.user.id)
        {
            res.status(403);
            return next({name:"RoutineActivityError", message:UnauthorizedDeleteError(req.user.username, routine.name)});
        }
        const result = await destroyRoutineActivity(id);
        res.send(result);
    }
    catch({name, message})
    {
        next({name, message})
    }
});
module.exports = router;
