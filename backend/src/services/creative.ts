import crypto from "node:crypto";
import type { Creative } from "../types/Creative.js";
import { validate_creative_image } from "../utils/image.js";

const creatives: Creative[] = [];

export function reset_creatives(): void {
    creatives.length = 0;
}

export async function get_creatives_by_campaign_id(
    campaign_id: number
): Promise<Creative[]> {
    return creatives.filter((creative) => creative.campaignId === campaign_id);
}

export async function create_creative(
    campaign_id: number,
    asset_url: string
): Promise<Creative> {
    await validate_creative_image(asset_url);

    const creative: Creative = {
        id: crypto.randomUUID(),
        campaignId: campaign_id,
        assetUrl: asset_url,
        createdAt: new Date().toISOString()
    };

    creatives.push(creative);
    return creative;
}

export async function delete_creative(
    creative_id: string,
    campaign_id: number
): Promise<boolean> {
    const creative_index = creatives.findIndex((creative) => {
        return creative.id === creative_id && creative.campaignId === campaign_id;
    });

    if (creative_index === -1) {
        return false;
    }

    creatives.splice(creative_index, 1);
    return true;
}

export async function can_add_creative_to_campaign(
    campaign_id: number
): Promise<boolean> {
    const existing_creatives = await get_creatives_by_campaign_id(campaign_id);
    return existing_creatives.length < 3;
}

export function is_campaign_active(campaign_status: number): boolean {
    return campaign_status === 1;
}
