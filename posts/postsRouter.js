// import modules

const express = require('express');
const postsDb = require('../data/helpers/postDb.js');
const userDb = require('../data/helpers/userDb.js');
const router = express.Router();

//  custom middleware
function validateUser (req, res, next) { // <--- does user exist?
    const { userId } = req.body;

    userDb.get(userId)
        .then( user => {
            if(user){
                next();
            }
            else{
                res
                .status(404).json({errMsg: `User ID ${req.params.id} not found.`})
            }
        })
}

function validateBody (req, res, next) {
    const {userId, text} = req.body;


    if(userId){
        if(text){
            next();
        }
        else{
            res.status(400).json({message: 'Please provide text for post.'})
        }
    }
    else{
        res.status(400).json({message: 'Please provide a user ID.'})
    }
}

function validatePost (req, res, next) {
    const id = req.params.id;

    postsDb.get(id)
        .then(post => {
            next();
        })
        .catch(err=> {
            res.status(404).json({message: `Post ID: ${id} not found`, error: err}); 
        })
}

//routes / endpoints
router.get('/', (req, res) => {
    postsDb.get(req.body)
        .then(posts => {
            res.status(200).json({posts})
        })
        .catch(err => {
            res.status(500).json({error: 'Could not retrieve posts', error: err})
        });
});

router.get('/:id', (req, res) => {
    postsDb.get(req.params.id)
    .then(post => {
        res.status(200).json(post);
    })
    .catch(err => {
        res.status(404).json({message: `Post ID: ${req.params.id} not found.`, error: err});
    })
});

router.post('/', validateBody, validateUser, (req, res) => {
    postsDb.insert(req.body)
        .then(result => {
            res.status(201).json({message: `Successfully added post. New post id: ${result.id}`});
        })
        .catch(err => {
            res.status(500).json({message: 'Could not add post', error: err})
        })
});

router.put('/:id', validateBody, validateUser, validatePost, (req,res) => {
    postsDb.update(req.params.id,req.body)
        .then(count => {
            res.status(200).json({message: `Post ID:  ${req.params.id} successfully updated`})
        })
        .catch(err => {
            res.status(500).json({message: 'Could not update post', error: err});
        })
})

router.delete('/:id', validatePost, (req, res) => {
    postsDb.remove(req.params.id)
        .then(count => {
            res.status(200).json({message: `Post ID: ${req.params.id} successfully deleted`})
        })
        .catch(err => { 
            res.status(500).json({message: 'could not remove post', error: err});
        })
});

module.exports = router;
