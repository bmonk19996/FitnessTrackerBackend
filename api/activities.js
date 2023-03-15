const express = require('express');
const router = express.Router();

const{getAllActivities, createActivity, updateActivity} = require("../db")
const{ActivityNotFoundError, ActivityExistsError} = require("../errors")

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res) => {

});
// GET /api/activities
router.get('/', async (req, res, next) => {
    try
    {
        const result = await getAllActivities();
    
        if(!result)
        {
            next({name:"GetActivitiesError", message:ActivityNotFoundError()})
        }
        res.send(result);
    }catch({name, message})
    {
        next({name, message});
    }
});
// POST /api/activities
router.post('/', async (req, res, next) => {
    const {name, description} = req.body;
    try
    {
        const result = await createActivity({name, description});
        if(!result)
        {
            next({name:"NewActivityError", message:ActivityExistsError(name)});
        }
        res.send(result);
    }
    catch({name, message})
    {
        next({name, message});
    }
});
// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res, next) => {
    const {activityId} = req.params;
    const {name, description} = req.body;
    console.log(activityId)
    try
    {
        const result = await updateActivity(activityId, {name, description});
        if(!result)
        {
            next({name:"PatchActivityError", message:ActivityNotFoundError(activityId)});
        }
        res.send(result);
    }
    catch({name, message})
    {
        next({name, message})
    }
});
module.exports = router;
