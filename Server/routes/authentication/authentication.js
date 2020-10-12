const express = require('express');
const router = express.Router();
const Users = require('../../models/users.model');
const md5 = require('md5');
const { SendResponse,GenerateAuthToken } = require('../../util/utility')

router.post('/', async (req, res) => {
//console.log(req.body,md5(req.body.password))
  let user = await Users.findOne({
    userName: req.body.userName,
    password: md5(req.body.password)
  });
console
.log(user)

  if (user) {
    if (!user.isActive)
      return SendResponse(req, res, "The user account is inactive", false, 200);
    else {
      const token = GenerateAuthToken(user);
      //console.log('token',token); 
      return SendResponse(req, res, { token: token });
    }
  } else
    return SendResponse(req, res, "User not found", false, 401);
});

// router.post('/login/verification', auth, async (req, res) => {
//   let token = req.body.token;
//   if (token) {
//     const verify = jwt.verify(token, jwtSecret);
//     SendResponse(req, res, { verify });
//   }
// });

// router.put('/changePassword/:id',
//   async (req, res) => {
//     let doc = await User.findOne({
//       _id: req.body._id,
//       isDeleted: false
//     }).populate('accessLevel');
//     await Log({ root: 'User.js', message: { title: `Password Changed for ${req.body._id}` } })

//     if (doc.password !== md5(req.body.oldPassword).toUpperCase()) {
//       SendResponse(req, res, { error: 'رمز عبور فعلی صحیح نمیباشد' }, false)
//     } else {
//       doc.password = md5(req.body.password).toUpperCase()
//       await doc.save();

//       const token = jwt.sign({
//         id: doc._id,
//         lastName: doc.lastName,
//         firstName: doc.firstName,
//         accessLevel: doc.accessLevel,
//         contactInfo: doc.contactInfo
//       }, jwtSecret, { expiresIn: '30s' });
//       SendResponse(req, res, { token: AES.encrypt(token, tokenHashKey).toString() });
//     }
//   })

module.exports = router;
