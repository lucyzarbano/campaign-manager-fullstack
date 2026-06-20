import express from 'express';
import cors from "cors";
import { campaignsRouter } from './routes/campaigns.route.js';
import { creativesRouter } from './routes/creatives.routes.js';

export const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors());


app.use("/api/campaigns", campaignsRouter);
app.use("/api/campaigns", creativesRouter);


app.get("/api/health", (_req, res) => {
  res.json({
    status: true,
    service: "campaign-manager-backend"
  })
})
