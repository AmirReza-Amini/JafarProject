const express = require('express');
const md5 = require('md5');
const router = express.Router();
const Users = require('../../models/users.model');
const { GetAll, Insert, Update, GetOne, HardDelete } = require('../../util/genericMethods');
const auth = require('../../middleware/auth');
const adminOrSuperuser = require('../../middleware/adminOrSuperuser');

router.route('/')
  .get(async (req, res) => {
    //console.log('user', req.body)
    let options = { condition: { userType: { $ne: 'Superuser' } } }
    await GetAll(Users, req, res, options)
  })
  .post(async (req, res) => {
    if (req.body.option)
      await GetAll(Users, req, res, req.body.option)

    else {
      req.body.password = md5(req.body.password).toUpperCase();
      await Insert(Users, req, res);
    }
  })
  .put([auth, adminOrSuperuser],async (req, res) => { await Update(Users, req, res) })

router.route('/:id')
  .get([auth, adminOrSuperuser], async (req, res) => {
    await GetOne(Users, req, res)
  })
  .put([auth, adminOrSuperuser], async (req, res) => { 
    console.log('reqqqqq123456789',req.user)
    await Update(Users, req, res) 
  })
  .get([auth, adminOrSuperuser], async (req, res) => { await GetOne(Users, req, res) })
  .delete([auth, adminOrSuperuser], async (req, res) => {
    req.body._id = req.params.id;
    await HardDelete(Users, req, res)
  })

module.exports = router;
