import { parse } from "csv-parse/sync";
import { Campaign } from "../types/Campaign.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function get_campaigns(): Promise<Campaign[]> {
    const filePath = path.join(__dirname, "../../data/campaigns_data_2026.csv");
    const fileContent = readFileSync(filePath);
    //initialize the parser
    const records = parse(fileContent, {
        columns: true,
        delimiter: ";",
        skip_empty_lines: true
    });
    
    return records.map((record:any) => ({
        id: Number(record.id),
        name: String(record.name),
        status: Number(record.status) as 0 | 1,
        landingUrl: String(record.landingUrl),
        coverImageUrl: String(record.coverImageUrl),
        createdAt: String(record.createdAt)
    }));
}

export async function get_campaign(id: number): Promise<undefined | Campaign> {
    const campaign_list = await get_campaigns();
    return campaign_list.find((campaign) => {return Number(campaign.id) === id});
}

export async function update_campaign(id: number, data_to_update: Partial<Campaign>): Promise<undefined | Campaign> {
    const campaign_list = await get_campaigns();
    const campaign = campaign_list.find((campaign) => (campaign.id === id));

    if (!campaign) {
        return undefined;
    }
   
    return {
        id: campaign.id,
        name: data_to_update.name ?? campaign.name,
        status: data_to_update.status ?? campaign.status,
        landingUrl: data_to_update.landingUrl ?? campaign.landingUrl,
        coverImageUrl: data_to_update.coverImageUrl ?? campaign.coverImageUrl,
        createdAt: campaign.createdAt
    };
}