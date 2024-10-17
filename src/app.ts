import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "./routes/index"; // tsoa va générer ce fichier
import errorHandler from "./middlewares/errorHandler";

const PORT = process.env.PORT || 8000;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  }),
);

RegisterRoutes(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
