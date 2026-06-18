import {
  Button,
  Chip,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import type { Campaign } from "../types/Campaign";

interface CampaignTableProps {
  campaigns: Campaign[];
  page: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onEditCampaign: (campaign: Campaign) => void;
  onViewCreatives: (campaign: Campaign) => void;
}

export function CampaignTable({
  campaigns,
  page,
  totalPages,
  onPageChange,
  onEditCampaign,
  onViewCreatives
}: CampaignTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Landing</TableCell>
            <TableCell>Cover</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id} hover>
              <TableCell>{campaign.id}</TableCell>

              <TableCell>{campaign.name}</TableCell>

              <TableCell>
                <Chip
                  label={campaign.status === 1 ? "Active" : "Paused"}
                  color={campaign.status === 1 ? "success" : "default"}
                  size="small"
                />
              </TableCell>

              <TableCell>
                <a href={campaign.landingUrl} target="_blank" rel="noreferrer">
                  Open
                </a>
              </TableCell>

              <TableCell>
                <a
                  href={campaign.coverImageUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              </TableCell>

              <TableCell>
                {new Date(campaign.createdAt).toLocaleDateString()}
              </TableCell>

              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onEditCampaign(campaign)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  sx={{ ml: 1 }}
                  onClick={() => onViewCreatives(campaign)}
                >
                  Creatives
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        count={totalPages}
        page={page}
        boundaryCount={2}
        onChange={onPageChange}
        sx={{ display: "flex", justifyContent: "center", py: 2 }}
      />
    </TableContainer>
  );
}
