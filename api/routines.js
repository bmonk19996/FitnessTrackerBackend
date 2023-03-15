const express = require('express');
const { getAllPublicRoutines, createRoutine, updateRoutine } = require('../db');
const router = express.Router();
const { UnauthorizedError} = require("../errors");
// GET /api/routines
router.get('/', async (req, res, next) => {
    try
    {
        const result = await getAllPublicRoutines();
        res.send(result);
    }catch({name, message})
    {
        next({name, message});
    }
});
// POST /api/routines
router.post('/', async (req, res, next) => {
    const {isPublic, name, goal} = req.body;
    try
    {
        if(!req.user){
            console.log('hit')
            next({name:"UnauthorizedError", message:UnauthorizedError()});
            return;
        }
        const creatorId = req.user.id
        const result = await createRoutine({creatorId,isPublic, name, goal});
        res.send(result);
    }
    catch({name, message})
    {
        next({name, message});
    }
});
// PATCH /api/routines/:routineId
router.patch('/:routineId', async (req, res, next) => {
    const {routineId} = req.params;
    const {isPublic, name, goal} = req.body;
    const id = routineId;
    try
    {
        if(!req.user){
            console.log('hit')
            next({name:"UnauthorizedError", message:UnauthorizedError()});
            return;
        }
        const result = await updateRoutine({id, isPublic, name, goal});
        if(!result)
        {
            return;
        }
        res.send(result);
    }
    catch({name, message})
    {
        next({name, message})
    }
});
// DELETE /api/routines/:routineId
router.delete('/:routineId', async (req, res, next) => {

});
// POST /api/routines/:routineId/activities

router.post('/:routineId/activities', async (req, res, next) => {

});
module.exports = router;
