const express = require('express');
const md5 = require('md5');
const router = express.Router();
const Users = require('../../models/users.model');
const { GetAll, Insert, Update, GetOne, Delete, } = require('../../util/genericMethods');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

router.route('/')
  .get(async (req, res) => {
    console.log('user', req.body)
    await GetAll(Users, req, res)
  })
  .post(async (req, res) => {
    if (req.body.option)
      await GetAll(Users, req, res, req.body.option)

    else {
      req.body.password = md5(req.body.password).toUpperCase();
      await Insert(Users, req, res);
    }
  })
  .put(async (req, res) => { await Update(Users, req, res) })

router.route('/:id')
  .get([auth, admin], async (req, res) => {
    await GetOne(Users, req, res)
  })
  .put([auth, admin], async (req, res) => { await Update(Users, req, res) })
  .get([auth, admin], async (req, res) => { await GetOne(Users, req, res) })
  .delete([auth, admin], async (req, res) => {
    req.body._id = req.params.id;
    await Delete(Users, req, res)
  })

module.exports = router;
