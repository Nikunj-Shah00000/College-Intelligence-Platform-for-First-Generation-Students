import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import tipsRouter from "./tips";
import notificationsRouter from "./notifications";
import statsRouter from "./stats";
import confessionsRouter from "./confessions";
import facultyInsightsRouter from "./faculty-insights";
import nudgesRouter from "./nudges";
import roadmapRouter from "./roadmap";
import powerMapRouter from "./power-map";
import survivalGuideRouter from "./survival-guide";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(tipsRouter);
router.use(notificationsRouter);
router.use(statsRouter);
router.use(confessionsRouter);
router.use(facultyInsightsRouter);
router.use(nudgesRouter);
router.use(roadmapRouter);
router.use(powerMapRouter);
router.use(survivalGuideRouter);

export default router;
