import type { Creative } from "../types/Creative";
import type { CreativeCreate } from "../types/CreativeCreate";
import type CreativeResponse from "../types/CreativeResponse";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function fetch_creatives_by_campaign_id(id: number): Promise<Creative[]>{
    const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}/creatives`);

    if (!response.ok) {
        throw new Error("Error to get creative by campaign id");
    }

    const result = await response.json();
    return result.data;
}


export async function create_creative(
    campaign_id: number,
    creative_to_create: CreativeCreate
): Promise<Creative> {
    const response = await fetch(`${API_BASE_URL}/api/campaigns/${campaign_id}/creatives`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(creative_to_create),
    });

    if (!response.ok) {
        throw new Error("Error to create creative");
    }

    const result: CreativeResponse = await response.json();
    return result.data;
}
