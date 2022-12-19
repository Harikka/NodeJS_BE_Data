const express = require("express");
const cors = require("cors");
const xlsx = require("xlsx-to-json");
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fileReader = require("fs");
const app = express();

const postGres = require("pg-promise")();

const config = {
  host: "localhost",
  port: 5432,
  database: "portfolio",
  user: "harikka",
  password: "",
};

const database = postGres(config);

app.use(cors());

app.get("/ABN", async (req, res) => {
  const filePathData = await database.one(
    `SELECT "filePath" FROM data_sets WHERE "fileType" = 'xml'`
  );
  const readXMLFile = fileReader.readFileSync(filePathData?.filePath, "utf8");
  const parser = new XMLParser();
  let jObj = parser.parse(readXMLFile);
  res.json(jObj);
});

app.get("/companies", async (req, res) => {
  const filePathData = await database.one(
    `SELECT "filePath" FROM data_sets WHERE "fileType" = 'xlsx'`
  );
  xlsx(
    {
      input: filePathData?.filePath,
      output: "output.json",
      sheet: "company info",
    },
    function (err, result) {
      if (err) {
        console.error(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.listen(9050, () => console.log("Example app is listening on port 9050."));
