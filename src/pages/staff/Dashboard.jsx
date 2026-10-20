import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { BarChart } from "@mui/x-charts/BarChart";
import { authClient } from "../../auth/authClient";
import { Box, Typography, Stack } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import { getAllLoans } from "../../api/loansApi";
import { getAllReservations } from "../../api/reservationApi";
import { getUserByLibraryID } from "../../api/usersApi";
import { getBook } from "../../api/booksApi";
import { getVisitsToday, getWeeklyVisit } from "../../api/visitsApi";
function Dashboard() {
  const [activeLoanValue, setActiveLoanValue] = useState(0);
  const [overdueLoanValue, setOverdueLoanValue] = useState(0);
  const [reservationValue, setReservationValue] = useState(0);
  const [visitsValue, setVisitsValue] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [mostBorrowedBooks, setMostBorrowedBooks] = useState([]);
  const [libraryVisits, setLibraryVisits] = useState([]);
  const [visitsError, setVisitsError] = useState("");
  async function loadHeaderContents() {
    const activeLoansCount = await getAllLoans();
    const reservationsCount = await getAllReservations();
    const activeLoans = activeLoansCount.data.filter(
      (loan) => loan.status === "Borrowed" || loan.status === "Overdue",
    );
    const overdueLoans = activeLoansCount.data.filter(
      (loan) => loan.status === "Overdue",
    );
    const reservations = reservationsCount.data.filter(
      (reserve) =>
        reserve.status !== "Expired" &&
        reserve.status !== "Picked Up" &&
        reserve.status !== "Cancelled",
    );
    //get visits
    const visits = await getVisitsToday();
    setVisitsValue(visits.todaysVisits);
    setActiveLoanValue(activeLoans.length);
    setOverdueLoanValue(overdueLoans.length);
    setReservationValue(reservations.length);
  }
  async function loadMostBorrowedBooks() {
    try {
      const response = await getAllLoans();

      // Count loans across all physical copies of each book.
      const counts = {};

      for (const loan of response.data) {
        const bookId = loan.copy_id.substring(0, 7);

        counts[bookId] = (counts[bookId] || 0) + 1;
      }

      // Select the top three before fetching their titles.
      const topBooks = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      const packagedBooks = await Promise.all(
        topBooks.map(async ([bookId, total]) => {
          const book = await getBook(bookId);

          return {
            bookId,
            title: book.title,
            total,
          };
        }),
      );

      setMostBorrowedBooks(packagedBooks);
    } catch (error) {
      console.error("Failed to load most borrowed books:", error);
    }
  }
  async function loadRecentLoans() {
    try {
      const loanResponse = await getAllLoans({ thisDayOnly: true });

      const today = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
      });

      const isToday = (date) =>
        date &&
        new Date(date).toLocaleDateString("en-CA", {
          timeZone: "Asia/Manila",
        }) === today;

      const activities = await Promise.all(
        loanResponse.data.map(async (loan) => {
          const bookId = loan.copy_id.substring(0, 7);

          const [userResponse, bookResponse] = await Promise.all([
            getUserByLibraryID(loan.library_id),
            getBook(bookId),
          ]);

          const returnedToday = isToday(loan.return_date);

          return {
            id: loan.loan_id,
            operation: returnedToday ? "Book Returned" : "Book Borrowed",
            libraryId: loan.library_id,
            borrowerName: userResponse.user.name,
            copyId: loan.copy_id,
            bookTitle: bookResponse.title,
            date: returnedToday ? loan.return_date : loan.borrow_date,
          };
        }),
      );

      activities.sort((a, b) => new Date(b.date) - new Date(a.date));

      setRecentActivities(activities.slice(0, 10));
    } catch (error) {
      console.error(error);
    }
  }
  async function loadLibraryVisits() {
    try {
      setVisitsError("");

      const response = await getWeeklyVisit({ year: 2026, month: 10, week: 2 });

      setLibraryVisits(response.data);
      console.log(response.data);
    } catch (error) {
      setVisitsError(error.message || "Failed to load library visits.");
    }
  }
  useEffect(() => {
    loadHeaderContents();
    loadRecentLoans();
    loadLibraryVisits();
    loadMostBorrowedBooks();
  }, []);
  const headerContents = [
    {
      label: "Visits Today",
      value: visitsValue,
      icon: <PersonOutlinedIcon />,
      bgcolor: "#3b82f6",
      color: "#FFFFFF",
      lightColor: "transparent",
      borderColor: "#2563EB",
    },
    {
      label: "Active Loans",
      value: activeLoanValue,
      icon: <ScheduleIcon />,
      bgcolor: "#eb2588",
      color: "#FFFFFF",
      lightColor: "transparent",
      borderColor: "#eb2588",
    },
    {
      label: "Reservations",
      value: reservationValue,
      icon: <BookOutlinedIcon />,
      bgcolor: "#25eb3f",
      color: "#FFFFFF",
      lightColor: "transparent",
      borderColor: "#25eb3f",
    },
    {
      label: "Overdue Loans",
      value: overdueLoanValue,
      icon: <ReportGmailerrorredOutlinedIcon />,
      bgcolor: "#eb253f",
      color: "#FFFFFF",
      lightColor: "transparent",
      borderColor: "#eb253f",
    },
  ];
  return (
    <>
      <Box
        sx={{ p: 2, display: "flex", flex: 1, flexDirection: "column", gap: 2 }}
      >
        <Stack>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "primary.main" }}
          >
            Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ letterSpacing: 2 }}>
            See what is occuring on the library today.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          {headerContents.map((header, y) => {
            return (
              <Stack
                key={header.label}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  p: 2.5,
                  bgcolor: header.bgcolor,
                  color: header.color,
                  border: header.bgcolor,
                  borderTop: header.bgcolor,
                  borderRadius: 2,
                }}
              >
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 56,
                    height: 56,
                    flexShrink: 0,
                    bgcolor: "transparent",
                    borderRadius: 2,
                    "& .MuiSvgIcon-root": { fontSize: 30 },
                  }}
                >
                  {header.icon}
                </Stack>

                <Stack>
                  <Typography variant="body2" sx={{ color: "inherit" }}>
                    {header.label}
                  </Typography>

                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {header.value}
                  </Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TableContainer>
            <Table sx={{ bgcolor: "white" }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Recent Loans (Last 24 hours)
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentActivities.length === 0 && (
                  <TableRow>
                    <TableCell
                      sx={{
                        height: 180,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <Typography sx={{ color: "text.secondary" }}>
                        No recent activities today. Let’s get to work,
                        Librarian, shall we?
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {recentActivities.map((recentActivity) => {
                  return (
                    <TableRow key={recentActivity.id}>
                      <TableCell>
                        <Stack
                          direction="row"
                          sx={{ justifyContent: "center" }}
                        >
                          <Stack sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: "bold" }}>
                              {recentActivity?.operation}
                            </Typography>
                            <Typography sx={{ opacity: 0.7 }}>
                              {recentActivity?.borrowerName} |{" "}
                              {recentActivity?.bookTitle}
                            </Typography>
                          </Stack>
                          <Typography>
                            {new Date(recentActivity.date).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                                timeZone: "Asia/Manila",
                              },
                            )}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
        <Box sx={{ p: 2, bgcolor: "white" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Library Activity
          </Typography>
          <BarChart
            dataset={libraryVisits}
            xAxis={[
              {
                scaleType: "band",
                dataKey: "day",
              },
            ]}
            series={[
              {
                dataKey: "total_visits",
                label: "Library Visits",
                color: "#1B2A4A",
              },
            ]}
            yAxis={[{ min: 0 }]}
            height={300}
          />
        </Box>
        <Box sx={{ p: 2, bgcolor: "white", minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Most Borrowed Books
          </Typography>

          <BarChart
            dataset={mostBorrowedBooks}
            layout="horizontal"
            yAxis={[
              {
                scaleType: "band",
                dataKey: "title",
                width: 120,
              },
            ]}
            xAxis={[{ min: 0, tickMinStep: 1 }]}
            series={[
              {
                dataKey: "total",
                label: "Times Borrowed",
                color: "#1B2A4A",
              },
            ]}
            margin={{ left: 10, right: 20 }}
            height={350}
          />
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
