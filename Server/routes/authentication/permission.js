const express = require('express');
const md5 = require('md5');
const router = express.Router();
const permission = require('../../models/permissions.model')
const { GetAll, Insert, Update, GetOne, Delete, HardDelete } = require('../../util/genericMethods');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

router.route('/')
    .get([auth, admin], async (req, res) => {
        console.log('permission List', req.body);
        try {
            await GetAll(permission, req, res)
        }
        catch (error) {
            console.log(error)
        }
    })
// .post([auth, admin],async (req, res) => {
//     if (req.body.option)
//         await GetAll(userType, req, res, req.body.option)
//     else
//         await Insert(userType, req, res);
// })
// .put([auth, admin],async (req, res) => { await Update(userType, req, res) })

router.route('/:id')
    .get([auth, admin], async (req, res) => {
        await GetOne(permission, req, res)
    })
// .put([auth, admin],async (req, res) => { await Update(userType, req, res) })
// .get([auth, admin],async (req, res) => { await GetOne(userType, req, res) })
// .delete([auth, admin],async (req, res) => {
//     req.body._id = req.params.id;
//     await HardDelete(userType, req, res)
// })

module.exports = router;
