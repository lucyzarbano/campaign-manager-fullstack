import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField
}
    from "@mui/material";
import { useState } from "react";
import type { Campaign } from "../types/Campaign";
import type { CampaignUpdate } from "../types/CampaingUpdate";

interface EditCampaignModalProps {
    open: boolean;
    campaign: Campaign;
    onClose: () => void;
    onSave: (campaign: CampaignUpdate) => void;
}



export function EditCampaignModal({
    open, campaign, onClose, onSave }: EditCampaignModalProps) {

    const [name, setName] = useState<string>(campaign.name)
    const [status, setStatus] = useState<"1" | "0">(String(campaign.status) as "0" | "1")
    const [landingUrl, setLandingUrl] = useState<string>(campaign.landingUrl)
    const [coverImageUrl, setCoverImageUrl] = useState<string>(campaign.coverImageUrl)


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSave({
            id: campaign.id,
            name,
            status: Number(status) as 0 | 1,
            landingUrl,
            coverImageUrl
        });
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit campaign</DialogTitle>

            <DialogContent>
                <Stack
                    component="form"
                    id="edit-campaign-form"
                    spacing={2}
                    sx={{ pt: 1 }}
                    onSubmit={handleSubmit}
                >
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        fullWidth
                    />

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            value={status}
                            onChange={(event) => setStatus(event.target.value as "0" | "1")}
                        >
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Paused</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Landing URL"
                        value={landingUrl}
                        onChange={(event) => setLandingUrl(event.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Cover image URL"
                        value={coverImageUrl}
                        onChange={(event) => setCoverImageUrl(event.target.value)}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" form="edit-campaign-form" variant="contained">
                    Save
                </Button>
            </DialogActions>

        </Dialog>
    )
}
