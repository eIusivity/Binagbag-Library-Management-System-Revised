import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  buttonBaseClasses,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableBody,
} from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useReactToPrint } from "react-to-print";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BookIcon from "@mui/icons-material/Book";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import {
  getTotalBorrows,
  getTotalReturns,
  getLoanReportRecords,
  getBookInventorySummary,
  getBookInventoryRecords,
  getReservationSummary,
  getReservationReportRecords,
} from "../../api/reportApi";
import { useAuth } from "../../auth/AuthProvider";
function Reports() {
  const { user } = useAuth();
  const [mode, setMode] = useState("");
  const [bookSummary, setBookSummary] = useState(null);
  const [bookRecords, setBookRecords] = useState([]);
  const [reservationSummary, setReservationSummary] = useState(null);
  const [reservationRecords, setReservationRecords] = useState([]);
  const [dates, setDates] = useState({
    startingDate: null,
    endingDate: null,
  });
  const reportRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle:
      mode === "books"
        ? "Book Inventory Report"
        : mode === "reservations"
          ? "Reservation Report"
          : "Loan Report",
    pageStyle: `
    @page {
      size: A4 landscape;
      margin: 12mm;
    }

    @media print {
      tr {
        break-inside: avoid;
      }

      thead {
        display: table-header-group;
      }
    }
  `,
  });
  const [totalBorrows, setTotalBorrows] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [loanRecords, setLoanRecords] = useState([]);
  function handleModeChange(nextMode) {
    if (nextMode === mode) return;

    setMode(nextMode);
    setDates({ startingDate: null, endingDate: null });
    setTotalBorrows(0);
    setTotalReturns(0);
    setLoanRecords([]);
    setBookSummary(null);
    setBookRecords([]);
    setReservationSummary(null);
    setReservationRecords([]);
  }
  useEffect(() => {
    let cancelled = false;

    async function getInformation() {
      if (
        mode !== "loans" ||
        !dates?.startingDate?.isValid() ||
        !dates?.endingDate?.isValid()
      )
        return;

      try {
        const params = {
          startingDate: dates.startingDate.format("YYYY-MM-DD"),
          endingDate: dates.endingDate.format("YYYY-MM-DD"),
        };

        const information = await getTotalBorrows(params);
        const returnsInformation = await getTotalReturns(params);
        const loanInformation = await getLoanReportRecords(params);

        if (cancelled) return;

        setTotalBorrows(information.totalBorrows);
        setTotalReturns(returnsInformation.totalReturns);
        setLoanRecords(loanInformation.records);
      } catch (error) {
        if (!cancelled) console.error(error);
      }
    }

    getInformation();

    return () => {
      cancelled = true;
    };
  }, [dates, mode]);
  useEffect(() => {
    let cancelled = false;

    async function loadBookReport() {
      if (mode !== "books") return;

      try {
        const summaryInformation = await getBookInventorySummary();
        const recordsInformation = await getBookInventoryRecords();

        if (cancelled) return;

        setBookSummary(summaryInformation.summary);
        setBookRecords(recordsInformation.records);
      } catch (error) {
        if (!cancelled) console.error(error);
      }
    }

    loadBookReport();

    return () => {
      cancelled = true;
    };
  }, [mode]);
  useEffect(() => {
    let cancelled = false;

    async function loadReservationReport() {
      if (
        mode !== "reservations" ||
        !dates.startingDate?.isValid() ||
        !dates.endingDate?.isValid() ||
        dates.endingDate.isBefore(dates.startingDate, "day")
      )
        return;

      try {
        const params = {
          startingDate: dates.startingDate.format("YYYY-MM-DD"),
          endingDate: dates.endingDate.format("YYYY-MM-DD"),
        };

        const summaryInformation = await getReservationSummary(params);
        const recordsInformation = await getReservationReportRecords(params);

        if (cancelled) return;

        setReservationSummary(summaryInformation.summary);
        setReservationRecords(recordsInformation.records);
      } catch (error) {
        if (!cancelled) console.error(error);
      }
    }

    loadReservationReport();

    return () => {
      cancelled = true;
    };
  }, [dates, mode]);
  const reportModes = [
    {
      label: "Loans",
      icon: <LibraryBooksIcon />,
      sublabel: "Report total loans, borrows, overdues, and returns.",
      toMode: "loans",
    },
    {
      label: "Reservations",
      icon: <BookIcon />,
      sublabel:
        "Report total reservations, fulfilled reservations, and cancelled reservations.",
      toMode: "reservations",
    },
    {
      label: "Books",
      icon: <AutoStoriesIcon />,
      sublabel: "Report book inventory.",
      toMode: "books",
    },
  ];
  return (
    <Box sx={{ p: 2, display: "flex", flex: 1, flexDirection: "column" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
        Report
      </Typography>
      <Typography variant="subtitle1" sx={{ letterSpacing: 2 }}>
        Report management for formal library updates.
      </Typography>
      <Stack sx={{ gap: 1 }}>
        {reportModes.map((reportButton) => {
          return (
            <Button
              sx={{
                display: "flex",
                bgcolor: "white",
                justifyContent: "flex-start",
                p: 2,
                gap: 2,
                border: mode === reportButton.toMode ? 1 : 0,
                borderColor: "accent.primary",
              }}
              onClick={() => handleModeChange(reportButton.toMode)}
            >
              {reportButton.icon}
              <Stack sx={{ alignItems: "flex-start" }}>
                <Typography>{reportButton.label}</Typography>
                <Typography>{reportButton.sublabel}</Typography>
              </Stack>
            </Button>
          );
        })}
      </Stack>

      {/* the real deal right here */}
      <Stack>
        {mode === "" && <Typography>Select a mode to begin.</Typography>}
        {mode !== "" && (
          <>
            <Typography sx={{ fontWeight: "bold", mt: 2 }}>
              Report Preview
            </Typography>
            <Stack sx={{ bgcolor: "white", p: 2, borderRadius: 4 }}>
              {/* report preview main */}
              <Box
                ref={reportRef}
                sx={{ p: 3, bgcolor: "white", color: "black" }}
              >
                <Typography sx={{ fontWeight: 800 }}>
                  BINAGBAG NATIONAL HIGH SCHOOL — LIBRARY
                </Typography>

                <Typography variant="h5">
                  {mode === "loans" && "LOAN REPORT"}
                  {mode === "reservations" && "RESERVATION REPORT"}
                  {mode === "books" && "BOOK INVENTORY REPORT"}
                </Typography>

                {/* Shared date controls */}
                {(mode === "loans" || mode === "reservations") && (
                  <>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ "@media print": { display: "none" } }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Starting Date"
                          value={dates.startingDate}
                          disableFuture
                          onChange={(value) =>
                            setDates((prev) => ({
                              ...prev,
                              startingDate: value,
                            }))
                          }
                        />

                        <DatePicker
                          label="Ending Date"
                          value={dates.endingDate}
                          disableFuture
                          minDate={dates.startingDate ?? undefined}
                          onChange={(value) =>
                            setDates((prev) => ({
                              ...prev,
                              endingDate: value,
                            }))
                          }
                        />
                      </LocalizationProvider>
                    </Stack>

                    <Typography
                      sx={{
                        display: "none",
                        "@media print": { display: "block", mb: 2 },
                      }}
                    >
                      Period: {dates.startingDate?.format("MMMM D, YYYY")} –{" "}
                      {dates.endingDate?.format("MMMM D, YYYY")}
                    </Typography>
                  </>
                )}

                {/* Loans only */}
                {mode === "loans" && (
                  <>
                    <TableContainer>
                      <Table
                        size="small"
                        sx={{
                          "@media print": {
                            "& .MuiTableCell-root": {
                              padding: "4px 6px",
                              fontSize: "10px",
                            },
                          },
                        }}
                      >
                        <TableBody>
                          <TableRow>
                            <TableCell>Total Borrows</TableCell>
                            <TableCell>{totalBorrows}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Total Returns</TableCell>
                            <TableCell>{totalReturns}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Typography sx={{ mt: 3, mb: 1, fontWeight: 800 }}>
                      Loan Records
                    </Typography>

                    <TableContainer>
                      <Table
                        size="small"
                        sx={{
                          "@media print": {
                            "& .MuiTableCell-root": {
                              padding: "4px 6px",
                              fontSize: "10px",
                            },
                          },
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Loan ID</TableCell>
                            <TableCell>Borrower</TableCell>
                            <TableCell>Book Title</TableCell>
                            <TableCell>Copy ID</TableCell>
                            <TableCell>Borrow Date</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Return Date</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {loanRecords.map((loan) => (
                            <TableRow key={loan.loan_id}>
                              <TableCell>{loan.loan_id}</TableCell>
                              <TableCell>
                                {loan.borrower_name ?? loan.library_id}
                              </TableCell>
                              <TableCell>
                                {loan.book_title ?? "Unknown title"}
                              </TableCell>
                              <TableCell>{loan.copy_id}</TableCell>
                              <TableCell>
                                {dayjs(loan.borrow_date).format("MMM D, YYYY")}
                              </TableCell>
                              <TableCell>
                                {dayjs(loan.due_date).format("MMM D, YYYY")}
                              </TableCell>
                              <TableCell>
                                {loan.return_date
                                  ? dayjs(loan.return_date).format(
                                      "MMM D, YYYY",
                                    )
                                  : "Not returned"}
                              </TableCell>
                            </TableRow>
                          ))}

                          {loanRecords.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} align="center">
                                No loan records for the selected period.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
                {mode === "reservations" && (
                  <>
                    {reservationSummary ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Metric</TableCell>
                              <TableCell align="right">Total</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {[
                              [
                                "Total Reservations",
                                reservationSummary.totalReservations,
                              ],
                              [
                                "Waiting",
                                reservationSummary.waitingReservations,
                              ],
                              [
                                "Ready for Pickup",
                                reservationSummary.readyReservations,
                              ],
                              [
                                "Fulfilled",
                                reservationSummary.fulfilledReservations,
                              ],
                              [
                                "Cancelled",
                                reservationSummary.cancelledReservations,
                              ],
                              [
                                "Expired",
                                reservationSummary.expiredReservations,
                              ],
                            ].map(([label, total]) => (
                              <TableRow key={label}>
                                <TableCell>{label}</TableCell>
                                <TableCell align="right">{total}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography sx={{ mt: 2 }}>
                        Select a valid date range to load the reservation
                        summary.
                      </Typography>
                    )}
                    <Typography sx={{ mt: 3, mb: 1, fontWeight: 800 }}>
                      Reservation Records
                    </Typography>

                    <TableContainer>
                      <Table
                        size="small"
                        sx={{
                          "@media print": {
                            "& .MuiTableCell-root": {
                              padding: "4px 6px",
                              fontSize: "10px",
                            },
                          },
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Reservation ID</TableCell>
                            <TableCell>Patron</TableCell>
                            <TableCell>Book Title</TableCell>
                            <TableCell>Reservation Date</TableCell>
                            <TableCell>Ready Date</TableCell>
                            <TableCell>Expiry Date</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {reservationRecords.map((reservation) => (
                            <TableRow key={reservation.reservation_id}>
                              <TableCell>
                                {reservation.reservation_id}
                              </TableCell>
                              <TableCell>
                                {reservation.reservee_name ??
                                  reservation.library_id}
                              </TableCell>
                              <TableCell>
                                {reservation.book_title ?? reservation.book_id}
                              </TableCell>
                              <TableCell>
                                {dayjs(reservation.reservation_date).format(
                                  "MMM D, YYYY",
                                )}
                              </TableCell>
                              <TableCell>
                                {reservation.ready_date
                                  ? dayjs(reservation.ready_date).format(
                                      "MMM D, YYYY",
                                    )
                                  : "—"}
                              </TableCell>
                              <TableCell>
                                {reservation.expiry_date
                                  ? dayjs(reservation.expiry_date).format(
                                      "MMM D, YYYY",
                                    )
                                  : "—"}
                              </TableCell>
                              <TableCell>{reservation.status}</TableCell>
                            </TableRow>
                          ))}

                          {reservationRecords.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} align="center">
                                No reservation records for the selected period.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
                {mode === "books" && (
                  <>
                    {bookSummary ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Metric</TableCell>
                              <TableCell align="right">Total</TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {[
                              ["Total Book Titles", bookSummary.totalTitles],
                              [
                                "Total Physical Copies",
                                bookSummary.totalCopies,
                              ],
                              ["Available Copies", bookSummary.availableCopies],
                              ["Borrowed Copies", bookSummary.borrowedCopies],
                              ["Reserved Copies", bookSummary.reservedCopies],
                              ["Defective Copies", bookSummary.defectiveCopies],
                            ].map(([label, total]) => (
                              <TableRow key={label}>
                                <TableCell>{label}</TableCell>
                                <TableCell align="right">{total}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography sx={{ mt: 2 }}>
                        Inventory summary has not loaded.
                      </Typography>
                    )}
                    <Typography sx={{ mt: 3, mb: 1, fontWeight: 800 }}>
                      Book Inventory Records
                    </Typography>

                    <TableContainer>
                      <Table
                        size="small"
                        sx={{
                          "@media print": {
                            "& .MuiTableCell-root": {
                              padding: "4px 6px",
                              fontSize: "10px",
                            },
                          },
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Book ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell align="right">Total Copies</TableCell>
                            <TableCell align="right">Available</TableCell>
                            <TableCell align="right">Borrowed</TableCell>
                            <TableCell align="right">Reserved</TableCell>
                            <TableCell align="right">Defective</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {bookRecords.map((book) => (
                            <TableRow key={book.book_id}>
                              <TableCell>{book.book_id}</TableCell>
                              <TableCell>{book.title}</TableCell>
                              <TableCell>
                                {book.author ?? "No author"}
                              </TableCell>
                              <TableCell align="right">
                                {book.totalCopies}
                              </TableCell>
                              <TableCell align="right">
                                {book.availableCopies}
                              </TableCell>
                              <TableCell align="right">
                                {book.borrowedCopies}
                              </TableCell>
                              <TableCell align="right">
                                {book.reservedCopies}
                              </TableCell>
                              <TableCell align="right">
                                {book.defectiveCopies}
                              </TableCell>
                            </TableRow>
                          ))}

                          {bookRecords.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={8} align="center">
                                No book records to display.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}
                <Typography sx={{ mt: 4 }}>Prepared by: {user.name}</Typography>
              </Box>
            </Stack>
            <Button variant="contained" onClick={handlePrint}>
              Print Report
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}

export default Reports;
