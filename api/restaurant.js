const express = require('express');
const router = express.Router();
const qy = require('../db/dbConnection');

/**
 * Restaurant
 *
 * GET  /restaurant         obtener todos los restaurantes
 * GET  /restaurant/:id     obtener un restaurante
 * POST /restaurant         crear un restaurante
 * PUT  /restaurant/:id     modificar un restaurante
 *
 * Path -> /restaurant
 */

router.get('/', async(req, res) => {
    try {
        const query = 'SELECT * FROM restaurant;';
        const respuesta = await qy(query);
        res.send(respuesta);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ error: e.message });
    }
});

router.get('/:restaurant_id', async(req, res) => {
    try {
        const query = 'SELECT * FROM restaurant WHERE id = ?;';
        const respuesta = await qy(query, [req.params.restaurant_id]);
        if (respuesta.length > 0) {
            const restaurant = respuesta[0];
            res.send(restaurant);
        } else {
            console.error('Restaurant Not found');
            res.status(404).send({ error: 'Restaurant Not found' });
        }
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ error: e.message });
    }
});

router.post('/', async(req, res) => {
    try {
        const restName = req.body.name;
        validateNameExistenceCreate(req, res);
        const queryInsert = 'INSERT INTO restaurant(name) VALUES (?);';
        const insertResult = await qy(queryInsert, [restName]);
        const restaurantCreated = { id: insertResult.insertId, name: restName };
        res.send(restaurantCreated);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ error: e.message });
    }
});

router.put('/:restaurant_id', async(req, res) => {
    try {
        validateNameExistenceUpdate(req, res);
        const query = 'UPDATE restaurant SET name = ? where id = ?;';
        await qy(query, [req.body.name, req.params.restaurant_id]);
        const restaurantUpdated = {
            id: req.params.restaurant_id,
            name: req.body.name,
        };
        res.send(restaurantUpdated);
    } catch (e) {
        console.error(e.message);
        res.status(413).send({ error: e.message });
    }
});

const validateNameExistenceCreate = async(req, res) => {
    const restName = req.body.name;
    const querySelect = 'SELECT * FROM restaurant WHERE name = ?;';
    const respuesta = await qy(querySelect, [restName]);
    if (respuesta.length > 0) {
        console.error('Restaurant already exist');
        res.status(400).send({ error: 'Restaurant already exist.' });
    }
};

const validateNameExistenceUpdate = async(req, res) => {
    const restName = req.body.name;
    const querySelect = 'SELECT * FROM restaurant WHERE name = ? AND id != ?';
    const respuesta = await qy(querySelect, [restName, req.params.id]);
    if (respuesta.length > 0) {
        console.error('Restaurant already exist');
        res.status(400).send({ error: 'Restaurant already exist.' });
    }
};

module.exports = router;