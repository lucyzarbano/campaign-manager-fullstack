import express from 'express';
import "dotenv/config";
import { get_campaign, get_campaigns, update_campaign } from './services/campaign.js';
import { create_creative, get_creatives_by_campaign_id } from './services/creative.js';


const port = Number(process.env.PORT) || 4000;
const app = express();
app.use(express.json());


app.get("/api/health", (_req, res) => {
  res.json({
    status: true,
    service: "campaign-manager-backend"
  })
})

app.get("/api/campaigns", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const start = (page - 1) * limit;
  const end = start + limit;
  const status = req.query.status !== undefined ? Number(req.query.status) : undefined;
  const q = req.query.q !== undefined ? String(req.query.q).toLocaleLowerCase() : undefined;
  const campaign_list = await get_campaigns();
  let filtered_campaigns = campaign_list;

  if (status === 0 || status === 1) {
    filtered_campaigns = filtered_campaigns.filter((campaign) => {
      return campaign.status === status
    })
  }
  if (q) {
    filtered_campaigns = filtered_campaigns.filter((campaign) => {
      return campaign.name.toLocaleLowerCase().includes(q)
    })
  }
  const paginated_campaigns = filtered_campaigns.slice(start, end);

  const response = {
    "data": paginated_campaigns,
    "pagination": {
      "page": page,
      "limit": limit,
      "total": filtered_campaigns.length,
      "total_pages": Math.ceil(filtered_campaigns.length / limit)
    }
  }
  res.json(response)
})


app.get("/api/campaigns/:id", async (req, res) => {
  const id = Number(req.params.id);
  const campaign = await get_campaign(id);
  if (!campaign) {
    return res.status(404).json({ message: "Campaign not found" })
  }
  return res.json({ data: campaign })
})


app.put("/api/campaigns/:id", async (req, res) => {
  const id = Number(req.params.id);
  const bodyId = Number(req.body.id);

  if (bodyId !== id) {
    return res.status(400).json({
      message: "Body id must match route id"
    });
  }

  if (
    req.body.status !== undefined &&
    req.body.status !== 0 &&
    req.body.status !== 1
  ) {
    return res.status(400).json({
      message: "Status must be 0 or 1"
    });
  }

  if (req.body.landingUrl !== undefined) {
    try {
      new URL(req.body.landingUrl);
    } catch {
      return res.status(400).json({
        message: "landingUrl must be a valid URL"
      });
    }
  }

  const updatedCampaign = await update_campaign(id, {
    name: req.body.name,
    status: req.body.status,
    landingUrl: req.body.landingUrl,
    coverImageUrl: req.body.coverImageUrl
  });

  if (!updatedCampaign) {
    return res.status(404).json({
      message: "Campaign not found"
    });
  }

  res.json({
    data: updatedCampaign
  });
});

app.get("/api/campaigns/:id/creatives", async (req, res) => {
  const campaign_id = Number(req.params.id)

  const campaign = await get_campaign(campaign_id);
  if(!campaign){
    return res.status(404).json({"message": "Campaign not found"})
  }

  const creatives = await get_creatives_by_campaign_id(campaign_id);

  res.json({
    data: creatives
  });

})

app.post("/api/campaigns/:id/creatives", async (req, res) => {
  const campaign_id = Number(req.params.id)

  const asset_url = req.body.assetUrl !== undefined ? String(req.body.assetUrl) : "";

  if(!asset_url) {
    return res.status(400).json({message : "Asset Url is required"})
  }

  const campaign = await get_campaign(campaign_id);
  if(!campaign){
    return res.status(404).json({"message": "Campaign not found"})
  }

  if(campaign.status === 0) {
    return res.status(400).json({message : "Paused campaigns cannot accept new creatives"})
  }

  const existing_creatives = await get_creatives_by_campaign_id(campaign_id)

  if(existing_creatives.length >= 3){
    return res.status(400).json({message : "A campaign can have at most 3 creatives"})
  }

  const creative_created = await create_creative(campaign_id, asset_url)

  res.status(201).json({
    data: creative_created
  });

})

app.listen(port, () => console.log(`Backend API listening on http://localhost:${port}`));