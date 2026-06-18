import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import type { Creative } from "../types/Creative";

interface CreativeTableProps {
  creatives: Creative[];
}

export function CreativeTable({
  creatives}: CreativeTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>AssetUrl</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {creatives.map((creative) => (
            <TableRow key={creative.id} hover>
              <TableCell>{creative.id}</TableCell>
              <TableCell>
                <a href={creative.assetUrl} target="_blank" rel="noreferrer">
                  Open
                </a>
              </TableCell>

              <TableCell>
                {new Date(creative.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
