import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = 4000;

const handleListening = console.log(
  `😀Server Listening at http://localhost:${PORT}!`
);

app.listen(PORT, handleListening);
