import express from "express";
import Routes from "./routes/Routes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { PORT } from "./constants";
import cors from "cors";
import { AppDataSource } from "./connection/data-source";
const app = express();
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.use(cors());
    app.use(bodyParser.json());
    //support application/x-www-form-urlencoded post data
    app.use(bodyParser.urlencoded({ extended: false }));
    // for routing the http request to controller
    Routes(app);
    app.use(cookieParser());

    app.listen(PORT, () => {
      console.info(`Express server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
