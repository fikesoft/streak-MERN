import React, { useEffect, useState } from 'react';

// Import the API utilities
import {
  getAllQuotes,
  createQuote as createQuoteApi,
  editQuote as editQuoteApi,
  deleteQuote as deleteQuoteApi,
} from '../../api/quoteControls';

// Material UI imports
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';

import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

// MUI X Date Pickers
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const AdminDashboard = () => {
  const [quotes, setQuotes] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Create form state
  const [createText, setCreateText] = useState('');
  const [createDate, setCreateDate] = useState(dayjs());

  // Edit form state
  const [editId, setEditId] = useState('');
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState(dayjs());

  // ---------------------------
  // 1. Fetch All Quotes on Mount
  // ---------------------------
  useEffect(() => {
    fetchAllQuotes();
  }, []);

  const fetchAllQuotes = async () => {
    try {
      const allQuotes = await getAllQuotes(); // from quoteApi.js
      setQuotes(allQuotes || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  // ---------------------------
  // 2. Create a Quote
  // ---------------------------
  const handleCreateQuote = async () => {
    try {
      const dateString = createDate.format('YYYY-MM-DD');
      await createQuoteApi(createText, dateString); // from quoteApi.js
      setIsCreateDialogOpen(false);
      setCreateText('');
      setCreateDate(dayjs());
      fetchAllQuotes(); // refresh
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  // ---------------------------
  // 3. Open Edit Dialog
  // ---------------------------
  const openEditDialog = (quote) => {
    setEditId(quote._id);
    setEditText(quote.text);
    setEditDate(dayjs(quote.date)); // parse existing date
    setIsEditDialogOpen(true);
  };

  // ---------------------------
  // 4. Submit Edited Quote
  // ---------------------------
  const handleEditQuote = async () => {
    try {
      const dateString = editDate.format('YYYY-MM-DD');
      await editQuoteApi(editId, {
        text: editText,
        date: dateString,
      }); // from quoteApi.js
      setIsEditDialogOpen(false);
      fetchAllQuotes(); // refresh
    } catch (error) {
      console.error('Error editing quote:', error);
    }
  };

  // ---------------------------
  // 5. Delete Quote
  // ---------------------------
  const handleDeleteQuote = async (quote) => {
    try {
      // We'll pass the 'date' as filter (could also pass { text: quote.text })
      await deleteQuoteApi({ date: quote.date }); // from quoteApi.js
      fetchAllQuotes(); // refresh
    } catch (error) {
      console.error('Error deleting quote:', error);
    }
  };

  return (
    <div className='admin-container'>
        <h1>Admin Dashboard</h1>
        <p>Manage your quotes (create, edit, delete).</p>
        

      {/* CREATE BUTTON */}
      
      
      <div className='table'>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setIsCreateDialogOpen(true)}
        sx={{ mb: 2 }}
      >
        Create Quote
      </Button>

      {/* QUOTES TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Quote Text</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote._id}>
                <TableCell>{quote.text}</TableCell>
                <TableCell>{quote.date}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => openEditDialog(quote)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteQuote(quote)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {quotes.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No quotes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CREATE DIALOG */}
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
        <DialogTitle>Create New Quote</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Quote Text"
            variant="outlined"
            value={createText}
            onChange={(e) => setCreateText(e.target.value)}
            fullWidth
          />

          {/* MUI DatePicker for creation */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Quote Date"
              value={createDate}
              onChange={(newValue) => setCreateDate(newValue)}
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateQuote}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Quote</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Quote Text"
            variant="outlined"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            fullWidth
          />

          {/* MUI DatePicker for editing */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Quote Date"
              value={editDate}
              onChange={(newValue) => setEditDate(newValue)}
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditQuote}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      </div>
      
    </div>
  );
};

export default AdminDashboard;
