const express =  require('express');
const app = express();
const port = 5000;
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const connect = require("./schemas/index.js");

connect();

app.use(express.json());
app.use("/", [postsRouter,commentsRouter]);

app.listen(port, () => {
    console.log(port, `Server Open : ${port}`);
  });

