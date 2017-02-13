var express = require('express');
var router = express.Router();
var mongojs = require('mongojs')
var db = mongojs('mongodb://localhost:/tasks')

//Get all tasks
router.get('/tasks', function(req, res, send){
    db.tasks.find(function(err, tasks){
        if(err){
            res.send(err);
        }
        res.json(tasks);
    });
});

//Get single tasks
router.get('/tasks/:id', function(req, res, send){
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)},function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

//Save task
router.post('/task', function(req, res, next){
    var task = req.body;
    if(!task.title || !(task.isDone + '')){
        console.log(task);
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }else{
        db.tasks.save(task, function(err, task){
            if(err){
                res.send(err);
            }
            res.json(task);
        });
    }
});

//Delete task
router.delete('/task/:id', function(req, res, send){
    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)},function(err, task){
        if(err){
            res.send(err);
        }
        res.json(task);
    });
});

//Update task
router.put('/task/:id', function(req, res, send){
    var task = req.body;
    var updTask ={};

    if(task.isDone){
        updTask.isDone = task.isDone;
    }

    if(task.title){
        updTask.title = task.title;
    }
    if(!updTask){
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    }else{
        db.tasks.update({_id: mongojs.ObjectId(req.params.id)}, updTask, {},function(err, task){
            if(err){
                res.send(err);
            }
            res.json(task);
        });
    }
});
module.exports = router;