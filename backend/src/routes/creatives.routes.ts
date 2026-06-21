import { Router } from "express";
import {
  can_add_creative_to_campaign,
  create_creative,
  delete_creative,
  get_creatives_by_campaign_id,
  is_campaign_active
} from "../services/creative.js";
import { get_campaign } from "../services/campaign.js";

export const creativesRouter = Router();

creativesRouter.get("/:id/creatives", async (req, res) => {
  const campaign_id = Number(req.params.id);
  const campaign = await get_campaign(campaign_id);

  if (!campaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  const creatives = await get_creatives_by_campaign_id(campaign_id);
  return res.json({ data: creatives });
});

creativesRouter.post("/:id/creatives", async (req, res) => {
  const campaign_id = Number(req.params.id);
  const asset_url =
    req.body.assetUrl !== undefined ? String(req.body.assetUrl) : "";

  if (!asset_url) {
    return res.status(400).json({ message: "Asset URL is required" });
  }

  const campaign = await get_campaign(campaign_id);

  if (!campaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  if (!is_campaign_active(campaign.status)) {
    return res.status(400).json({
      message: "Paused campaigns cannot accept new creatives"
    });
  }

  if (!(await can_add_creative_to_campaign(campaign.id))) {
    return res.status(400).json({
      message: "A campaign can have at most 3 creatives"
    });
  }

  try {
    const creative_created = await create_creative(campaign_id, asset_url);
    return res.status(201).json({ data: creative_created });
  } catch {
    return res.status(400).json({
      message: "Creative images must be 320x480"
    });
  }
});

creativesRouter.delete("/:id/creatives/:creativeId", async (req, res) => {
  const campaign_id = Number(req.params.id);
  const creative_id = req.params.creativeId;
  const campaign = await get_campaign(campaign_id);

  if (!campaign) {
    return res.status(404).json({ message: "Campaign not found" });
  }

  const was_deleted = await delete_creative(creative_id, campaign_id);

  if (!was_deleted) {
    return res.status(404).json({ message: "Creative not found" });
  }

  return res.status(204).send();
});