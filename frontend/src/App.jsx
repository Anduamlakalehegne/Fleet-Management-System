import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Grid,
  Typography,
  InputAdornment,
  Menu,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import BuildIcon from '@mui/icons-material/Build';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';
import { Car, Wrench, AlertCircle, Activity } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [newVehicle, setNewVehicle] = useState({ name: '', status: 'Active' });
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const openFilter = Boolean(anchorEl);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`${API_URL}/vehicles`);
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles.");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicle = async () => {
    try {
      await axios.post(`${API_URL}/vehicles`, newVehicle);
      fetchVehicles();
      setOpen(false);
      setNewVehicle({ name: '', status: 'Active' });
      toast.success("Vehicle added successfully!");
    } catch (error) {
      toast.error("Failed to add vehicle.");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/vehicles/${id}`, { status });
      fetchVehicles();
      setUpdateOpen(false);
      toast.info("Status updated!");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };


  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'All Statuses' || vehicle.status === filterStatus.replace(" Only", ""))
  );

  const statusCounts = vehicles.reduce((counts, vehicle) => {
    counts[vehicle.status] = (counts[vehicle.status] || 0) + 1;
    return counts;
  }, {});

  const handleUpdateOpen = (vehicle) => {
    setSelectedVehicle(vehicle);
    setUpdateOpen(true);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (status) => {
    setAnchorEl(null);
    if (status) {
      setFilterStatus(status);
    }
  };

  const cardData = [
    {
      title: 'Total Vehicles',
      value: vehicles.length,
      icon: <Car size={50} />,
      bgColor: '#e3f2fd',
      color: '#1d4ed8',
    },
    {
      title: 'Active Vehicles',
      value: statusCounts.Active || 0,
      icon: <Activity size={50} />,
      bgColor: '#e8f5e9',
      color: '#1b5e20',
    },
    {
      title: 'In Maintenance',
      value: statusCounts.Maintenance || 0,
      icon: <Wrench size={50} />,
      bgColor: '#fff3e0',
      color: '#ff9800', // Updated Color
    },
    {
      title: 'Inactive Vehicles',
      value: statusCounts['Out of Service'] || 0,
      icon: <AlertCircle size={50} />,
      bgColor: '#ffebee',
      color: '#b71c1c',
    },
  ];

  return (
    <Box sx={{ p: 3, fontFamily: 'Arial' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Vehicle Management Dashboard</Typography>
        <Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ mr: 2 }}>
            Add Vehicle
          </Button>
          {/* <Button variant="outlined" startIcon={<FileDownloadIcon />}>Export</Button> */}
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
      {cardData.map((card, index) => (
        <Grid item xs={3} key={index}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: card.bgColor,
              display: 'flex',
              alignItems: 'center',
              color: card.color,
            }}
          >
            <Box sx={{mr: 2}}> {/* Added margin to separate icon and text */}
              {card.icon}
            </Box>
            <Box>
              <Typography variant="h6">{card.title}</Typography>
              <Typography variant="h5">{card.value}</Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Search vehicles..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Box>
          <IconButton onClick={handleFilterClick}>
            <FilterListIcon />
          </IconButton>
          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            open={openFilter}
            onClose={() => handleFilterClose()}
          >
            <MenuItem onClick={() => handleFilterClose('All Statuses')}>All Statuses</MenuItem>
            <MenuItem onClick={() => handleFilterClose('Active Only')}>Active Only</MenuItem>
            <MenuItem onClick={() => handleFilterClose('In Maintenance Only')}>In Maintenance Only</MenuItem>
            <MenuItem onClick={() => handleFilterClose('Out of Service Only')}>Inactive Only</MenuItem>
          </Menu>
        </Box>
      </Box>
      {/* <Button variant="outlined" onClick={fetchVehicles} startIcon={<RefreshIcon />} sx={{ mb: 2, ml: 2 }}>
        Refresh
      </Button> */}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vehicle Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow key={vehicle._id}>
                <TableCell>{vehicle.name}</TableCell>
                <TableCell>
                  <Box sx={{
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: vehicle.status === 'Active' ? '#4caf50' : vehicle.status === 'Maintenance' ? '#ff9800' : '#f44336',
                    color: 'white',
                    textAlign: 'center',
                    width:'30%'
                  }}>
                    {vehicle.status}
                  </Box>
                </TableCell>
                <TableCell>{new Date(vehicle.lastUpdated).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleUpdateOpen(vehicle)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Vehicle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Vehicle Name"
            fullWidth
            value={newVehicle.name}
            onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label-add">Status</InputLabel>
            <Select
              labelId="status-label-add"
              id="status-select-add"
              value={newVehicle.status}
              label="Status"
              onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
            >
              <MenuItem value={'Active'}>Active</MenuItem>
              <MenuItem value={'Maintenance'}>Maintenance</MenuItem>
              <MenuItem value={'Out of Service'}>Out of Service</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddVehicle}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateOpen} onClose={() => setUpdateOpen(false)}>
        <DialogTitle>Update Vehicle Status</DialogTitle>
        <DialogContent>
          {selectedVehicle && (
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status-select"
                value={selectedVehicle.status}
                label="Status"
                onChange={(e) => setSelectedVehicle({ ...selectedVehicle, status: e.target.value })}
              >
                <MenuItem value={'Active'}>Active</MenuItem>
                <MenuItem value={'Maintenance'}>Maintenance</MenuItem>
                <MenuItem value={'Out of Service'}>Out of Service</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateOpen(false)}>Cancel</Button>
          <Button onClick={() => handleUpdateStatus(selectedVehicle._id, selectedVehicle.status)}>Update</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
}

export default App;
