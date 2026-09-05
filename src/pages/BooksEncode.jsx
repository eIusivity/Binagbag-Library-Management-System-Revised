import {Box, Typography, Button, Select, MenuItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Chip, Snackbar, Alert, TextareaAutosize, Stack, FormControl} from '@mui/material'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import CustomTextField from '../components/CustomTextField';
import BookProductCard from '../components/BookProductCard';
import PendingIcon from '@mui/icons-material/Pending';
import EmptyState from '../components/EmptyState';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import QuizIcon from '@mui/icons-material/Quiz';
import AddIcon from '@mui/icons-material/Add';
import {useState, useEffect} from 'react';
function BooksEncode() {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [addBookOverlay, setAddBookOverlay] = useState(false);
    const [addBookDialog, setAddBookDialog] = useState(false);
    const [secondAddBookDialog, setSecondAddBookDialog] = useState(false);
    const [genre, setGenre] = useState("All Genre");
    const [status, setStatus] = useState("All Status");
    const [books, setBooks] = useState([]);
    const [targetBook, setTargetBook] = useState("");
    const [editingBook, setEditingBook] = useState(null);
    const [createBookDraft, setCreateBookDraft] = useState(null);
    const [targetBookCopies, setTargetBookCopies] = useState({});
    const [bookInformationEditToggle, setBookInformationEditToggle] = useState(false);
    const addBookTextFields = [
        {label: 'Title', placeholder: 'e.g. Atomic Haits', row: 1, value: 'title', required: true},
        {label: 'Author', placeholder: 'e.g. Jose Rizal', row: 2, value: 'author'},
        {label: 'ISBN', placeholder: "9849302230111", row: 2, value: 'isbn'},
        {label: 'Publication Year', placeholder: 'e.g. 2020', type: 'number', row: 3, value: 'publication_year'},
        {label: 'Publisher', placeholder: 'e.g. Munich Publication Press', row: 3, value: 'publisher'},
        {label: 'Genre', type: 'select', row: 4, value: 'genre'},
        {label: 'Language', placeholder: 'e.g. English', row: 4, value: 'language'},
        {label: 'Description', type: 'textarea', placeholder: 'Enter a brief description of the book...', row: 5, value: 'description'},
    ];

    const addBookTFRows = Object.values(
    Object.groupBy(addBookTextFields, (textfield) => textfield.row)
    );
    const bookInformationRows = [
    { label: "Book ID", value: "book_id", editable: false},
    { label: "ISBN", value: "isbn", editable: true},
    { label: "Publisher", value: "publisher", editable: true},
    { label: "Publication Year", value: "publication_year", editable: true},
    { label: "Language", value: "language", editable: true},
    { label: "Genre", value: "genre", editable: true},
    { label: "Shelf Location", value: "shelves", editable: false},
    { label: "Description", value: "description", editable: true}
    ];
    async function loadBook(id) {
        const response = await fetch('http://localhost:3000/books/'+id);
        const data = await response.json();
        setTargetBook(data);
    }
    async function loadBookCopies(id) {
        const response = await fetch('http://localhost:3000/books/'+id+"/copies");
        const data = await response.json();
        setTargetBookCopies(data);
    }
    async function editBookInformation(id) {
        const response = await fetch('http://localhost:3000/books/'+id+'/edit', {
            method: 'PUT',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify(editingBook)
        });
        if(response.ok) {
            await loadBook(id);
            setEditingBook(null);
            setSnackbarOpen(true);
        }
    }
    useEffect(() => {
        async function loadBooks() {
            const response = await fetch('http://localhost:3000/books')
            const data = await response.json();
            setBooks(data);
        }
        loadBooks();
    },[]);

    return(
        <>
        {/* Add Dialog */}
        {addBookOverlay && (<Box sx={{position: 'absolute', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: 'rgba(0,0,0,0.5)', height: '100%', width: '100%', zIndex: 999}}>
            {addBookDialog && (<Box sx={{bgcolor: '#FFFFFF', width: '50%', height: 'fit-content', p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1}}>
            <Box sx={{display: 'flex'}}>
                <Typography variant="h6" sx={{flex: 1, fontWeight: 'bold'}}>Add Book</Typography>
                <Button onClick={() => setAddBookOverlay(false)}>X</Button>
            </Box>
            <Typography>Enter the book's information and its physical copies</Typography>
                <Box component="form" onSubmit={(e) => {e.preventDefault(); setSecondAddBookDialog(true); setAddBookDialog(false)}}>
                ({ addBookDialog && addBookTFRows.map((row, rowIndex) => (
                    <Box
                        key={rowIndex}
                        sx={{
                            display: 'flex',
                            gap: 2
                        }}>
                        {row.map((textfield, i) => (
                            <Box
                                key={i}
                                sx={{
                                    flex: 1
                                }}>
                                <Typography sx={{fontWeight: 'bold'}}>
                                    {textfield.label}
                                </Typography>
                                <CustomTextField
                                    placeholder={textfield.placeholder}
                                    required={textfield.required}
                                    type={textfield.type}
                                    fullWidth
                                    onChange={(e) => {
                                        setCreateBookDraft(prev => ({
                                            ...prev,
                                            [textfield.value]: e.target.value
                                        }));
                                    }}
                                    sx={{height: 40}}
                                />
                            </Box>
                        ))}
                    </Box>
                ))}
                <Stack direction="row" sx={{justifyContent: 'flex-end'}}>
                    <Button onClick={() => setAddBookOverlay(false)}>Cancel</Button>
                    <Button type="submit" sx={{bgcolor: 'accent.primary', color: 'background.default'}}>Continue</Button>
                </Stack>)
                {/* CONTINUE HERE, ADD SECOND STEP FOR PHYSICAL COPIES */}
                </Box>
            </Box>)}
        </Box>)}

        {/* Main container */}
        <Box sx={{flex: 1, display: 'flex', p: 2, minHeight: 0, overflow: 'hidden', height: 'calc(100vh - 64px)'}}>
            {/* Book Product Cards List */}
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', px: 1}}>

            {/* Title and Add Book Button */}
            <Box sx={{flex: 0.1, display: 'flex'}}>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <Typography variant="h4" sx={{fontWeight: 'bold'}}>Books</Typography>
                    <Typography variant="subtitle1" sx={{color: '#777777'}}>Manage books and their physical copies</Typography>
                </Box>
                <Box sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                    <Button onClick={() => {setAddBookOverlay(true); setAddBookDialog(true)}} size="large" sx={{bgcolor: 'accent.primary', color: 'background.default'}}>+ Add Book</Button>
                </Box>
            </Box>
            
            {/* Searchbar and filters */}
            <Box sx={{flex: 0.1, display: 'flex', gap: 2, py: 1}}>
                <CustomTextField fullWidth placeholder="Search by title, author, Book ID, or publisher..."/>
                <Select sx={{bgcolor: 'accent.secondary', color: 'text.primary', minWidth: 120}} value={genre} onChange={((e) => setGenre(e.target.value))}>
                <MenuItem value="All Genre">All Genre</MenuItem>
                <MenuItem value="Fiction">Fiction</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="History">History</MenuItem>
                </Select>
                <Select sx={{bgcolor: 'accent.secondary', minWidth: 120}} value={status} onChange={((e) => setStatus(e.target.value))}>
                <MenuItem value="All Status">All Status</MenuItem>
                <MenuItem value="Fiction">Available</MenuItem>
                <MenuItem value="Science">Unavailable</MenuItem>
                </Select>
            </Box>

            {/* Main frame for product cards */}
            <Box sx={{flex: 1, display: 'flex', alignItems: 'flex-start', gap: 1}}>
            {books.length === 0 ? (<EmptyState icon={<QuizIcon sx={{fontSize: 52}}/>} title="No book records found" description="Start by adding your first book."/>) : (books.map(book => {
                return(
                    <BookProductCard key={book.book_id} title={book.title} author={book.author} genre={book.genre} total_copies={book.total_copies} available_copies={book.available_copies} onClick={() => {loadBook(book.book_id); loadBookCopies(book.book_id);}}/>
                )
            }))}
            </Box>
            </Box>


            {/* Interface for modifying books */}
            <Box sx={{flex: 0.5, display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', p: 1, height: '100%', minHeight: 0}}>
            {targetBook === "" ? (<EmptyState icon={<PendingIcon sx={{fontSize: 52}}/>} title="No book selected yet" description="Selected book information will appear here."/>) 
            : 
            (<Box sx={{flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0}}>

                {/* Book details and exit button */}
                <Box sx={{display: 'flex', alignItems: 'center', flexShrink: 0}}>
                    <Typography variant="h5" sx={{flex: 1, fontWeight: 'bold'}}>Book Details</Typography>
                    <Button onClick={() => setTargetBook("")}>X</Button>
                </Box>

                {/* Scrollable Area */}
                <Box sx={{flex: 1, minHeight: 0, overflowY: 'auto'}}>

                {/* Headline for book, cover, title, author, genre */}
                <Box sx={{display: 'flex', gap: 2, borderBottom: 1, borderColor: 'background.default', py: 1}}>
                    <Box sx={{width: 115, height: 160, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, bgcolor: '#777777', borderRadius: 4}}>
                    <AutoStoriesIcon/>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'column'}}>
                        <Typography variant="h6" sx={{fontWeight: 'bold'}}>{targetBook.title}</Typography>
                        <Typography>{targetBook.author}</Typography>
                        <Typography>{targetBook.genre}</Typography>
                    </Box>
                </Box>

                {/* Book information, edit button */}
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Typography variant="h6" sx={{flex: 1, fontWeight: 'bold'}}>Book Information</Typography>
                    <ListItemButton onClick={() => {setBookInformationEditToggle(!bookInformationEditToggle); setEditingBook({...targetBook})}} sx={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                        <ListItemIcon>{<EditIcon sx={{color: 'text.primary', fontSize: 24}}/>}</ListItemIcon>
                        <ListItemText primary="Edit" sx={{flex: 'none'}}/>
                    </ListItemButton>
                </Box>

                {/* Book information */}
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                    {bookInformationRows.map(element => {
                        return(
                            <Box sx={{display: 'flex'}}>
                                <Typography sx={{flex: 1, color: '#777777'}}>{element.label}</Typography>
                                {bookInformationEditToggle ? (<CustomTextField type={element.value === 'publication_year' ? 'number' : 'text'}
                                onChange={(e) => {setEditingBook(prev => (
                                    {...prev, 
                                        [element.value]: e.target.value
                                    }
                                    ))}} disabled={!element.editable} value={editingBook?.[element.value] ?? ''} sx={{flex: 1, height: 30}}/>) : (<Typography sx={{flex: 1}}>{targetBook[element.value]}</Typography>)}
                            </Box>
                        )
                    })}
                    {bookInformationEditToggle && (<Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={() => {setBookInformationEditToggle(false); setEditingBook(null)}}>Cancel</Button>
                        <Button onClick={() => {editBookInformation(targetBook.book_id); setBookInformationEditToggle(false)}} sx={{bgcolor: 'accent.primary', color: 'background.default'}}>Submit</Button>
                    </Box>)}
                </Box>

                {/* Physical Copies, add button */}
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Typography variant="h6" sx={{flex: 1, fontWeight: 'bold'}}>Physical Copies</Typography>
                    <ListItemButton sx={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                        <ListItemIcon>{<AddIcon sx={{color: 'text.primary', fontSize: 24}}/>}</ListItemIcon>
                        <ListItemText primary="Add Copy" sx={{flex: 'none'}}/>
                    </ListItemButton>
                </Box>

                {/* Physical Copies */}
                <Box>
                    <TableContainer>
                    <Table size="small">
                    <TableHead>
                        <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                            Copy ID
                        </TableCell>

                        <TableCell sx={{ fontWeight: 'bold' }}>
                            Shelf
                        </TableCell>

                        <TableCell sx={{ fontWeight: 'bold' }}>
                            Status
                        </TableCell>

                        <TableCell
                        align="right"
                        sx={{ fontWeight: 'bold' }}>
                        Action
                        </TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {targetBookCopies.map(copy => (
                            <TableRow key={copy.copy_id}>
                            <TableCell>
                                {copy.copy_id}
                            </TableCell>
                            <TableCell>
                                {copy.shelf}
                            </TableCell>
                            <TableCell>
                                {copy.status}
                            </TableCell>
                            <TableCell align="right">
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        console.log('Edit', copy);
                                    }}>
                                <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                size="small"
                                onClick={() => {
                                    console.log('Delete', copy);
                                }}>
                                <DeleteIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                </Box>
            </Box>)}
            </Box>

            <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}>
            <Alert
                severity="success"
                variant="outlined"
                onClose={() => setSnackbarOpen(false)}
                sx={{
                    bgcolor: '#FFFFFF',
                    color: 'success.main'
                }}>
                Book information updated successfully.
            </Alert>
        </Snackbar>

        </Box>
        </>
    )
}

export default BooksEncode;