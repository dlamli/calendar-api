const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    //Inicialize
    this.app = express();
    this.port = process.env.PORT;
    //Routes path
    this.authPath = "/api/auth";
    this.eventPath = "/api/event";
    //Connect to DB
    this.connectDB();
    //Middlewares
    this.middlewares();
    //App routes
    this.routes();
  }

  middlewares() {
    //Public directory
    this.app.use(express.static("public"));
    //Lecture and parse Body
    this.app.use(express.json());
    //CORS
    this.app.use(cors());
  }

  connectDB() {
    dbConnection();
  }

  routes() {
    this.app.use(this.authPath, require("../routes/auth.routes"));
    this.app.use(this.eventPath, require("../routes/events.routes"));
  }

  init() {
    this.app.listen(this.port, () => {
      console.log(`Listening server at http://localhost:${this.port}`);
    });
  }
}

module.exports = Server;
