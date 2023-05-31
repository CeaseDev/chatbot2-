var mongoose = require("mongoose");
const dtbse = process.env.DATABASE;
mongoose
  .connect(dtbse)
  .then(() => {
    console.log("connection succesful http://localhost:5000/");
  })
  .catch((err) => console.log("no connection"));
