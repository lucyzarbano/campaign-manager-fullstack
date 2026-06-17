import { useEffect, useState } from "react";
import "./App.css";
import type { Campaign } from "./types/Campaign";
import { fetch_campaigns } from "./api/campaigns";
import { Box, Button, Chip, Container, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";


function App() {

  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");


  useEffect(() => {
    const load_campaigns = async () => {
      try {
        const response = await fetch_campaigns();
        setCampaigns(response.data);
      } catch {
        setError('Unable to load campaigns')
      } finally {
        setIsLoading(false)
      }
    }

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

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Search by name or ID"
            size="small"
            fullWidth
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" defaultValue="">
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="0">Paused</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained">
            Apply
          </Button>

          <Button variant="outlined">
            Reset
          </Button>
        </Stack>
      </Paper>

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
                    <a href={campaign.coverImageUrl} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </TableCell>

                  <TableCell>
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  </Box>
);}

export default App;
