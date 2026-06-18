import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField
} from "@mui/material";

type StatusFilter = "" | "0" | "1";

interface CampaignFiltersProps {
  search: string;
  status: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onApply: () => void;
  onReset: () => void;
}

export function CampaignFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onApply,
  onReset
}: CampaignFiltersProps) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          label="Search by name or ID"
          size="small"
          fullWidth
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as StatusFilter)
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1">Active</MenuItem>
            <MenuItem value="0">Paused</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={onApply}>
          Apply
        </Button>

        <Button variant="outlined" onClick={onReset}>
          Reset
        </Button>
      </Stack>
    </Paper>
  );
}
