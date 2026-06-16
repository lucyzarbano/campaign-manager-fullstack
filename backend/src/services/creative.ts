import { Creative } from "../types/Creative.js";
import crypto from "node:crypto";

const creatives: Creative[] = [];


export async function get_creatives_by_campaign_id(campaign_id: number): Promise<Creative[]> {
    return creatives.filter((creative) => (creative.campaignId === campaign_id))
}

export async function create_creative(campaign_id: number, asset_url: string): Promise<Creative> {
    const creative: Creative = {
        id: crypto.randomUUID(),
        campaignId: campaign_id,
        assetUrl: asset_url,
        createdAt: new Date().toISOString()
    }
    creatives.push(creative)
    return creative;
}