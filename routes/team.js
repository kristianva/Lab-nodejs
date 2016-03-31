var express = require('express');
var router = express.Router();

/*Validates the valid verbs*/
router.all('/', function (req, res, next) {

    if (req.method == "GET") {
        next();// pass control to the next handler
    } else {
        res.status(405).send({ error: 'Invalid method' });
    }

});

router.all('/:teamMember', function (req, res, next) {

    if (req.method == "GET") {
        next();// pass control to the next handler
    } else {
        res.status(405).send({ error: 'Invalid method' });
    }

});


/* GET team memeber listing. */
router.get('/', function(req, res, next) {
    res.status('200').json(
        [{
            "id": 1,
            "name": "Marco Salazar"
        }, {
            "id": 2,
            "name": "Cristiam Vargas"
        }, {
            "id": 3,
            "name": "Juan Carlos Arce"
        }]


    );
});

/* GET User specific info */
router.get('/:teamMember', function(req, res, next) {

    var member = req.params.teamMember;

    if (member == 1) {
        res.status('200').json(
            {
                "id": member,
                "name": "Marco Salazar"
            }
        );
    } else if (member == 2) {
        res.status('200').json(
            {
                "id": member,
                "name": "Cristiam Vargas"
            }
        );
    } else if (member == 3) {
        res.status('200').json(
            {
                "id": member,
                "name": "Juan Carlos Arce"
            }
        );
    } else {
        res.status('404').json({
            "message": "Invalid user"
        });
    }

});

module.exports = router;