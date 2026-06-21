import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CampaignCsvRecord {
    id: string;
    name: string;
    status: string;
    landingUrl: string;
    coverImageUrl: string;
    createdAt: string;
}

let cachedCampaignRecords: CampaignCsvRecord[] | null = null;

export function listCampaignsFromCsv(): CampaignCsvRecord[] {
    if (cachedCampaignRecords !== null) {
        return cachedCampaignRecords;
    }

    const filePath = path.join(
        __dirname,
        "../../data/campaigns_data_2026.csv"
    );
    const fileContent = readFileSync(filePath, "utf8");

    cachedCampaignRecords = parse(fileContent, {
        columns: true,
        delimiter: ";",
        skip_empty_lines: true
    }) as CampaignCsvRecord[];

    return cachedCampaignRecords;
}
