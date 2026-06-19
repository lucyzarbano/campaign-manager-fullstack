import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Container, Typography } from "@mui/material";
import "./App.css";
import type { Campaign } from "./types/Campaign";
import type { CampaignUpdate } from "./types/CampaignUpdate";
import { fetch_campaigns, update_campaign } from "./api/campaigns";
import { CampaignFilters } from "./components/CampaignFilters";
import { CampaignTable } from "./components/CampaignTable";
import { EditCampaignModal } from "./components/EditCampaignModal";
import { ViewCreativeModal } from "./components/ViewCreativesModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const FAVORITE_CAMPAIGN_IDS_KEY = "favoriteCampaignIds";

type StatusFilter = "" | "0" | "1";

function getStoredFavoriteCampaignIds(): number[] {
  const storedValue = localStorage.getItem(FAVORITE_CAMPAIGN_IDS_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (id): id is number => typeof id === "number" && Number.isFinite(id)
    );
  } catch {
    return [];
  }
}

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedCampaignOnViewCreative, setSelectedCampaignOnViewCreative] =
    useState<Campaign | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewCreativeOpen, setIsViewCreativeOpen] = useState(false);
  const [favoriteCampaignIds, setFavoriteCampaignIds] = useState<number[]>(
    getStoredFavoriteCampaignIds
  );

  const load_campaigns = async (
    nextSearch = search,
    nextStatus = status,
    nextPage = page
  ) => {
    const filterParams = {
      q: nextSearch || undefined,
      limit: DEFAULT_LIMIT,
      status:
        nextStatus === "" ? undefined : (Number(nextStatus) as 0 | 1),
      page: nextPage
    };

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch_campaigns(filterParams);
      setCampaigns(response.data);
      setTotalPages(response.pagination.total_pages);
    } catch {
      setError("Unable to load campaigns");
    } finally {
      setIsLoading(false);
    }
  };

  const reset_filters = () => {
    setSearch("");
    setStatus("");
    setPage(DEFAULT_PAGE);
    void load_campaigns("", "", DEFAULT_PAGE);
  };

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    void load_campaigns(search, status, value);
  };

  const handleApplyFilters = () => {
    setPage(DEFAULT_PAGE);
    void load_campaigns(search, status, DEFAULT_PAGE);
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

  const handleToggleFavorite = (campaign: Campaign) => {
    const isFavorite = favoriteCampaignIds.includes(campaign.id);
    const nextFavoriteCampaignIds = isFavorite
      ? favoriteCampaignIds.filter((id) => id !== campaign.id)
      : [...favoriteCampaignIds, campaign.id];

    setFavoriteCampaignIds(nextFavoriteCampaignIds);
    localStorage.setItem(
      FAVORITE_CAMPAIGN_IDS_KEY,
      JSON.stringify(nextFavoriteCampaignIds)
    );
  };

  const handleSaveCampaign = async (campaignToUpdate: CampaignUpdate) => {
    try {
      await update_campaign(campaignToUpdate.id, campaignToUpdate);
      handleCloseEditModal();
      await load_campaigns(search, status, page);
    } catch {
      setError("Unable to update campaign");
    }
  };

  const handleViewCreatives = (campaign: Campaign) => {
    setIsViewCreativeOpen(true);
    setSelectedCampaignOnViewCreative(campaign);
  };

  useEffect(() => {
    let isCancelled = false;

    fetch_campaigns({ page: DEFAULT_PAGE, limit: DEFAULT_LIMIT })
      .then((response) => {
        if (isCancelled) {
          return;
        }

        setCampaigns(response.data);
        setTotalPages(response.pagination.total_pages);
      })
      .catch(() => {
        if (!isCancelled) {
          setError("Unable to load campaigns");
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <Box className="app">
      <Container maxWidth="xl">
        <Box className="app-header">
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
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
          <Box className="feedback-state" role="status">
            <CircularProgress size={26} />
            <Typography>Loading campaigns...</Typography>
          </Box>
        )}

        {!isLoading && error && <Alert severity="error">{error}</Alert>}

        {!isLoading && !error && campaigns.length === 0 && (
          <Alert severity="info">No campaigns found.</Alert>
        )}

        {!isLoading && !error && campaigns.length > 0 && (
          <CampaignTable
            campaigns={campaigns}
            page={page}
            totalPages={totalPages}
            favoriteCampaignIds={favoriteCampaignIds}
            onPageChange={handleChangePage}
            onEditCampaign={handleEditCampaign}
            onToggleFavorite={handleToggleFavorite}
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