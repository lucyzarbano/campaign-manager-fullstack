import type { Creative } from "../types/Creative";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function fetch_creatives_by_campaign_id(id: number): Promise<Creative[]>{
    const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}/creatives`);

    if (!response.ok) {
        throw new Error("Error to get creative by campaign id");
    }

    const result = await response.json();
    return result.data;
}