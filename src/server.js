require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const port = process.env.APP_PORT || 3000;

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// rotas da aplicação
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
