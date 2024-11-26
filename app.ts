import express, { Application } from "express";
import globalErrorHandler from "./_middlewares/globalErrorHandler";
import logger from "./_middlewares/logger";

const app: Application = express();
const asyncHandler =
  (fn: Function) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

app.get("/", (req, res) => {
  res.json({ send: "hai peeps" });
});
app.get("/error-test", (req, res, next) => {
  try {
    throw new Error("This is a test error!");
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

app.use(globalErrorHandler);

export default app;
