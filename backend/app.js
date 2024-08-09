const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var db = require("./db");
const port = 3000;

//解决跨域问题
app.use(function (request, response, next) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  response.setHeader("Access-Control-Expose-Headers", "*");
  next();
});

//对POST请求过来的数据进行解析
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/profiles", function (request, response) {
  db.getProfiles(function (error, profiles) {
    if (error) {
      response.status(500).end();
    } else {
      response.status(200).json(profiles);
    }
  });
});

app.put("/profiles/:id", function (request, response) {
  const id = request.params.id;
  const { userName, email, phone } = request.body;
  db.updateProfileById(id, userName, email, phone, function (error) {
    if (error) {
      response.status(500).end();
    } else {
      response.status(200).end();
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
