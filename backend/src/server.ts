import express from 'express';
import "dotenv/config";
import cors from "cors";
import { campaignsRouter } from './routes/campaigns.route.js';
import { creativesRouter } from './routes/creatives.routes.js';


const port = Number(process.env.PORT) || 4000;
const app = express();
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



app.listen(port, () => console.log(`Backend API listening on http://localhost:${port}`));