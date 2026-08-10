 import React, { useEffect, useMemo, useState } from "react";
import {
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
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/customerService";

import type {
  Customer,
  CustomerFormValues,
} from "../../types/customer";

const emptyForm: CustomerFormValues = {
  customerName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [openFilterDialog, setOpenFilterDialog] = useState(false);
const [filterCity, setFilterCity] = useState("");
const [filterState, setFilterState] = useState("");
const [appliedCity, setAppliedCity] = useState("");
const [appliedState, setAppliedState] = useState("");

  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [form, setForm] =
    useState<CustomerFormValues>(emptyForm);

  const [errors, setErrors] = useState<
    Partial<Record<keyof CustomerFormValues, string>>
  >({});

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const rowsPerPage = 10;

  const showSnackbar = (
    message: string,
    type: "success" | "error"
  ) => {
    setSnackbar({
      open: true,
      message,
      type,
    });

    setTimeout(() => {
      setSnackbar((prev) => ({
        ...prev,
        open: false,
      }));
    }, 3000);
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const response = await getCustomers(
    page - 1,
    rowsPerPage,
    search,
    appliedCity,
    appliedState
);

      setCustomers(response.content);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to load customers:", error);

      showSnackbar(
        "Failed to load customers.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [page]);

  const filteredCustomers = useMemo(() => {
  const query = search.trim().toLowerCase();
  const city = appliedCity.trim().toLowerCase();
  const state = appliedState.trim().toLowerCase();

  return customers.filter((customer) => {
    // Search filter
    const matchesSearch =
      !query ||
      [
        customer.id.toString(),
        customer.customerName,
        customer.email,
        customer.phone,
        customer.city,
        customer.state,
      ].some((value) =>
        value.toLowerCase().includes(query)
      );

    // City filter
    const matchesCity =
      !city ||
      customer.city.toLowerCase().includes(city);

    // State filter
    const matchesState =
      !state ||
      customer.state.toLowerCase().includes(state);

    return matchesSearch && matchesCity && matchesState;
  });
}, [
  customers,
  search,
  appliedCity,
  appliedState,
]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setErrors({});
    setOpenFormDialog(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);

    setForm({
      customerName: customer.customerName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
    });

    setErrors({});
    setOpenFormDialog(true);
  };

  const handleOpenView = async (customer: Customer) => {
    try {
      const response = await getCustomerById(customer.id);

      setSelectedCustomer(response);
      setOpenViewDialog(true);
    } catch (error) {
      console.error("Failed to fetch customer:", error);

      showSnackbar(
        "Failed to load customer details.",
        "error"
      );
    }
  };

  const handleOpenDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDeleteDialog(true);
  };

  const validateForm = () => {
    const newErrors: Partial<
      Record<keyof CustomerFormValues, string>
    > = {};

    if (!form.customerName.trim()) {
      newErrors.customerName =
        "Customer name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email = "Invalid email format";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone =
        "Phone number must be exactly 10 digits";
    }

    if (!form.address.trim()) {
      newErrors.address =
        "Address is required";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!form.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!form.pincode.trim()) {
      newErrors.pincode =
        "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(form.pincode)) {
      newErrors.pincode =
        "Pincode must be exactly 6 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (
    field: keyof CustomerFormValues,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSaveCustomer = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (editingCustomer) {
        await updateCustomer(
          editingCustomer.id,
          form
        );

        showSnackbar(
          "Customer updated successfully.",
          "success"
        );
      } else {
        await createCustomer(form);

        showSnackbar(
          "Customer created successfully.",
          "success"
        );
      }

      setOpenFormDialog(false);
      setForm(emptyForm);
      setEditingCustomer(null);

      await loadCustomers();
    } catch (error: any) {
      console.error(
        "Failed to save customer:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Failed to save customer.";

      showSnackbar(message, "error");
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) {
      return;
    }

    try {
      await deleteCustomer(selectedCustomer.id);

      showSnackbar(
        "Customer deleted successfully.",
        "success"
      );

      setOpenDeleteDialog(false);
      setSelectedCustomer(null);

      if (
        customers.length === 1 &&
        page > 1
      ) {
        setPage((prev) => prev - 1);
      } else {
        await loadCustomers();
      }
    } catch (error: any) {
      console.error(
        "Failed to delete customer:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Failed to delete customer.";

      showSnackbar(message, "error");
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    setSearch("");
  };

  const handleOpenFilter = () => {
  setFilterCity(appliedCity);
  setFilterState(appliedState);
  setOpenFilterDialog(true);
};

const handleApplyFilter = () => {
  setAppliedCity(filterCity);
  setAppliedState(filterState);
  setOpenFilterDialog(false);
  setPage(1);
};

const handleClearFilter = () => {
  setFilterCity("");
  setFilterState("");
  setAppliedCity("");
  setAppliedState("");
  setOpenFilterDialog(false);
  setPage(1);
};

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
        backgroundColor: "#f4f6fa",
      }}
    >
      <Stack spacing={3}>
        {/* Header */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              backgroundColor: "#fff",
              p: { xs: 3, md: 4 },
            }}
          >
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                md: "center",
              }}
              spacing={3}
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  Customer Management
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Manage customer information
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenAdd}
              >
                Add Customer
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Customer Table */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
            overflow: "hidden",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, md: 4 },
            }}
          >
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "stretch",
                md: "center",
              }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <TextField
                fullWidth
                placeholder="Search customers by name, email, or ID"
                variant="outlined"
                size="small"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: {
                    md: 360,
                  },
                }}
              />

               <Button
  variant="outlined"
  color="primary"
  startIcon={<FilterListIcon />}
  onClick={handleOpenFilter}
