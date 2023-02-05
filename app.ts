import express from 'express';
import Routes from "./routes/Routes";
import bodyParser = require("body-parser");
import { PORT } from './constants';
import cors from "cors"
const app = express();
app.use (cors())
app.use(bodyParser.json());
//support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
// for routing the http request to controller
Routes(app);

app.listen(PORT, () => {
  console.info(`Express server listening on http://localhost:${PORT}`);
});