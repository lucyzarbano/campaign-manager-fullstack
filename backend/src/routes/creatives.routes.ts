import {Router} from 'express';
import { create_creative, get_creatives_by_campaign_id } from '../services/creative.js';
import { get_campaign } from '../services/campaign.js';

export const creativesRouter = Router();

creativesRouter.get("/:id/creatives", async (req, res) => {
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

creativesRouter.post("/:id/creatives", async (req, res) => {
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
  try{
      const creative_created = await create_creative(campaign_id, asset_url);
      
      res.status(201).json({
        data: creative_created
      });
  } catch{
    return res.status(400).json({"message": "Creative images must be 320X480"})
  }
})