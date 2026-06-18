import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Typography
}
    from "@mui/material";

import type { Campaign } from "../types/Campaign";
import { useEffect, useState } from "react";
import type { Creative } from "../types/Creative";
import { fetch_creatives_by_campaign_id } from "../api/creative";
import { CreativeTable } from "./CreativeTable";

interface ViewCreativeModalProps {
  open: boolean;
  campaign: Campaign;
  onClose: () => void;
}

export function ViewCreativeModal({open, campaign, onClose}: ViewCreativeModalProps) {

    const [creatives, setCreatives] = useState<Creative[]>([]) 
    const [error, setError] = useState<string>("")

    
    const get_creatives_by_campaign_id = async(campaign: Campaign) => {
        try{
            setError("");
            const creatives = await fetch_creatives_by_campaign_id(campaign.id);
            setCreatives(creatives)
        } catch {
            setError("Unable to get creatives for campaign")
        }
    }

    useEffect(()=>{
        get_creatives_by_campaign_id(campaign)
    }, [campaign])


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>View Creative by Campaign</DialogTitle>

            <DialogContent>
                <Stack>
                {error && (<p>{error}</p>)}

                {!error && creatives.length === 0 && (
                    <Typography>No creatives found for this campaign.</Typography>
                )}

                {creatives.length > 0 && <CreativeTable creatives={creatives}/>}

                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>

        </Dialog>
    )
}
