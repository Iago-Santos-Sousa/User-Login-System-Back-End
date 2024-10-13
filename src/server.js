const express = require("express");
require("dotenv").config();
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// rotas da aplicação
app.use("/api", routes);

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server is running at port: ${process.env.APP_PORT || 3000}`);
});
