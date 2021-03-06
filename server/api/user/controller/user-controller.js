"use strict";

const UserDAO = require('../dao/user-dao');
const auth = require("../../../auth");

module.exports = class UserController {
  static getAll(req, res) {
    UserDAO
      .getAll()
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json(error));
  }
  
  static getAllOthers(req, res){
    UserDAO
      .getAllOthers(req.user)
      .then(users => res.status(200).json(users))
      .catch(error => res.status(400).json(error));
  }

  static get(req, res) {
    let _id = req.params.id;

    UserDAO
      .get(_id)
      .then(user => {
        res.status(200).json(user)
      })
      .catch(error => {
        res.status(400).json(error)
      });
  }

  static createUser(req, res) {
    let _user = req.body;

    UserDAO
      .createUser(_user)
      .then(user => {
        res.status(201).json({
            user: user,
            token: auth.generateToken(user._id.toString())
          });
      })
      .catch(error => {
        res.status(400).json(error)
      });
  }

  static loginUser(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    UserDAO
      .getByEmail( email )
      .then(user => {

        if(user == null){
          res.status(404).send("User not found");
          return;
        }

        user.verifyPassword(password, function (err, valid) {
          if (err) {
            throw err;
          }

          if (!valid) {
            res.status(401).json("unathorized")
          }

          res.status(200).json({
            user: user,
            token: auth.generateToken(user._id.toString())
          });
        });
      })
      .catch(error => {
        res.status(400).json(error);
      });
  }

  static deleteUser(req, res) {
    let _id = req.params.id;

    UserDAO
      .deleteUser(_id)
      .then(() => res.status(200).end())
      .catch(error => res.status(400).json(error));
  }
}
