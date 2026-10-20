import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  Pagination,
} from "@mui/material";
import CustomTextField from "../../components/CustomTextField";
import BookCatalogCard from "../../components/BookCatalogCard";
import { searchBooks } from "../../api/catalogApi";
import { Link } from "react-router-dom";
function Catalog() {
  const [fetchedBooks, setFetchedBooks] = useState([]);
  const [totalFetchedBooks, setTotalFetchedBooks] = useState(0);
  const [searchObject, setSearchObject] = useState({
    title: "",
    author: "",
    publication_year: "",
    isUnavailable: false,
    isAvailable: false,
    page: 0,
  });
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadBooks() {
      setError("");
      setLoading(true);
      try {
        const result = await searchBooks(searchObject);
        if (result?.records) {
          setFetchedBooks(result.records);
          setPageCount(result.totalPages);
          setTotalFetchedBooks(result.total);
        }
        console.log(result.records);
        console.log(result.total);
        console.log(result.totalPages);
      } catch (error) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, [searchObject]);
  return (
    <Box sx={{ p: 2, display: "flex", flex: 1, gap: 2 }}>
      {/* Controls */}
      <Stack sx={{ bgcolor: "white", flex: 0.5, p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Catalog
        </Typography>
        <Typography sx={{ fontWeight: "bold" }}>Search</Typography>
        <CustomTextField
          placeholder="Search for a title..."
          onChange={(e) =>
            setSearchObject((prev) => ({
              ...prev,
              title: e.target.value,
              page: 1,
            }))
          }
        />
        <Divider sx={{ my: 1 }} />
        <Typography sx={{ fontWeight: "bold" }}>Availability</Typography>
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) =>
                setSearchObject((prev) => ({
                  ...prev,
                  isAvailable: e.target.checked,
                  page: 1,
                }))
              }
            />
          }
          label="Available"
        />
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) =>
                setSearchObject((prev) => ({
                  ...prev,
                  isUnavailable: e.target.checked,
                  page: 1,
                }))
              }
            />
          }
          label="Unavailable"
        />
        <Divider sx={{ my: 1 }} />
        <Typography sx={{ fontWeight: "bold" }}>Author</Typography>
        <CustomTextField
          placeholder="Search for an author..."
          onChange={(e) =>
            setSearchObject((prev) => ({
              ...prev,
              author: e.target.value,
              page: 1,
            }))
          }
        />
        <Divider sx={{ my: 1 }} />
        <Typography sx={{ fontWeight: "bold" }}>Publication Date</Typography>
        <CustomTextField
          placeholder="Enter year here..."
          onChange={(e) =>
            setSearchObject((prev) => ({
              ...prev,
              publication_year: e.target.value,
              page: 1,
            }))
          }
        />
      </Stack>

      {/* Main Panel */}
      <Stack
        direction="row"
        sx={{
          bgcolor: "white",
          flex: 1.5,
          minWidth: 0,
          p: 2,
          gap: 2,
          flexWrap: "wrap",
          alignItems: "flex-start",
          alignContent: "space-between",
        }}
      >
        {!loading && fetchedBooks.length === 0 && (
          <Typography>No results found.</Typography>
        )}

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography>{error}</Typography>}

        {fetchedBooks.map((book) => (
          <Box
            key={book.book_id}
            sx={{
              minWidth: 0,
              width: {
                xs: "100%",
                sm: "calc((100% - 16px) / 2)",
                md: "calc((100% - 32px) / 3)",
              },
            }}
          >
            <Link
              to={`/catalog/${book.book_id}`}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <BookCatalogCard
                title={book.title}
                author={book.author}
                bookIcon={null}
                available_copies={book.available_copies}
              />
            </Link>
          </Box>
        ))}
        {totalFetchedBooks > 6 && (
          <Box
            sx={{
              width: "100%",
              mt: "auto",
              pt: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              count={pageCount}
              page={searchObject.page}
              variant="outlined"
              shape="rounded"
              color="primary"
              onChange={(e, selectedPage) =>
                setSearchObject((prev) => ({
                  ...prev,
                  page: selectedPage,
                }))
              }
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default Catalog;
