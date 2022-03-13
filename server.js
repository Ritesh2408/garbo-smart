const express = require("express");
const body_parser = require("body-parser");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const url_parser = body_parser.urlencoded({ extended: false });
app.set("view engine", "ejs");
app.use(express.static("welcomepage"));
const URI = process.env.Mongo_URI;
mongoose.connect(
  "mongodb+srv://sneha123:sneha123@cluster0.givdm.mongodb.net/credentials?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected");
});
const formschema = {
  GarbageId: String,
  Latitude: Number,
  Longitude: Number,
  Amount: Number,
};
const Note = mongoose.model("note", formschema);

app.get("/open", (req, res) => {
  res.render("signup");
});
app.get("/map", (req, res) => {
  res.sendFile(__dirname + "/welcomePage/indexmap.html");
});
app.get("/thankyou", (req, res) => {
  res.sendFile(__dirname + "/WelcomePage/indexty.html");
});
app.get("/view", (req, res) => {
  Note.find({}, (err, docs) => {
    if (err) res.json(err);
    else {
      console.log(docs);
      /*res.render("index", { notes: docs });*/
      res.send(docs);
    }
  });
});
app.post(
  "/open",
  url_parser,
  [
    check("id", "garbage id must be numeric data only").exists(),
    check("lat", "latitude must be numeric").isNumeric(),
    check("long", "Longitude must be numeric").isNumeric(),
    check("amount", "Amount must be a valid percentage").isFloat({
      min: 0,
      max: 100,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("signup", { alert });
    } else {
      const { id } = req.body;
      Note.findOne({ GarbageId: id }, (err, data) => {
        if (data) {
          Note.findOneAndUpdate(
            { GarbageId: req.body.id },
            {
              $set: {
                GarbageId: req.body.id,
                Latitude: req.body.lat,
                Longitude: req.body.long,
                Amount: req.body.amount,
              },
            },
            { new: true },
            (err, doc) => {
              if (err) {
                console.log("Something wrong when updating data!");
              }
              console.log("documant");
              console.log(doc);
              doc.save();

              res.send(
                '<script type="text/javascript"> alert("Record updated Successfully");window.location.href="http://localhost:5001/thankyou"; </script>'
              );
            }
          );
        } else {
          const newNote = new Note({
            GarbageId: req.body.id,
            Latitude: req.body.lat,
            Longitude: req.body.long,
            Amount: req.body.amount,
          });

          newNote.save((err) => {
            if (err) {
              res.send(err);
            } else {
              res.send(
                '<script type="text/javascript"> alert("Data Added Successfully");window.location.href="http://localhost:5001/thankyou"; </script>'
              );
            }
          });
        }
      });
    }
  }
);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
