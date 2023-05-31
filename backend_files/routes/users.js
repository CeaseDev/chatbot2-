var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const { async } = require("rxjs");
const User = require("../model/userSchema.model");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("userjs");
});

// FOR SSN CHECKING
router.post("/user-check", async (req, res) => {
  const socialSecurityNumber = req.body.socialSecurityNumber;
  const userExist = await User.findOne(
    {
      socialSecurityNumber,
    },
    (error, user) => {
      if (error) {
        return res.status(500).json({ error: "An error occurred" });
      }
      if (user) {
        return res.status(422).json({ error: "User Already Exists" });
      }
    }
  );
});

router.post("/add", async function (req, res, next) {
  const {
    firstName,
    lastName,
    email,
    mobile,
    communicationMedium,
    address,
    city,
    state,
    zipcode,
    dob,
    gender,
    socialSecurityNumber,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !mobile ||
    !communicationMedium ||
    !address ||
    !city ||
    !state ||
    !zipcode ||
    !dob ||
    !gender ||
    !socialSecurityNumber
  ) {
    return res.status(422).json({ error: "Please fill all the values" });
  }
  try {
    const userExist = await User.findOne({
      socialSecurityNumber: socialSecurityNumber,
    });

    if (userExist) {
      return res.status(422).json({ error: "User Already Exists" });
    } else {
      const user = new User({
        firstName,
        lastName,
        email,
        mobile,
        communicationMedium,
        address,
        city,
        state,
        zipcode,
        dob,
        gender,
        socialSecurityNumber,
      });

      await user.save();

      res.status(201).json({ message: "User registered succesufully" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
