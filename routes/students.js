var express = require('express');
var router = express.Router();
var storage = require('node-persist');
var Validator = require('jsonschema').Validator;
var formatValidator = new Validator();

storage.initSync();

// Student schema
var studentSchema = {
    "type": "object",
    "properties": {
        "id": {"type": "string", "required": false},
        "name": {"type": "string"},
        "address": {"type": "string"},
        "email": {"type": "string"}
    }
};

/*Validates the valid verbs*/
router.all('/', function (req, res, next) {
    if (req.method == "GET" || req.method == "POST") {
        next();// pass control to the next handler
    } else {
        res.status(405).send({ error: 'Invalid method' });
    }
});

router.all('/:studentId', function (req, res, next) {
    if (req.method == "PUT" || req.method == "PATCH" || req.method == "DELETE") {
        next();// pass control to the next handler
    } else {
        res.status(405).send({ error: 'Invalid method' });
    }
});

/* GET students listing. */
router.get('/', function(req, res) {
    var students = storage.getItem('students');
    if(students){
        res.status(200).json(students);
    }
    else{
        res.status(200).json({});
    }
});

/* POST create student object. */
router.post('/', function(req, res) {

    var student = req.body.student;

    if(student) {
        var isValidFormat = formatValidator.validate(student, studentSchema);

        if(isValidFormat) {

            var students = storage.getItem('students') ;
            if(!students) {
                students = [];
            }

            var exists = false;

            for(var i = 0; i < students.length; i++)
            {
                if(students[i].name == student.name)
                {
                    exists = true;
                    break;
                }
            }

            if(!exists) {
                student.id = (students.length + 1).toString();
                students.push(student);
                storage.setItem('students', students);

                res.status(201).json({status: 'Student created!', student : student});
            }
            else{
                res.status(400).json({status: 'Student already exists.'});
            }
        }
        else{
            res.status(400).json({status: 'Payload request has bad format or missing attributes.' });
        }
    }
    else{
        res.status(400).json({status: 'Payload request is missing.'});
    }
});

/* PUT update student info. */
router.put('/:studentId', function(req, res) {
    var student = req.body.student;

    if(student) {

        var isValidFormat = formatValidator.validate(student, studentSchema);

        if(isValidFormat) {

            var students = storage.getItem('students');

            if(students){
                var updated = false;
                var studentId = req.params.studentId;

                for(var i = 0; i < students.length; i++)
                {
                    if(students[i].id == studentId)
                    {
                        student.id = studentId;
                        students[i] = student;
                        updated = true;
                        break;
                    }
                }
                if(updated){
                    storage.setItem('students', students);
                    res.status(201).json({status: 'Student updated!', student : student});
                }
                else{
                    res.status(404).json({status: 'Student not found.'});
                }
            }
            else{
                res.status(404).json({status: 'There is no students data for update.'});
            }
        }
        else{
            res.status(400).json({status: 'Payload request has bad format or missing attributes.'});
        }
    }
    else{
        res.status(400).json({status: 'Payload request is missing.'});
    }
});

/* PATCH partial update student info. */
router.patch('/:studentId', function(req, res) {
    var student = req.body.student;

    if(student) {

        var isValidFormat = formatValidator.validate(student, studentSchema);

        if(isValidFormat) {

            var students = storage.getItem('students');

            if(students){

                var studentId = req.params.studentId;
                var updated = false;
                for(var i = 0; i < students.length; i++)
                {
                    if(students[i].id == studentId)
                    {
                        var partialStudent = students[i];
                        if(student.name){
                            partialStudent.name = student.name;
                        }
                        if(student.address){
                            partialStudent.address = student.address;
                        }
                        if(student.email){
                            partialStudent.email = student.email;
                        }
                        students[i] = partialStudent;
                        updated = true;
                        break;
                    }
                }
                if(updated){
                    storage.setItem('students', students);
                    res.status(201).json({status: 'Student updated!'});
                }
                else{
                    res.status(404).json({status: 'Student not found.'});
                }
            }
            else{
                res.status(404).json({status: 'There is no students data for update.'});
            }
        }
        else{
            res.status(400).json({status: 'Payload request has bad format or missing attributes.'});
        }
    }
    else{
        res.status(400).json({status: 'Payload request is missing.'});
    }
});

/* DELETE deletes student object. */
router.delete('/:studentId', function(req, res) {

    var studentId = req.params.studentId;
    var students = storage.getItem('students');

    if(students) {
        var deleted = false;

        for (var i = 0; i < students.length; i++) {
            if (students[i].id == studentId) {
                students.splice(i, 1);

                 var notes = storage.getItem('notes'); 
                 if(notes){
                    for(var j in notes){
                        if(notes[j].studentId === studentId){
                            notes.splice(j, 1);
                            storage.setItem('notes', notes);
                            break;
                        }
                    }
                 }

                deleted = true;
                break;
            }
        }
        if(deleted){
            storage.setItem('students', students);
            res.status(201).json({status: 'Student deleted!'});
        }
        else{
            res.status(404).json({status: 'Student id not found.'});
        }
    }
    else{
        res.status(404).json({status: 'There is no students data.'});
    }
});

module.exports = router;
