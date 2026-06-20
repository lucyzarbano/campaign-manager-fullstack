import { parse } from "csv-parse/sync";
import { Campaign } from "../types/Campaign.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const updatedCampaigns = new Map<number, Campaign>();

export function reset_campaign_updates(): void {
    updatedCampaigns.clear();
}

interface CampaignCsvRecord {
    id: string;
    name: string;
    status: string;
    landingUrl: string;
    coverImageUrl: string;
    createdAt: string;
}

export async function get_campaigns(): Promise<Campaign[]> {
    const filePath = path.join(__dirname, "../../data/campaigns_data_2026.csv");
    const fileContent = readFileSync(filePath, "utf8");
    const records = parse(fileContent, {
        columns: true,
        delimiter: ";",
        skip_empty_lines: true
    }) as CampaignCsvRecord[];

    const campaign_list: Campaign[] = records.map((record) => ({
        id: Number(record.id),
        name: String(record.name),
        status: Number(record.status) as 0 | 1,
        landingUrl: String(record.landingUrl),
        coverImageUrl: String(record.coverImageUrl),
        createdAt: String(record.createdAt)
    }));

    return campaign_list.map((campaign) => {
        return updatedCampaigns.get(campaign.id) ?? campaign;
    });
}

export async function get_campaign(id: number): Promise<undefined | Campaign> {
    const campaign_list = await get_campaigns();
    return campaign_list.find((campaign) => campaign.id === id);
}

export async function update_campaign(id: number, data_to_update: Partial<Campaign>): Promise<undefined | Campaign> {
    const campaign_list = await get_campaigns();
    const campaign = campaign_list.find((campaign) => campaign.id === id);

    if (!campaign) {
        return undefined;
    }

    const campaign_updated: Campaign = {
        id: campaign.id,
        name: data_to_update.name ?? campaign.name,
        status: data_to_update.status ?? campaign.status,
        landingUrl: data_to_update.landingUrl ?? campaign.landingUrl,
        coverImageUrl: data_to_update.coverImageUrl ?? campaign.coverImageUrl,
        createdAt: campaign.createdAt
    };

    updatedCampaigns.set(campaign_updated.id, campaign_updated);
    return campaign_updated;
}