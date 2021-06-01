const express = require('express');
const router = express.Router();
const qy = require('../db/dbConnection');

/**
 * Review
 *
 * GET  /review         obtener todos los reviews
 * GET  /review/:id     obtener review
 * POST /restaurant     crear review
 *
 * Path -> /review
 */

router.get('/', async(req, res) => {
    try {
        const query =
            'SELECT rw.id as review_id, rw.user_name as username, rw.value, rw.description, rt.id as restaurant_id, rt.name as restaurant_name ' +
            'FROM review rw ' +
            'INNER JOIN restaurant rt ON rt.id = rw.restaurant_id; ';
        const respuesta = await qy(query);
        const reviews = respuesta.map((r) => reviewMapper(r));
        res.send(reviews);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ error: e.message });
    }
});

router.get('/:review_id', async(req, res) => {
    try {
        const query =
            'SELECT rw.id as review_id, rw.user_name as username, rw.value, rw.description, rt.id as restaurant_id, rt.name as restaurant_name ' +
            'FROM review rw INNER JOIN restaurant rt ON rt.id = rw.restaurant_id WHERE rw.id = ?; ';
        const respuesta = await qy(query, [req.params.review_id]);
        if (respuesta.length > 0) {
            const reviewResult = respuesta[0];
            res.send(reviewMapper(reviewResult));
        } else {
            console.error('Review Not found');
            res.status(404).send({ error: 'Review Not found' });
        }
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ error: e.message });
    }
});

const reviewMapper = (reviewResult) => {
    return {
        id: reviewResult.review_id,
        value: reviewResult.value,
        username: reviewResult.username,
        description: reviewResult.description,
        restaurant: {
            id: reviewResult.restaurant_id,
            name: reviewResult.restaurant_name,
        },
    };
};

router.post('/', async(req, res) => {
    try {
        const { user_name, value, description, restaurant_name } = req.body;
        const idRestaurant = await validateRestaurantNameExistenceAndCreate(
            restaurant_name
        );
        const queryInsert =
            'INSERT INTO review(user_name,value,description,restaurant_id) VALUES(?,?,?,?);';
        const rewInsert = await qy(queryInsert, [
            user_name,
            value,
            description,
            idRestaurant,
        ]);
        const restaurantCreated = {
            id: rewInsert.insertId,
            value,
            description,
            restaurant: {
                id: idRestaurant,
                name: restaurant_name,
            },
        };
        res.redirect('/success');
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ error: e.message });
    }
});

const validateRestaurantNameExistenceAndCreate = async(restName) => {
    const querySelect = 'SELECT * FROM restaurant WHERE name = ?;';
    const respuesta = await qy(querySelect, [restName]);
    if (respuesta.length > 0) {
        console.log('Restaurant already exist', respuesta);
        return respuesta[0].id;
    } else {
        const queryInsert = 'INSERT INTO restaurant(name) VALUES(?);';
        const restult = await qy(queryInsert, [restName]);
        console.log('Restaurant inserted', restult);
        return restult.insertId;
    }
};

module.exports = router;