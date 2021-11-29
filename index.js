const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const { MongoClient } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6kyz8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("portfolio");
    const aboutCollection = database.collection("aboutInfo");
    const projectsCollection = database.collection("projects");

    app.get("/about", async (req, res) => {
      const cursor = aboutCollection.find({});
      const infos = await cursor.toArray();
      res.send(infos);
    });

    app.get("/projects", async (req, res) => {
      const cursor = projectsCollection.find({});
      const projects = await cursor.toArray();
      res.send(projects);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("portfolio server running");
});

app.listen(port, () => {
  console.log(` Listening to portfolio server, ${port}`);
});
