import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Paper,
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
import { getSites } from '../../services/siteService';
import {
  assignTechnician,
  createWorkOrder,
  deleteWorkOrder,
  getTechnicians,
  getWorkOrders,
  updateWorkOrder,
} from '../../services/workOrderService';
import type { Site } from '../../types/site';
import type { TechnicianOption, WorkOrder as WorkOrderRecord, WorkOrderFormValues } from '../../types/workOrder';

const rowsPerPage = 5;

const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];
const statusOptions = ['Open', 'In Progress', 'Pending', 'Completed', 'Closed'];

const createEmptyFormValues = (): WorkOrderFormValues => ({
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Open',
  siteId: '',
  technicianId: '',
});

const getFormErrors = (values: WorkOrderFormValues) => {
  const errors: Partial<Record<keyof WorkOrderFormValues, string>> = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required';
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!values.priority) {
    errors.priority = 'Priority is required';
  }

  if (!values.status) {
    errors.status = 'Status is required';
  }

  if (!values.siteId) {
    errors.siteId = 'Site is required';
  }

  return errors;
};

const formatDate = (value?: string) => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

function WorkOrderPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrderRecord[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrderRecord | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formValues, setFormValues] = useState<WorkOrderFormValues>(createEmptyFormValues());
  const [errors, setErrors] = useState<Partial<Record<keyof WorkOrderFormValues, string>>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadData = async () => {
    setLoading(true);

    try {
      const [workOrderResponse, siteResponse, technicianResponse] = await Promise.all([
        getWorkOrders(0, 100),
        getSites(0, 100),
        getTechnicians(),
      ]);

      setWorkOrders(workOrderResponse.content ?? []);
      setSites(siteResponse.content ?? []);
      setTechnicians(technicianResponse);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load work orders.';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, priorityFilter]);

  const filteredWorkOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return workOrders.filter((workOrder) => {
      const matchesStatus = statusFilter === 'all' || workOrder.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || workOrder.priority === priorityFilter;
      const matchesQuery =
        !query ||
        [workOrder.title, workOrder.description, workOrder.siteName, workOrder.technicianName, workOrder.status, workOrder.priority]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(query));

      return matchesStatus && matchesPriority && matchesQuery;
    });
  }, [priorityFilter, search, statusFilter, workOrders]);

  const pageCount = Math.max(1, Math.ceil(filteredWorkOrders.length / rowsPerPage));

  const visibleRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredWorkOrders.slice(start, start + rowsPerPage);
  }, [filteredWorkOrders, page]);

  const handleCloseSnackbar = () => {
    setSnackbar((current) => ({ ...current, open: false }));
  };

  const handleOpenCreateDialog = () => {
    setDialogMode('create');
    setSelectedWorkOrder(null);
    setFormValues(createEmptyFormValues());
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenViewDialog = (workOrder: WorkOrderRecord) => {
    setDialogMode('view');
    setSelectedWorkOrder(workOrder);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (workOrder: WorkOrderRecord) => {
    setDialogMode('edit');
    setSelectedWorkOrder(workOrder);
    setFormValues({
      title: workOrder.title,
      description: workOrder.description,
      priority: workOrder.priority,
      status: workOrder.status,
      siteId: workOrder.siteId ? String(workOrder.siteId) : '',
      technicianId: workOrder.technicianId ? String(workOrder.technicianId) : '',
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWorkOrder(null);
    setErrors({});
  };

  const handleFieldChange = (field: keyof WorkOrderFormValues) => (
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
      let savedWorkOrder: WorkOrderRecord;

      if (dialogMode === 'edit' && selectedWorkOrder) {
        savedWorkOrder = await updateWorkOrder(selectedWorkOrder.id, formValues);
        setSnackbar({ open: true, message: 'Work order updated successfully.', severity: 'success' });
      } else {
        savedWorkOrder = await createWorkOrder(formValues);
        setSnackbar({ open: true, message: 'Work order created successfully.', severity: 'success' });
      }

      if (formValues.technicianId) {
        await assignTechnician(savedWorkOrder.id, Number(formValues.technicianId));
      }

      await loadData();
      setPage(1);
      setSearch('');
      setStatusFilter('all');
      setPriorityFilter('all');
      handleCloseDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save work order.';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (workOrder: WorkOrderRecord) => {
    setSelectedWorkOrder(workOrder);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedWorkOrder) {
      return;
    }

    try {
      await deleteWorkOrder(selectedWorkOrder.id);
      setSnackbar({ open: true, message: 'Work order deleted successfully.', severity: 'success' });
      setOpenDeleteDialog(false);
      setSelectedWorkOrder(null);
      await loadData();
      setPage(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete work order.';
      setSnackbar({ open: true, message, severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh', backgroundColor: '#f4f6fa' }}>
      <Stack spacing={3}>
        <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
          <CardContent sx={{ backgroundColor: '#fff', p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={3}>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Work Order Management
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Manage work orders, assignments, priorities, and statuses.
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateDialog}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Add Work Order
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search by title, site, technician, or status"
                variant="outlined"
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
                sx={{ minWidth: { md: 360 } }}
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FilterListIcon />}
                  onClick={(event) => setFilterAnchorEl(event.currentTarget)}
                >
                  Filter
                </Button>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
                  Add Work Order
                </Button>
              </Stack>
            </Stack>

            <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={() => setFilterAnchorEl(null)}>
              <MenuItem
                onClick={() => {
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setFilterAnchorEl(null);
                }}
              >
                All work orders
              </MenuItem>
              <MenuItem onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setFilterAnchorEl(null); }}>
                Clear filters
              </MenuItem>
              <MenuItem onClick={() => { setStatusFilter('Open'); setFilterAnchorEl(null); }}>
                Status: Open
              </MenuItem>
              <MenuItem onClick={() => { setStatusFilter('In Progress'); setFilterAnchorEl(null); }}>
                Status: In Progress
              </MenuItem>
              <MenuItem onClick={() => { setStatusFilter('Completed'); setFilterAnchorEl(null); }}>
                Status: Completed
              </MenuItem>
              <MenuItem onClick={() => { setPriorityFilter('High'); setFilterAnchorEl(null); }}>
                Priority: High
              </MenuItem>
              <MenuItem onClick={() => { setPriorityFilter('Medium'); setFilterAnchorEl(null); }}>
                Priority: Medium
              </MenuItem>
            </Menu>

            <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f7f9fc' }}>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Work Order ID</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Title</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Site</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Priority</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Assigned Technician</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    Array.from({ length: rowsPerPage }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: 8 }).map((__, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : visibleRows.length > 0 ? (
                    visibleRows.map((workOrder) => (
                      <TableRow key={workOrder.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                        <TableCell>{workOrder.id}</TableCell>
                        <TableCell>{workOrder.title}</TableCell>
                        <TableCell>{workOrder.siteName || '—'}</TableCell>
                        <TableCell>{workOrder.priority}</TableCell>
                        <TableCell>{workOrder.status}</TableCell>
                        <TableCell>{workOrder.technicianName || 'Unassigned'}</TableCell>
                        <TableCell>{formatDate(workOrder.createdAt)}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton size="small" color="primary" onClick={() => handleOpenViewDialog(workOrder)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(workOrder)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(workOrder)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ py: 8 }}>
                        <Stack alignItems="center" spacing={1}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            No work orders found
                          </Typography>
                          <Typography color="text.secondary">
                            Add a work order or adjust your search and filters to get started.
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" justifyContent="end" sx={{ mt: 3 }}>
              <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="primary" shape="rounded" />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{dialogMode === 'create' ? 'Add Work Order' : dialogMode === 'edit' ? 'Edit Work Order' : 'Work Order Details'}</span>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {dialogMode === 'view' && selectedWorkOrder ? (
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedWorkOrder.title}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">{selectedWorkOrder.description}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Site
                </Typography>
                <Typography variant="body1">{selectedWorkOrder.siteName || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Priority / Status
                </Typography>
                <Typography variant="body1">{`${selectedWorkOrder.priority} • ${selectedWorkOrder.status}`}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Assigned Technician
                </Typography>
                <Typography variant="body1">{selectedWorkOrder.technicianName || 'Unassigned'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Created Date
                </Typography>
                <Typography variant="body1">{formatDate(selectedWorkOrder.createdAt)}</Typography>
              </Box>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <TextField
                label="Title"
                fullWidth
                value={formValues.title}
                onChange={handleFieldChange('title')}
                error={Boolean(errors.title)}
                helperText={errors.title}
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                minRows={3}
                value={formValues.description}
                onChange={handleFieldChange('description')}
                error={Boolean(errors.description)}
                helperText={errors.description}
              />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth error={Boolean(errors.priority)}>
                  <InputLabel id="priority-select-label">Priority</InputLabel>
                  <Select labelId="priority-select-label" label="Priority" value={formValues.priority} onChange={handleFieldChange('priority')}>
                    {priorityOptions.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.priority ? <Typography color="error.main" variant="caption">{errors.priority}</Typography> : null}
                </FormControl>
                <FormControl fullWidth error={Boolean(errors.status)}>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Select labelId="status-select-label" label="Status" value={formValues.status} onChange={handleFieldChange('status')}>
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status ? <Typography color="error.main" variant="caption">{errors.status}</Typography> : null}
                </FormControl>
              </Stack>
              <FormControl fullWidth error={Boolean(errors.siteId)}>
                <InputLabel id="site-select-label">Site</InputLabel>
                <Select labelId="site-select-label" label="Site" value={formValues.siteId} onChange={handleFieldChange('siteId')}>
                  {sites.map((site) => (
                    <MenuItem key={site.id} value={String(site.id)}>
                      {site.siteName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.siteId ? <Typography color="error.main" variant="caption">{errors.siteId}</Typography> : null}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="technician-select-label">Assigned Technician</InputLabel>
                <Select labelId="technician-select-label" label="Assigned Technician" value={formValues.technicianId} onChange={handleFieldChange('technicianId')}>
                  <MenuItem value="">Unassigned</MenuItem>
                  {technicians.map((technician) => (
                    <MenuItem key={technician.id} value={String(technician.id)}>
                      {technician.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogMode !== 'view' ? (
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={saving}>
              {saving ? 'Saving...' : dialogMode === 'edit' ? 'Save Changes' : 'Create Work Order'}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Work Order</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete <strong>{selectedWorkOrder?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default WorkOrderPage;