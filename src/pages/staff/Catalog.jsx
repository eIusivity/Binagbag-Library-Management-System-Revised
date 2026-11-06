import { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import CustomTextField from "../../components/CustomTextField";
import BookCatalogCard from "../../components/BookCatalogCard";
import { searchBooks } from "../../api/catalogApi";

function Catalog() {
  const [fetchedBooks, setFetchedBooks] = useState([]);
  const [totalFetchedBooks, setTotalFetchedBooks] = useState(0);
  const [searchObject, setSearchObject] = useState({
    title: "",
    author: "",
    publication_year: "",
    isUnavailable: false,
    isAvailable: false,
    page: 1,
  });
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadBooks() {
      setError("");
      setLoading(true);
      try {
        const result = await searchBooks(searchObject);
        if (isCurrentRequest) {
          setFetchedBooks(result.records ?? []);
          setPageCount(result.totalPages ?? 0);
          setTotalFetchedBooks(result.total ?? 0);
        }
      } catch {
        if (isCurrentRequest) {
          setFetchedBooks([]);
          setPageCount(0);
          setTotalFetchedBooks(0);
          setError("Failed to load books. Please try again.");
        }
      } finally {
        if (isCurrentRequest) {
          setLoading(false);
        }
      }
    }

    loadBooks();
    return () => {
      isCurrentRequest = false;
    };
  }, [searchObject]);

  const updateFilter = (filter, value) => {
    setSearchObject((prev) => ({
      ...prev,
      [filter]: value,
      page: 1,
    }));
  };

  return (
    <Box
      component="main"
      aria-labelledby="catalog-heading"
      sx={{
        boxSizing: "border-box",
        width: "100%",
        maxWidth: 1440,
        mx: "auto",
        p: { xs: 1, sm: 2 },
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        alignItems: "stretch",
        gap: 2,
      }}
    >
      <Stack
        component="aside"
        aria-label="Catalog search and filters"
        spacing={1.5}
        sx={{
          bgcolor: "white",
          boxSizing: "border-box",
          width: { xs: "100%", lg: 280 },
          flexShrink: 0,
          p: { xs: 1.5, sm: 2 },
          alignSelf: "flex-start",
        }}
      >
        <Typography id="catalog-heading" variant="h5" sx={{ fontWeight: "bold" }}>
          Catalog
        </Typography>
        <CustomTextField
          fullWidth
          label="Title"
          placeholder="Search for a title"
          value={searchObject.title}
          onChange={(e) => updateFilter("title", e.target.value)}
        />
        <Divider />
        <Typography component="h2" sx={{ fontWeight: "bold" }}>
          Availability
        </Typography>
        <Stack direction={{ xs: "column", sm: "row", lg: "column" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={searchObject.isAvailable}
                onChange={(e) =>
                  updateFilter("isAvailable", e.target.checked)
                }
              />
            }
            label="Available"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={searchObject.isUnavailable}
                onChange={(e) =>
                  updateFilter("isUnavailable", e.target.checked)
                }
              />
            }
            label="Unavailable"
          />
        </Stack>
        <Divider />
        <CustomTextField
          fullWidth
          label="Author"
          placeholder="Search for an author"
          value={searchObject.author}
          onChange={(e) => updateFilter("author", e.target.value)}
        />
        <CustomTextField
          fullWidth
          label="Publication year"
          type="number"
          placeholder="Enter a year"
          value={searchObject.publication_year}
          onChange={(e) => updateFilter("publication_year", e.target.value)}
        />
      </Stack>

      <Box
        component="section"
        aria-label="Catalog results"
        aria-busy={loading}
        sx={{
          bgcolor: "white",
          boxSizing: "border-box",
          flex: 1,
          minWidth: 0,
          p: { xs: 1.5, sm: 2 },
        }}
      >
        {loading && (
          <Typography role="status" sx={{ mb: 2 }}>
            Loading books...
          </Typography>
        )}
        {error && (
          <Typography role="alert" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {!loading && !error && fetchedBooks.length === 0 && (
          <Typography role="status">No results found.</Typography>
        )}

        {fetchedBooks.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {fetchedBooks.map((book) => (
              <Link
                key={book.book_id}
                to={`/catalog/${book.book_id}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  minWidth: 0,
                }}
              >
                <BookCatalogCard
                  title={book.title}
                  author={book.author}
                  bookIcon={null}
                  available_copies={book.available_copies}
                />
              </Link>
            ))}
          </Box>
        )}

        {totalFetchedBooks > 6 && pageCount > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
            <Pagination
              aria-label="Catalog pages"
              count={pageCount}
              page={searchObject.page}
              variant="outlined"
              shape="rounded"
              color="primary"
              siblingCount={0}
              onChange={(_, selectedPage) =>
                setSearchObject((prev) => ({ ...prev, page: selectedPage }))
              }
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Catalog;
