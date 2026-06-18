import { useEffect, useState } from "react";
import "./App.css";
import type { Campaign } from "./types/Campaign";
import { fetch_campaigns, update_campaign } from "./api/campaigns";
import { Box, Container, Paper, Typography } from "@mui/material";
import { CampaignFilters } from "./components/CampaignFilters";
import { CampaignTable } from "./components/CampaignTable";
import { EditCampaignModal } from "./components/EditCampaignModal";
import type { CampaignUpdate } from "./types/CampaingUpdate";
import { ViewCreativeModal } from "./components/ViewCreativesModal";


function App() {

  const default_page = 1;
  const default_limit = 20;

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<"0" | "1" | "">("");
  const [limit, setLimit] = useState<number>(default_limit);
  const [page, setPage] = useState<number>(default_page);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedCampaignOnViewCreative, setSelectedCampaignOnViewCreative] = useState<Campaign | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewCreativeOpen, setIsViewCreativeOpen] = useState(false);




  const load_campaigns = async (
    next_search = search,
    next_status = status,
    next_page = page,
    next_limit = limit
  ) => {
    const filter_params = {
      q: next_search || undefined,
      limit: next_limit,
      status: next_status === "" ? undefined : Number(next_status) as 0 | 1,
      page: next_page
    }
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch_campaigns(filter_params);
      setCampaigns(response.data);
      setTotalPage(response.pagination.total_pages);
    } catch {
      setError('Unable to load campaigns')
    } finally {
      setIsLoading(false)
    }
  }

  const reset_filters = async () => {
    setSearch("")
    setStatus("")
    setLimit(default_limit)
    setPage(default_page)

    load_campaigns("", "", default_page, default_limit);
  }

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    load_campaigns(search, status, value, limit);
  };

  const handleApplyFilters = () => {
    setPage(default_page);
    load_campaigns(search, status, default_page, limit);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
    setSelectedCampaign(null);
  };

   const handleCloseViewCreativeModal = () => {
    setIsViewCreativeOpen(false);
    setSelectedCampaignOnViewCreative(null);
  };

  const handleSaveCampaign = async (campaignToUpdate: CampaignUpdate) => {
    try {
      await update_campaign(campaignToUpdate.id, campaignToUpdate);
      handleCloseEditModal();
      await load_campaigns(search, status, page, limit);
    } catch {
      setError("Unable to update campaign");
    }
  }

  const handleViewCreatives = async(campaign: Campaign) => {
    setIsViewCreativeOpen(true);
    setSelectedCampaignOnViewCreative(campaign);
  };

  useEffect(() => {
    load_campaigns();
  }, []);


  return (
    <Box className="app">
      <Container maxWidth="xl">
        <Box className="app-header">
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Campaign Manager
          </Typography>

          <Typography color="text.secondary">
            Manage campaigns, creatives, and campaign status.
          </Typography>
        </Box>

        <CampaignFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onApply={handleApplyFilters}
          onReset={reset_filters}
        />

        {isLoading && (
          <Paper sx={{ p: 3 }}>
            <Typography>Loading campaigns...</Typography>
          </Paper>
        )}

        {error && (
          <Paper sx={{ p: 3 }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        )}

        {!isLoading && !error && campaigns.length === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography>No campaigns found.</Typography>
          </Paper>
        )}

        {!isLoading && !error && campaigns.length > 0 && (
          <CampaignTable
            campaigns={campaigns}
            page={page}
            totalPages={totalPage}
            onPageChange={handleChangePage}
            onEditCampaign={handleEditCampaign}
            onViewCreatives={handleViewCreatives}
          />
        )}

        {selectedCampaign && (
          <EditCampaignModal
            key={selectedCampaign.id}
            open={isEditOpen}
            campaign={selectedCampaign}
            onClose={handleCloseEditModal}
            onSave={handleSaveCampaign}
          />
        )}

        {selectedCampaignOnViewCreative && (
          <ViewCreativeModal
            open={isViewCreativeOpen}
            campaign={selectedCampaignOnViewCreative}
            onClose={handleCloseViewCreativeModal}
          />
        )}

      </Container>
    </Box>
  );
}

export default App;
