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
import { create_creative, fetch_creatives_by_campaign_id } from "../api/creative";
import { CreativeTable } from "./CreativeTable";
import { file_to_data_url } from "../utils/files";

interface ViewCreativeModalProps {
    open: boolean;
    campaign: Campaign;
    onClose: () => void;
}

export function ViewCreativeModal({ open, campaign, onClose }: ViewCreativeModalProps) {

    const [creatives, setCreatives] = useState<Creative[]>([])
    const [error, setError] = useState<string>("")
    const [selectedFile, setSelectedFile] = useState<File>()
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [uploadError, setUploadError] = useState<string>("")



    const get_creatives_by_campaign_id = async (campaign: Campaign) => {
        try {
            setError("");
            const creatives = await fetch_creatives_by_campaign_id(campaign.id);
            setCreatives(creatives)
        } catch {
            setError("Unable to get creatives for campaign")
        }
    }

    const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setSelectedFile(file)
        setUploadError("")
    }

    const handleCreateCreative = async () => {
        if (!selectedFile) {
            setUploadError("Please select an image first")
            return
        }

        try {
            setIsUploading(true)
            setUploadError("")

            const assetUrl = await file_to_data_url(selectedFile);
            await create_creative(campaign.id, { assetUrl })
            await get_creatives_by_campaign_id(campaign)
            setSelectedFile(undefined)
        } catch {
            setUploadError("Unable to upload creative. Image must be 320x480.")
        } finally {
            setIsUploading(false)
        }
    }

    

    useEffect(() => {
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

                    {creatives.length > 0 && <CreativeTable creatives={creatives} />}

                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                    >
                        Upload files
                        <input 
                            hidden type="file" 
                            accept="image/*"  
                            onChange={handleUploadFile} />
                    </Button>
                    {selectedFile && (
                        <Typography>{selectedFile.name}</Typography>
                    )}

                    {uploadError && (
                        <Typography color="error">{uploadError}</Typography>
                    )}

                    <Button
                        variant="outlined"
                        onClick={handleCreateCreative}
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? "Uploading..." : "Upload creative"}
                    </Button>

                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
            

        </Dialog>
    )
}
