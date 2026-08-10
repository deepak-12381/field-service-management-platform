 import { useEffect, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface ManagerData {
  id: number;
  name: string;
  department: string;
  email: string;
  phone: string;
  status: 'Active' | 'Pending';
}

const defaultManagers: ManagerData[] = [
  {
    id: 1,
    name: 'Daniel Brooks',
    department: 'Operations',
    email: 'daniel.brooks@fieldservice.com',
    phone: '+1 555-0114',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Rosa Diaz',
    department: 'Customer Success',
    email: 'rosa.diaz@fieldservice.com',
    phone: '+1 555-0133',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Owen Smith',
    department: 'Finance',
    email: 'owen.smith@fieldservice.com',
    phone: '+1 555-0188',
    status: 'Pending',
  },
];

const Manager = () => {
  // -----------------------------
  // Managers
  // -----------------------------
  const [managers, setManagers] = useState<ManagerData[]>([]);

  // -----------------------------
  // Search
  // -----------------------------
  const [search, setSearch] = useState('');

  // -----------------------------
  // Dialog
  // -----------------------------
  const [dialogOpen, setDialogOpen] = useState(false);

  const [dialogMode, setDialogMode] = useState<
    'add' | 'edit' | 'view'
  >('add');

  const [selectedManager, setSelectedManager] =
    useState<ManagerData | null>(null);

  // -----------------------------
  // Form
  // -----------------------------
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    email: '',
    phone: '',
    status: 'Active' as 'Active' | 'Pending',
  });

  // -----------------------------
  // Load managers
  // -----------------------------
  useEffect(() => {
    const savedManagers = localStorage.getItem('managers');

    if (savedManagers) {
      try {
        setManagers(JSON.parse(savedManagers));
      } catch (error) {
        console.error('Failed to load managers:', error);
        setManagers(defaultManagers);
      }
    } else {
      setManagers(defaultManagers);
      localStorage.setItem(
        'managers',
        JSON.stringify(defaultManagers)
      );
    }
  }, []);

  // -----------------------------
  // Save managers to localStorage
  // -----------------------------
  const saveManagers = (updatedManagers: ManagerData[]) => {
    setManagers(updatedManagers);

    localStorage.setItem(
      'managers',
      JSON.stringify(updatedManagers)
    );
  };

  // -----------------------------
  // Search
  // -----------------------------
  const filteredManagers = managers.filter((manager) => {
    const searchText = search.toLowerCase();

    return (
      manager.name.toLowerCase().includes(searchText) ||
      manager.department.toLowerCase().includes(searchText) ||
      manager.email.toLowerCase().includes(searchText) ||
      manager.phone.toLowerCase().includes(searchText) ||
      manager.status.toLowerCase().includes(searchText)
    );
  });

  // -----------------------------
  // Open Add Manager
  // -----------------------------
  const handleAdd = () => {
    setDialogMode('add');

    setFormData({
      name: '',
      department: '',
      email: '',
      phone: '',
      status: 'Active',
    });

    setSelectedManager(null);
    setDialogOpen(true);
  };

  // -----------------------------
  // Open View
  // -----------------------------
  const handleView = (manager: ManagerData) => {
    setSelectedManager(manager);
    setDialogMode('view');
    setDialogOpen(true);
  };

  // -----------------------------
  // Open Edit
  // -----------------------------
  const handleEdit = (manager: ManagerData) => {
    setSelectedManager(manager);

    setFormData({
      name: manager.name,
      department: manager.department,
      email: manager.email,
      phone: manager.phone,
      status: manager.status,
    });

    setDialogMode('edit');
    setDialogOpen(true);
  };

  // -----------------------------
  // Delete
  // -----------------------------
  const handleDelete = (id: number) => {
    const manager = managers.find((item) => item.id === id);

    if (!manager) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${manager.name}?`
    );

    if (!confirmed) return;

    const updatedManagers = managers.filter(
      (item) => item.id !== id
    );

    saveManagers(updatedManagers);
  };

  // -----------------------------
  // Save Add / Edit
  // -----------------------------
  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.department.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      alert('Please fill all fields.');
      return;
    }

    // ADD
    if (dialogMode === 'add') {
      const newManager: ManagerData = {
        id:
          managers.length > 0
            ? Math.max(...managers.map((item) => item.id)) + 1
            : 1,

        name: formData.name.trim(),
        department: formData.department.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        status: formData.status,
      };

      saveManagers([...managers, newManager]);

      setDialogOpen(false);

      return;
    }

    // EDIT
    if (dialogMode === 'edit' && selectedManager) {
      const updatedManagers = managers.map((manager) =>
        manager.id === selectedManager.id
          ? {
              ...manager,
              name: formData.name.trim(),
              department: formData.department.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              status: formData.status,
            }
          : manager
      );

      saveManagers(updatedManagers);

      setDialogOpen(false);
    }
  };

  // -----------------------------
  // Close Dialog
  // -----------------------------
  const handleClose = () => {
    setDialogOpen(false);
    setSelectedManager(null);
  };

  // -----------------------------
  // Form Change
  // -----------------------------
  const handleChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: '100vh',
        backgroundColor: '#f7f8fb',
      }}
    >
      {/* =========================
          HEADER
      ========================== */}
      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700 }}
              >
                Manager Directory
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Keep leadership contacts and team access organized.
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              ADD MANAGER
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* =========================
          MANAGER TABLE
      ========================== */}
      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Search */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <TextField
              fullWidth
              placeholder="Search managers by name, department, email or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="outlined"
              onClick={() => setSearch('')}
              sx={{ minWidth: 120 }}
            >
              CLEAR
            </Button>
          </Stack>

          {/* Result count */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Showing {filteredManagers.length} manager
            {filteredManagers.length !== 1 ? 's' : ''}
          </Typography>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              backgroundColor: 'transparent',
              overflowX: 'auto',
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: '#f7f9fc',
                  }}
                >
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredManagers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 5 }}
                    >
                      <Typography color="text.secondary">
                        No managers found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredManagers.map((manager) => (
                    <TableRow
                      key={manager.id}
                      hover
                    >
                      {/* Name */}
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              bgcolor: 'secondary.light',
                              color: 'secondary.main',
                            }}
                          >
                            {manager.name
                              .charAt(0)
                              .toUpperCase()}
                          </Avatar>

                          <Typography fontWeight={600}>
                            {manager.name}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Department */}
                      <TableCell>
                        {manager.department}
                      </TableCell>

                      {/* Email */}
                      <TableCell>
                        {manager.email}
                      </TableCell>

                      {/* Phone */}
                      <TableCell>
                        {manager.phone}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={manager.status}
                          color={
                            manager.status === 'Active'
                              ? 'success'
                              : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.5}
                        >
                          {/* VIEW */}
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleView(manager)
                            }
                            title="View Manager"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>

                          {/* EDIT */}
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleEdit(manager)
                            }
                            title="Edit Manager"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          {/* DELETE */}
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDelete(manager.id)
                            }
                            title="Delete Manager"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* =========================
          ADD / EDIT / VIEW DIALOG
      ========================== */}
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={700}>
              {dialogMode === 'add'
                ? 'Add Manager'
                : dialogMode === 'edit'
                ? 'Edit Manager'
                : 'Manager Details'}
            </Typography>

            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          {dialogMode === 'view' && selectedManager ? (
            /* =========================
               VIEW MODE
            ========================== */
            <Stack spacing={2.5}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    fontSize: 24,
                  }}
                >
                  {selectedManager.name
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    {selectedManager.name}
                  </Typography>

                  <Chip
                    label={selectedManager.status}
                    color={
                      selectedManager.status === 'Active'
                        ? 'success'
                        : 'warning'
                    }
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Stack>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Department
                </Typography>

                <Typography fontWeight={600}>
                  {selectedManager.department}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Email
                </Typography>

                <Typography fontWeight={600}>
                  {selectedManager.email}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Phone
                </Typography>

                <Typography fontWeight={600}>
                  {selectedManager.phone}
                </Typography>
              </Box>
            </Stack>
          ) : (
            /* =========================
               ADD / EDIT FORM
            ========================== */
            <Stack spacing={2.5}>
              <TextField
                label="Manager Name"
                value={formData.name}
                onChange={(e) =>
                  handleChange('name', e.target.value)
                }
                fullWidth
                required
              />

              <TextField
                label="Department"
                value={formData.department}
                onChange={(e) =>
                  handleChange(
                    'department',
                    e.target.value
                  )
                }
                fullWidth
                required
              />

              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  handleChange('email', e.target.value)
                }
                fullWidth
                required
              />

              <TextField
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  handleChange('phone', e.target.value)
                }
                fullWidth
                required
              />

              <TextField
                select
                label="Status"
                value={formData.status}
                onChange={(e) =>
                  handleChange(
                    'status',
                    e.target.value
                  )
                }
                fullWidth
              >
                <MenuItem value="Active">
                  Active
                </MenuItem>

                <MenuItem value="Pending">
                  Pending
                </MenuItem>
              </TextField>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            {dialogMode === 'view' ? 'CLOSE' : 'CANCEL'}
          </Button>

          {dialogMode !== 'view' && (
            <Button
              variant="contained"
              onClick={handleSave}
            >
              {dialogMode === 'add'
                ? 'ADD MANAGER'
                : 'SAVE CHANGES'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Manager;