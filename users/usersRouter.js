// import modules

const express =require('express');
const userDb =require('../data/helpers/userDb.js');
const router = express.Router();

//custom middleware

function validateUser(req, res, next) {  //<--- does user exist?
    userDb.get(req.params.id)
        .then(user => {
            if(user) {
                next();
            } else {
                res
                    .status(404).json({errMsg: `User ID ${req.params.id} not found.`})
            }
        })
}

function upperCase(req, res, next) {  // <--- check: is the first letter uppercase per user acceptance criteria?
    let name = req.body.name;
    if (name) {
        req.body.name = name.toLowerCase().split(' ').map(str => str.charAt(0).toUppperCase() + str.substring(1)).join(' ');
        next();
    } else {
        res
            .status(400).json({errMsg: 'Please provide a name for the user.'})
    }
}

// routes and  GET end points

router.get('/', (req, res) => {
    userDb.get(req.body)
        .then(users => {
            res.status(200).json({users})
        })
        .catch(err => {
            res.status(500).json({error: 'Could not retrieve users.', error: err})
        });
});

//routes and GET by ID end point

router.get('/:id', (req,res) => {
    userDb.get(req.params.id)
    .then(user => {
        if(user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({message: `User ID ${req.params.id} not found.`})
        }
    })
    .catch (err => {
        res.status(500).json({message: 'Could not retrieve user', error: err});
    })
});

// validate user middleware implementation and end point

router.get('/:id/posts', validateUser, (req, res) => {
    userDb.getUserPosts(req.params.id)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({message: `Error retrieving posts of user ${req.params.id}`, error:err})
        })
    })

//  POST end point and implement uppercase check middleware

router.post('/', upperCase, (req, res ) => {
    userDb.insert(req.body)
        .then (result => {
            res.status(201).json({message: `Successfully added user. New user id: ${result.id}`});
        })
        .catch(err => {
            res.status(500).json({message: 'Could not add user', error: err})
        })

    });

router.put('/:id', upperCase, validateUser, (req, res) => { 
    userDb.update(req.params.id, req.body)
        .then(count => {
            res.status(200).json({message: `User Id ${req.params.id} successfully updated`})
        })
        .catch(err => {
            res.status(500).json({message: 'Could not update user', error: err});
        })
})
 
// DELETE routes end points

router.delete('/:id', validateUser, (req, res) => {
    userDb.remove(req.params.id)
        .then(count => {
            res.status(200).json({message: `User ID ${req.params.id} successfully deleted.`})
        })
        .catch(err => {
            res.status(500).json({message: 'Could not delete user', error: err});
        })
});

// don't forget to export modules

module.exports = router;
