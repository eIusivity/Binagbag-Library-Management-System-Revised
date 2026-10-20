import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Chip,
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "@mui/material";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import { fetchBookProfile, fetchBooksSummary } from "../../api/catalogApi";
import StateDialog from "../../components/StateDialog";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { getBookCopies } from "../../api/bookCopiesApi";
function BookProfile() {
  const bookIcon = null; //temporary
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [bookCopies, setBookCopies] = useState([]);
  const [librarySummary, setLibrarySummary] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadBook() {
      setLoading(true);
      setError("");
      setBook(null);
      try {
        const result = await fetchBookProfile(bookId);
        if (!result?.record) {
          setError(result?.message || "No such book exists.");
          return;
        }
        setBook(result.record);
        const summaryResult = await fetchBooksSummary(bookId);
        if (!summaryResult?.data) {
          setError(summaryResult?.message || "Failed to load book's summary.");
          return;
        }
        const bookCopiesResult = await getBookCopies(bookId);
        if (!bookCopiesResult) {
          setError(
            bookCopiesResult?.message || "Failed to load book's copies.",
          );
          return;
        }
        setLibrarySummary(summaryResult.data);
        setBookCopies(bookCopiesResult);
        console.log(result.record);
        console.log(summaryResult.data);
      } catch (error) {
        setError(error.message || "Failed to load book.");
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [bookId]);
  const bookInformationValues = [
    { label: "ISBN", value: book?.isbn },
    { label: "Author", value: book?.author },
    { label: "Genre", value: book?.genre },
    { label: "Publisher", value: book?.publisher },
    { label: "Publication Year", value: book?.publication_year },
    { label: "Language", value: book?.language },
  ];
  const librarySummaryValues = [
    { label: "Total Copies", value: librarySummary?.total_copies },
    { label: "Available Copies", value: librarySummary?.available_copies },
    { label: "Borrowed Copies", value: librarySummary?.borrowed_copies },
    { label: "Reserved Copies", value: librarySummary?.reserved_copies },
    {
      label: "Total Times Borrowed",
      value: librarySummary?.total_times_borrowed,
    },
  ];
  if (loading) {
    return (
      <Box
        sx={{
          p: 2,
          display: "flex",
          flex: 1,
          gap: 2,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Fetching book information...
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 2,
          display: "flex",
          flex: 1,
          gap: 2,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <StateDialog
          icon={<FeedbackIcon sx={{ fontSize: 128 }} />}
          title={error}
          action={() => navigate("/catalog")}
          actionLabel={"Return to catalog"}
        />
      </Box>
    );
  }
  return (
    <Box
      sx={{ p: 2, display: "flex", flex: 1, gap: 2, flexDirection: "column" }}
    >
      <Stack direction="row" sx={{ bgcolor: "white", p: 2, gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
          <Box
            sx={{
              width: 90,
              height: 140,
              flexShrink: 0,
              alignSelf: "flex-start",
              bgcolor: "#E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!bookIcon || imageError ? (
              <AutoStoriesOutlinedIcon
                sx={{ fontSize: 40, color: "#9CA3AF" }}
              />
            ) : (
              <Box
                component="img"
                src={bookIcon}
                alt={title}
                onError={() => setImageError(true)}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </Box>
        </Box>
        {/* main book informmation */}
        <Stack sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {book?.title}
          </Typography>
          <Typography sx={{ opacity: 0.6 }}>
            {book?.author ?? "No author."}
          </Typography>
          <Typography>{book?.description ?? "No description."}</Typography>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Chip
              sx={{
                bgcolor: Number(book?.available_copies) === 0 ? "red" : "green",
                color: "white",
              }}
              label={
                Number(book?.available_copies) === 0
                  ? "Unavailable"
                  : `${book?.available_copies} of ${book?.total_copies} copies available`
              }
            />
          </Box>
        </Stack>
      </Stack>
      {/* Book Information and Library Summary */}
      <Stack direction="row" spacing={2}>
        <Stack sx={{ bgcolor: "white", flex: 1, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Book Information
          </Typography>
          {bookInformationValues.map((bookInformation) => {
            return (
              <Stack direction="row">
                <Typography sx={{ flex: 1 }}>
                  {bookInformation.label}
                </Typography>
                <Typography
                  sx={{
                    flex: 1,
                    justifyContent: "flex-end",
                    fontWeight: "bold",
                  }}
                >
                  {bookInformation.value ??
                    `No ${bookInformation.label} found.`}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
        <Stack sx={{ bgcolor: "white", flex: 1, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Library Summary
          </Typography>
          {librarySummaryValues.map((summary) => {
            return (
              <Stack direction="row">
                <Typography sx={{ flex: 1 }}>{summary.label}</Typography>
                <Typography
                  sx={{
                    flex: 1,
                    justifyContent: "flex-end",
                    fontWeight: "bold",
                  }}
                >
                  {summary.value}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      {/* List of Physical Copies */}
      <Stack sx={{ bgcolor: "white", p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Physical Copies
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Copy ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Shelf Location</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookCopies.map((copy) => {
                return (
                  <TableRow>
                    <TableCell>{copy.copy_id}</TableCell>
                    <TableCell>
                      <Chip
                        label={copy.status}
                        color={
                          copy.status === "Available"
                            ? "success"
                            : copy.status === "Borrowed"
                              ? "info"
                              : copy.status === "Reserved"
                                ? "warning"
                                : copy.status === "Defective" && "error"
                        }
                      />
                    </TableCell>
                    <TableCell>{copy.shelf}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}

export default BookProfile;
