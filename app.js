const express = require("express");
const path = require("path");
const logger = require("morgan");
const upload = require("express-fileupload");

const app = express();

require("dotenv").config();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  upload({
    useTempFiles: true
  })
);

app.use(express.static(path.join(__dirname, "public")));

const allowCrossDomain = (req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, x-access-token"
  );

  const allowOrigins = ["http://localhost:3000"];

  const origin = req.headers.origin;

    console.log(origin);
    

  if (allowOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  next();
};

app.use(allowCrossDomain);

// route server

const adminRouter = require("./server/routers/admin");
const commonRouter = require("./server/routers/common");

app.use("/api/admin", adminRouter);
app.use("/api", commonRouter);

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server listening at %d ", port);
});
