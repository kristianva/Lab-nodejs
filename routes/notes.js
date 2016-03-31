var express = require('express');
var storage = require('node-persist');
var router = express.Router();

storage.initSync();

/*Validates the valid verbs*/
router.all('/', function (req, res, next) {
    if (req.method == "GET") {
        next();// pass control to the next handler
    } else {
        res.status(405).send({ error: 'Invalid method' });
    }
});

router.all('/:id', function (req, res, next) {
    if (req.method == "GET" || req.method == "POST"||
        req.method == "PUT" || req.method == "PATCH") {
        next();// pass control to the next handler
    } else {
        res.status(405).send({ error: 'Invalid method' });
    }
});

/* GET notes listing */
router.get('/', function(req, res) {
    if (storage.getItem('notes')) {
        res.status('200').json(storage.getItem('notes'));
    }else{
        res.status('200').json({});
    }
});

/* GET note for a specific student */
router.get('/:id', function(req, res) {
    if (storage.getItem('notes')) {
        var notes = storage.getItem('notes');
        var studentIdParam = req.params.id;
        var note = notes.find(function(element) {
            return element.studentId === studentIdParam;
        });

        if(!note){
            res.status('404').json({status: "Note not found"});
        }else{
            res.status('200').json(note);
        }
    }else{
        res.status('404').json({status: "Note not found"});
    }
});

/* POST new note for student */
router.post('/:id', function(req, res) {

    if(storage.getItem('students')){

        var students = storage.getItem('students');
        var studentIdParam = req.params.id;
        var student = students.find(function(element) {
            return element.id === studentIdParam;
        });

        var createNewNote = false;
        var studentNote = req.body.note;

        if(studentNote == undefined){
            res.status('400').json({status: "Note value is necessary"});
        }else{

            if(!student){
                res.status('404').json({status: "Student not found"});
            }else{
                var notes = storage.getItem('notes');
                if(!notes){
                    notes = [];
                    createNewNote = true;
                }else{
                    var studentWithNote = notes.find(function(element) {
                        return element.studentId === studentIdParam;
                    });
                    if(!studentWithNote){
                        createNewNote = true;
                    }else{
                        res.status('400').json({status: "Student already has a note"});
                    }
                }

                if(createNewNote){                
                    if(isNaN(studentNote)){
                        res.status('400').json({status: "Note must be a number"});
                    }else{
                        var newNote = {
                            'studentId' : studentIdParam,
                            'note' : studentNote
                        };
                        notes.push(newNote);
                        storage.setItem('notes',notes);
                        createNewNote = false;
                        res.status('201').json({status: "Note Created"});
                    }
                }
            }         

        }

        
    }else{
        res.status('404').json({status: "Student not found"});
    }
});

/* PUT a note for student */
router.put('/:id', function(req, res) {
    processPutOrPathRequest(req, res);
});

/* PATCH a note for student */
router.patch('/:id', function(req, res) {
    processPutOrPathRequest(req, res);
});

/* Function to process put or path */
function processPutOrPathRequest(req, res){

    if(storage.getItem('students')){
        var students = storage.getItem('students');
        var studentIdParam = req.params.id;
        var student = students.find(function(element) {
            return element.id === studentIdParam;
        });

        if(!student){
            res.status('404').json({status: "Student not found"});
        }else{
            var notes = storage.getItem('notes');
            if(!notes){
                res.status('404').json({status: "Notes not found"});
            }else{
                var studentNote = req.body.note;
                var updated = false;
                var formatError = false;

                if(studentNote == undefined){
                    res.status('400').json({status: "Note value is necessary"});
                }else{    

                    if(isNaN(studentNote)){
                        formatError = true;
                    }else{
                        for(var i in notes){
                            if(notes[i].studentId === studentIdParam){
                                notes[i].note = studentNote;
                                storage.setItem('notes',notes);
                                updated = true;
                                break;
                            }
                        }
                    }

                    if(updated){
                        res.status('201').json({status: "Note Updated"});
                    }else{
                        if(formatError){
                            res.status('400').json({status: "Note must be a number"});
                        }else{
                            res.status('404').json({status: "Note not found"});
                        }

                    }
                }
            }
        }
    }else{
        res.status('404').json({status: "Student not found"});
    }
}

module.exports = router;