>
  Filter
</Button>
            </Stack>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                backgroundColor: "transparent",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#f7f9fc",
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontWeight: 700,
                      }}
                    >
                      Customer ID
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontWeight: 700,
                      }}
                    >
                      Customer Name
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontWeight: 700,
                      }}
                    >
                      Email
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontWeight: 700,
                      }}
                    >
                      Phone
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontWeight: 700,
                      }}
                    >
                      City
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontWeight: 700,
                      }}
                    >
                      State
                    </TableCell>

                    <TableCell
                      sx={{
                        color: "text.secondary",
                        fontWeight: 700,
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    Array.from({
                      length: rowsPerPage,
                    }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({
                          length: 7,
                        }).map(
                          (_, cellIndex) => (
                            <TableCell
                              key={cellIndex}
                            >
                              <Skeleton />
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))
                  ) : filteredCustomers.length >
                    0 ? (
                    filteredCustomers.map(
                      (customer) => (
                        <TableRow
                          key={customer.id}
                          sx={{
                            "&:hover": {
                              backgroundColor:
                                "action.hover",
                            },
                          }}
                        >
                          <TableCell>
                            {customer.id}
                          </TableCell>

                          <TableCell>
                            {customer.customerName}
                          </TableCell>

                          <TableCell>
                            {customer.email}
                          </TableCell>

                          <TableCell>
                            {customer.phone}
                          </TableCell>

                          <TableCell>
                            {customer.city}
                          </TableCell>

                          <TableCell>
                            {customer.state}
                          </TableCell>

                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1}
                            >
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  handleOpenView(
                                    customer
                                  )
                                }
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>

                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  handleOpenEdit(
                                    customer
                                  )
                                }
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>

                              <IconButton
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleOpenDelete(
                                    customer
                                  )
                                }
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{ py: 8 }}
                      >
                        <Stack
                          alignItems="center"
                          spacing={1}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                          >
                            No customers found
                          </Typography>

                          <Typography color="text.secondary">
                            Add a customer to begin
                            managing your accounts
                            in the platform.
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {!loading &&
              totalPages > 1 && (
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  sx={{ mt: 3 }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={
                      handlePageChange
                    }
                    color="primary"
                    shape="rounded"
                  />
                </Stack>
              )}
          </CardContent>
        </Card>
      </Stack>

      {/* Add / Edit Dialog */}

      {/* Filter Dialog */}
<Dialog
  open={openFilterDialog}
  onClose={() => setOpenFilterDialog(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>
    Filter Customers

    <IconButton
      onClick={() => setOpenFilterDialog(false)}
      sx={{
        position: "absolute",
        right: 8,
        top: 8,
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers>
    <Stack spacing={2.5} sx={{ pt: 1 }}>

      <TextField
        label="City"
        placeholder="Enter city"
        fullWidth
        value={filterCity}
        onChange={(e) => setFilterCity(e.target.value)}
      />

      <TextField
        label="State"
        placeholder="Enter state"
        fullWidth
        value={filterState}
        onChange={(e) => setFilterState(e.target.value)}
      />

    </Stack>
  </DialogContent>

  <DialogActions sx={{ p: 2 }}>

    <Button
      variant="outlined"
      onClick={handleClearFilter}
    >
      Clear Filters
    </Button>

    <Button
      variant="contained"
      onClick={handleApplyFilter}
    >
      Apply Filter
    </Button>

  </DialogActions>
</Dialog>
      <Dialog
        open={openFormDialog}
        onClose={() =>
          setOpenFormDialog(false)
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {editingCustomer
            ? "Edit Customer"
            : "Add Customer"}

          <IconButton
            onClick={() =>
              setOpenFormDialog(false)
            }
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Customer Name"
              fullWidth
              value={form.customerName}
              onChange={(e) =>
                handleFormChange(
                  "customerName",
                  e.target.value
                )
              }
              error={
                !!errors.customerName
              }
              helperText={
                errors.customerName
              }
            />

            <TextField
              label="Email"
              fullWidth
              value={form.email}
              onChange={(e) =>
                handleFormChange(
                  "email",
                  e.target.value
                )
              }
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              label="Phone"
              fullWidth
              value={form.phone}
              onChange={(e) =>
                handleFormChange(
                  "phone",
                  e.target.value
                )
              }
              error={!!errors.phone}
              helperText={errors.phone}
              inputProps={{
                maxLength: 10,
              }}
            />

            <TextField
              label="Address"
              fullWidth
              multiline
              minRows={2}
              value={form.address}
              onChange={(e) =>
                handleFormChange(
                  "address",
                  e.target.value
                )
              }
              error={!!errors.address}
              helperText={errors.address}
            />

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <TextField
                label="City"
                fullWidth
                value={form.city}
                onChange={(e) =>
                  handleFormChange(
                    "city",
                    e.target.value
                  )
                }
                error={!!errors.city}
                helperText={errors.city}
              />

              <TextField
                label="State"
                fullWidth
                value={form.state}
                onChange={(e) =>
                  handleFormChange(
                    "state",
                    e.target.value
                  )
                }
                error={!!errors.state}
                helperText={errors.state}
              />
            </Stack>

            <TextField
              label="Pincode"
              fullWidth
              value={form.pincode}
              onChange={(e) =>
                handleFormChange(
                  "pincode",
                  e.target.value
                )
              }
              error={!!errors.pincode}
              helperText={errors.pincode}
              inputProps={{
                maxLength: 6,
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() =>
              setOpenFormDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSaveCustomer}
          >
            {editingCustomer
              ? "Save Changes"
              : "Create Customer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() =>
          setOpenViewDialog(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Customer Details

          <IconButton
            onClick={() =>
              setOpenViewDialog(false)
            }
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {selectedCustomer && (
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Customer ID
                </Typography>

                <Typography>
                  {selectedCustomer.id}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Customer Name
                </Typography>

                <Typography>
                  {
                    selectedCustomer.customerName
                  }
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Email
                </Typography>

                <Typography>
                  {selectedCustomer.email}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Phone
                </Typography>

                <Typography>
                  {selectedCustomer.phone}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Address
                </Typography>

                <Typography>
                  {
                    selectedCustomer.address
                  }
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={4}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    City
                  </Typography>

                  <Typography>
                    {selectedCustomer.city}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    State
                  </Typography>

                  <Typography>
                    {selectedCustomer.state}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Pincode
                  </Typography>

                  <Typography>
                    {
                      selectedCustomer.pincode
                    }
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpenViewDialog(false)
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() =>
          setOpenDeleteDialog(false)
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Delete Customer
        </DialogTitle>

        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {
                selectedCustomer?.customerName
              }
            </strong>
            ?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() =>
              setOpenDeleteDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteCustomer}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snackbar.open && (
        <Chip
          label={snackbar.message}
          color={
            snackbar.type === "success"
              ? "success"
              : "error"
          }
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 2000,
            px: 1,
          }}
        />
      )}
    </Box>
  );
};

export default CustomerPage;