import {
  Dialog,
  DialogTitle,
  DialogContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Box,
  TableFooter,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getShelves } from "../../../api/shelvesApi";
import { getBookCopies } from "../../../api/bookCopiesApi";
import Barcode from "react-barcode";

function ManageCopyBarcodes({ open, onClose, bookId }) {
  const [bookCopies, setBookCopies] = useState([]);
  const [page, setPage] = useState(0);
  const [barcodeDialog, setBarcodeDialog] = useState("");
  useEffect(() => {
    async function loadBookCopies() {
      if (open) {
        const copies = await getBookCopies(bookId);
        setBookCopies(copies);
        setPage(Math.ceil(copies.length / 3) - 1);
      } else {
        setBookCopies([]);
      }
    }
    loadBookCopies();
  }, [open]);
  return (
    <>
      <Dialog
        open={barcodeDialog}
        onClose={() => setBarcodeDialog("")}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Here's your copy's barcode
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Barcode value={barcodeDialog} />
          <Button sx={{ color: "black", borderRadius: 4, border: 1 }}>
            Print Barcode
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Manage Copy Barcodes
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflowY: "auto",
              gap: 1,
              border: "1px dashed rgba(0,0,0,0.5)",
              borderRadius: 4,
              p: 1,
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Book Copy ID</TableCell>
                    <TableCell>Shelf</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookCopies.slice(page * 3, page * 3 + 3).map((copy) => (
                    <TableRow key={copy.copy_id}>
                      <TableCell>{copy.copy_id}</TableCell>
                      <TableCell>{copy.shelf}</TableCell>
                      <TableCell>{copy.status}</TableCell>
                      <TableCell>
                        <Button onClick={() => setBarcodeDialog(copy.copy_id)}>
                          View Barcode
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {bookCopies.length > 3 && (
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={bookCopies.length}
                        page={page}
                        rowsPerPage={3}
                        rowsPerPageOptions={[]}
                        onPageChange={(event, newPage) => setPage(newPage)}
                      />
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ManageCopyBarcodes;
