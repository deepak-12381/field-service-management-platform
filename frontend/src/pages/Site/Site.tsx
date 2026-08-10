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
import {
  createSite,
  deleteSite,
  getCustomersForSite,
  getSites,
  updateSite,
} from '../../services/siteService';
import type { CustomerOption, Site as SiteRecord, SiteFormValues } from '../../types/site';

const rowsPerPage = 5;

const createEmptyFormValues = (): SiteFormValues => ({
  siteName: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  customerId: '',
});

const getFormErrors = (values: SiteFormValues) => {
  const errors: Partial<Record<keyof SiteFormValues, string>> = {};

  if (!values.siteName.trim()) {
    errors.siteName = 'Site name is required';
  }

  if (!values.address.trim()) {
    errors.address = 'Address is required';
  }

  if (!values.city.trim()) {
    errors.city = 'City is required';
  }

  if (!values.state.trim()) {
    errors.state = 'State is required';
  }

  if (!values.pincode.trim()) {
    errors.pincode = 'Pincode is required';
  } else if (!/^\d{6}$/.test(values.pincode.trim())) {
    errors.pincode = 'Pincode must be exactly 6 digits';
  }

  if (!values.customerId) {
    errors.customerId = 'Customer is required';
  }

  return errors;
};

function SitePage() {
  const [sites, setSites] = useState<SiteRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [customerFilter, setCustomerFilter] = useState<number | 'all'>('all');
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedSite, setSelectedSite] = useState<SiteRecord | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formValues, setFormValues] = useState<SiteFormValues>(createEmptyFormValues());
  const [errors, setErrors] = useState<Partial<Record<keyof SiteFormValues, string>>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadData = async () => {
    setLoading(true);

    try {
      const [siteResponse, customerResponse] = await Promise.all([
        getSites(0, 100),
        getCustomersForSite(),
      ]);

      setSites(siteResponse.content ?? []);
      setCustomers(customerResponse);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load site data.';
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
  }, [search, customerFilter]);

  const filteredSites = useMemo(() => {
    const query = search.trim().toLowerCase();

    return sites.filter((site) => {
      const matchesCustomer = customerFilter === 'all' || site.customerName === customers.find((customer) => customer.id === customerFilter)?.customerName;
      const matchesQuery =
        !query ||
        [site.siteName, site.address, site.city, site.state, site.customerName]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(query));

      return matchesCustomer && matchesQuery;
    });
  }, [customerFilter, customers, search, sites]);

  const pageCount = Math.max(1, Math.ceil(filteredSites.length / rowsPerPage));

  const visibleRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredSites.slice(start, start + rowsPerPage);
  }, [filteredSites, page]);

  const handleCloseSnackbar = () => {
    setSnackbar((current) => ({ ...current, open: false }));
  };

  const handleOpenCreateDialog = () => {
    setDialogMode('create');
    setSelectedSite(null);
    setFormValues(createEmptyFormValues());
    setErrors({});
    setOpenDialog(true);
  };

  const handleOpenViewDialog = (site: SiteRecord) => {
    setDialogMode('view');
    setSelectedSite(site);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (site: SiteRecord) => {
    setDialogMode('edit');
    setSelectedSite(site);
    const matchedCustomer = customers.find((customer) => customer.customerName === site.customerName);
    setFormValues({
      siteName: site.siteName,
      address: site.address,
      city: site.city,
      state: site.state,
      pincode: site.pincode,
      customerId: matchedCustomer ? String(matchedCustomer.id) : '',
    });
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSite(null);
    setErrors({});
  };

  const handleFieldChange = (field: keyof SiteFormValues) => (
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
      if (dialogMode === 'edit' && selectedSite) {
        await updateSite(selectedSite.id, formValues);
        setSnackbar({ open: true, message: 'Site updated successfully.', severity: 'success' });
      } else {
        await createSite(formValues);
        setSnackbar({ open: true, message: 'Site created successfully.', severity: 'success' });
      }

      await loadData();
      setPage(1);
      setSearch('');
      setCustomerFilter('all');
      handleCloseDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save site.';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (site: SiteRecord) => {
    setSelectedSite(site);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSite) {
      return;
    }

    try {
      await deleteSite(selectedSite.id);
      setSnackbar({ open: true, message: 'Site deleted successfully.', severity: 'success' });
      setOpenDeleteDialog(false);
      setSelectedSite(null);
      await loadData();
      setPage(1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete site.';
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
                  Site Management
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Manage service sites and locations.
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateDialog}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Add Site
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search sites by name, address, city, state, or customer"
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
                  {customerFilter === 'all' ? 'Filter' : 'Filtered'}
                </Button>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
                  Add Site
                </Button>
              </Stack>
            </Stack>

            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={() => setFilterAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  setCustomerFilter('all');
                  setFilterAnchorEl(null);
                }}
              >
                All customers
              </MenuItem>
              {customers.map((customer) => (
                <MenuItem
                  key={customer.id}
                  onClick={() => {
                    setCustomerFilter(customer.id);
                    setFilterAnchorEl(null);
                  }}
                >
                  {customer.customerName}
                </MenuItem>
              ))}
            </Menu>

            <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f7f9fc' }}>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Site ID</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Site Name</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Address</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>City</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>State</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    Array.from({ length: rowsPerPage }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: 7 }).map((__, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : visibleRows.length > 0 ? (
                    visibleRows.map((site) => (
                      <TableRow key={site.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                        <TableCell>{site.id}</TableCell>
                        <TableCell>{site.siteName}</TableCell>
                        <TableCell>{site.customerName || '—'}</TableCell>
                        <TableCell>{site.address}</TableCell>
                        <TableCell>{site.city}</TableCell>
                        <TableCell>{site.state}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <IconButton size="small" color="primary" onClick={() => handleOpenViewDialog(site)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(site)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(site)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ py: 8 }}>
                        <Stack alignItems="center" spacing={1}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            No sites found
                          </Typography>
                          <Typography color="text.secondary">
                            Add a site or adjust your search and filter criteria to get started.
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" justifyContent="end" sx={{ mt: 3 }}>
              <Pagination count={pageCount} page={page - 1} onChange={(_, value) => setPage(value)} color="primary" shape="rounded" />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{dialogMode === 'create' ? 'Add Site' : dialogMode === 'edit' ? 'Edit Site' : 'Site Details'}</span>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {dialogMode === 'view' && selectedSite ? (
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Site Name
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {selectedSite.siteName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body1">{selectedSite.customerName || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">{selectedSite.address}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  City / State / Pincode
                </Typography>
                <Typography variant="body1">{`${selectedSite.city}, ${selectedSite.state} ${selectedSite.pincode}`}</Typography>
              </Box>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <TextField
                label="Site Name"
                fullWidth
                value={formValues.siteName}
                onChange={handleFieldChange('siteName')}
                error={Boolean(errors.siteName)}
                helperText={errors.siteName}
              />
              <FormControl fullWidth error={Boolean(errors.customerId)}>
                <InputLabel id="customer-select-label">Customer</InputLabel>
                <Select
                  labelId="customer-select-label"
                  label="Customer"
                  value={formValues.customerId}
                  onChange={handleFieldChange('customerId')}
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={String(customer.id)}>
                      {customer.customerName}
                    </MenuItem>
                  ))}
                </Select>
                {errors.customerId ? <Typography color="error.main" variant="caption">{errors.customerId}</Typography> : null}
              </FormControl>
              <TextField
                label="Address"
                fullWidth
                value={formValues.address}
                onChange={handleFieldChange('address')}
                error={Boolean(errors.address)}
                helperText={errors.address}
              />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="City"
                  fullWidth
                  value={formValues.city}
                  onChange={handleFieldChange('city')}
                  error={Boolean(errors.city)}
                  helperText={errors.city}
                />
                <TextField
                  label="State"
                  fullWidth
                  value={formValues.state}
                  onChange={handleFieldChange('state')}
                  error={Boolean(errors.state)}
                  helperText={errors.state}
                />
              </Stack>
              <TextField
                label="Pincode"
                fullWidth
                inputProps={{ maxLength: 6 }}
                value={formValues.pincode}
                onChange={handleFieldChange('pincode')}
                error={Boolean(errors.pincode)}
                helperText={errors.pincode}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogMode !== 'view' ? (
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={saving}>
              {saving ? 'Saving...' : dialogMode === 'edit' ? 'Save Changes' : 'Create Site'}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Site</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete <strong>{selectedSite?.siteName}</strong>?
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

export default SitePage;