import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  Alert,
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
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Popover,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  createTechnician,
  deleteTechnician,
  getTechnicianById,
  getTechnicians,
  updateTechnician,
} from '../../services/technicianService';
import type { Technician as TechnicianRecord, TechnicianFormValues } from '../../types/technician';

const rowsPerPage = 5;
const technicianStatusOptions = ['Available', 'On Site', 'Off Duty'];

const createEmptyFormValues = (): TechnicianFormValues => ({
  fullName: '',
  email: '',
  phone: '',
  skills: '',
  status: '',
});

const getFormErrors = (values: TechnicianFormValues) => {
  const errors: Partial<Record<keyof TechnicianFormValues, string>> = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Invalid email format';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[+]?[-\d()\s]{7,20}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number';
  }

  if (!values.skills.trim()) {
    errors.skills = 'Skills are required';
  }

  if (!values.status) {
    errors.status = 'Status is required';
  }

  return errors;
};

const Technician = () => {
  const [technicians, setTechnicians] = useState<TechnicianRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  const [statusFilter, setStatusFilter] = useState('all');
const [skillsFilter, setSkillsFilter] = useState('');
const [pendingSkillsFilter, setPendingSkillsFilter] = useState('');

  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianRecord | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formValues, setFormValues] = useState<TechnicianFormValues>(createEmptyFormValues());
  const [errors, setErrors] = useState<Partial<Record<keyof TechnicianFormValues, string>>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
    window.setTimeout(() => {
      setSnackbar((current) => ({ ...current, open: false }));
    }, 3000);
  };

  const loadTechnicians = async () => {
    setLoading(true);

    try {
      const response = await getTechnicians(0, 100);
      setTechnicians(response.content ?? []);
    } catch (error) {
      console.error('Failed to load technicians:', error);
      showSnackbar('Failed to load technicians.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTechnicians();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, skillsFilter]);

  const filteredTechnicians = useMemo(() => {
    const query = search.trim().toLowerCase();
    const skillQuery = skillsFilter.trim().toLowerCase();

    return technicians.filter((technician) => {
      const matchesStatus = statusFilter === 'all' || technician.status === statusFilter;
       const matchesSkill =
  !skillQuery ||
  String(technician.skills ?? '').toLowerCase().includes(skillQuery);
      const matchesQuery =
        !query ||
         [
  technician.fullName,
  technician.email,
  technician.phone,
  technician.skills,
  technician.status,
]
  .filter(Boolean)
  .some((value) => String(value).toLowerCase().includes(query));
      return matchesStatus && matchesSkill && matchesQuery;
    });
  }, [search, skillsFilter, statusFilter, technicians]);

  const pageCount = Math.max(1, Math.ceil(filteredTechnicians.length / rowsPerPage));

  const visibleRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredTechnicians.slice(start, start + rowsPerPage);
  }, [filteredTechnicians, page]);

  const handleCloseSnackbar = () => {
    setSnackbar((current) => ({ ...current, open: false }));
  };

  const handleOpenCreateDialog = () => {
    setDialogMode('create');
    setSelectedTechnician(null);
    setFormValues(createEmptyFormValues());
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenViewDialog = async (technician: TechnicianRecord) => {
    setDialogMode('view');
    setOpenDialog(true);

    try {
      const response = await getTechnicianById(technician.id);
      setSelectedTechnician(response);
    } catch (error) {
      console.error('Failed to load technician:', error);
      showSnackbar('Failed to load technician details.', 'error');
      setOpenDialog(false);
    }
  };

  const handleOpenEditDialog = (technician: TechnicianRecord) => {
    setDialogMode('edit');
    setSelectedTechnician(technician);
    setFormValues({
      fullName: technician.fullName,
      email: technician.email,
      phone: technician.phone,
      skills: technician.skills,
      status: technician.status,
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (technician: TechnicianRecord) => {
    setSelectedTechnician(technician);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTechnician(null);
    setErrors({});
  };

  const handleFieldChange = (field: keyof TechnicianFormValues) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent,
  ) => {
    const value = event.target.value;
    setFormValues((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = getFormErrors(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);

    try {
      if (dialogMode === 'edit' && selectedTechnician) {
        await updateTechnician(selectedTechnician.id, formValues);
        showSnackbar('Technician updated successfully.', 'success');
      } else {
        await createTechnician(formValues);
        showSnackbar('Technician created successfully.', 'success');
      }

      await loadTechnicians();
      setPage(1);
      handleCloseDialog();
    } catch (error: unknown) {
      console.error('Failed to save technician:', error);
      const message = error instanceof Error ? error.message : 'Unable to save technician.';
      showSnackbar(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTechnician) {
      return;
    }

    try {
      await deleteTechnician(selectedTechnician.id);
      showSnackbar('Technician deleted successfully.', 'success');
      await loadTechnicians();
      setPage(1);
    } catch (error: unknown) {
      console.error('Failed to delete technician:', error);
      const message = error instanceof Error ? error.message : 'Unable to delete technician.';
      showSnackbar(message, 'error');
    } finally {
      setOpenDeleteDialog(false);
      setSelectedTechnician(null);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', backgroundColor: '#f7f8fb' }}>
      <Stack spacing={3}>
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Technician Management
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Manage field staffing and technician assignments.
                </Typography>
              </Box>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
                Add Technician
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search technicians"
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: 360 }}
              />
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FilterListIcon />}
                 onClick={(event) => {
  setPendingSkillsFilter(skillsFilter);
  setFilterAnchorEl(event.currentTarget);
}}
              >
                Filter
              </Button>
            </Stack>

            <Popover
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={() => setFilterAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              PaperProps={{ sx: { p: 2, minWidth: 260 } }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Status
              </Typography>
              <MenuItem
                selected={statusFilter === 'all'}
                onClick={() => {
                  setStatusFilter('all');
                  setFilterAnchorEl(null);
                }}
              >
                All
              </MenuItem>
              {technicianStatusOptions.map((status) => (
                <MenuItem
                  key={status}
                  selected={statusFilter === status}
                  onClick={() => {
                    setStatusFilter(status);
                    setFilterAnchorEl(null);
                  }}
                >
                  {status}
                </MenuItem>
              ))}
              <Box sx={{ mt: 2 }}>
                 <TextField
  fullWidth
  placeholder="Skills contains"
  size="small"
  value={pendingSkillsFilter}
  onChange={(event) => setPendingSkillsFilter(event.target.value)}
/>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  color="primary"
                   onClick={() => {
  setStatusFilter('all');
  setSkillsFilter('');
  setPendingSkillsFilter('');
  setFilterAnchorEl(null);
}}
                >
                  Clear
                </Button>
                 <Button
  variant="contained"
  onClick={() => {
    setSkillsFilter(pendingSkillsFilter);
    setFilterAnchorEl(null);
  }}
>
  Apply
</Button>
              </Box>
            </Popover>

            <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f7f9fc' }}>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Skills</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned Orders</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    Array.from({ length: rowsPerPage }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: 7 }).map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton animation="wave" height={24} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : visibleRows.length > 0 ? (
                    visibleRows.map((technician) => (
                      <TableRow key={technician.id} hover>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                              {technician.fullName.charAt(0)}
                            </Avatar>
                            <Typography fontWeight={600}>{technician.fullName}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{technician.email}</TableCell>
                        <TableCell>{technician.phone}</TableCell>
                         <TableCell>{technician.skills || '—'}</TableCell>
                        <TableCell>
                          <Chip
                            label={technician.status}
                            color={technician.status === 'Available' ? 'success' : 'primary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{technician.assignedWorkOrders}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton size="small" color="primary" onClick={() => handleOpenViewDialog(technician)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(technician)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(technician)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Box sx={{ py: 8, textAlign: 'center' }}>
                          <Typography variant="body1" color="text.secondary">
                            No technicians found. Adjust search or filters to show results.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {dialogMode === 'create' && 'Add Technician'}
          {dialogMode === 'edit' && 'Edit Technician'}
          {dialogMode === 'view' && 'Technician Details'}
          <IconButton size="small" onClick={handleCloseDialog}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {dialogMode === 'view' && selectedTechnician ? (
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Technician ID: {selectedTechnician.id}
              </Typography>
              <Typography variant="body1">
                <strong>Full Name:</strong> {selectedTechnician.fullName}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedTechnician.email}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {selectedTechnician.phone}
              </Typography>
              <Typography variant="body1">
                <strong>Skills:</strong> {selectedTechnician.skills}
              </Typography>
              <Typography variant="body1">
                <strong>Status:</strong> {selectedTechnician.status}
              </Typography>
              <Typography variant="body1">
                <strong>Assigned Orders:</strong> {selectedTechnician.assignedWorkOrders}
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                name="fullName"
                value={formValues.fullName}
                onChange={handleFieldChange('fullName')}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={formValues.email}
                onChange={handleFieldChange('email')}
                error={Boolean(errors.email)}
                helperText={errors.email}
                fullWidth
              />
              <TextField
                label="Phone"
                name="phone"
                value={formValues.phone}
                onChange={handleFieldChange('phone')}
                error={Boolean(errors.phone)}
                helperText={errors.phone}
                fullWidth
              />
              <TextField
                label="Skills"
                name="skills"
                value={formValues.skills}
                onChange={handleFieldChange('skills')}
                error={Boolean(errors.skills)}
                helperText={errors.skills}
                fullWidth
              />
              <FormControl fullWidth error={Boolean(errors.status)}>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={formValues.status}
                  onChange={handleFieldChange('status')}
                  size="small"
                >
                  <MenuItem value="">Select status</MenuItem>
                  {technicianStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status ? (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                    {errors.status}
                  </Typography>
                ) : null}
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        {dialogMode !== 'view' ? (
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={saving}>
              {dialogMode === 'edit' ? 'Save Changes' : 'Create Technician'}
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Technician</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{selectedTechnician?.fullName ?? 'this technician'}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Technician;
