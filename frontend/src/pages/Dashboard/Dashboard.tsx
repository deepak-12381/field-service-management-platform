import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { getWorkOrders } from "../../services/workOrderService";
import { getDashboardData, type DashboardData } from "../../services/dashboardService";
import type { WorkOrder } from "../../types/workOrder";
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  Build as BuildIcon,
  CalendarMonth as CalendarMonthIcon,
  Checklist as ChecklistIcon,
  Description as DescriptionIcon,
  Groups as GroupsIcon,
  Notifications as NotificationsIcon,
  PersonAdd as PersonAddIcon,
  Place as PlaceIcon,
  Report as ReportIcon,
  Work as WorkIcon,
} from '@mui/icons-material';

 

  
const quickActions = [
  {
    label: 'Create Customer',
    icon: <PersonAddIcon sx={{ mr: 1 }} />,
    path: '/customers',
  },
  {
    label: 'Create Site',
    icon: <PlaceIcon sx={{ mr: 1 }} />,
    path: '/sites',
  },
  {
    label: 'Create Work Order',
    icon: <WorkIcon sx={{ mr: 1 }} />,
    path: '/work-orders',
  },
  {
    label: 'Assign Technician',
    icon: <BuildIcon sx={{ mr: 1 }} />,
    path: '/work-orders',
  },
  {
    label: 'Generate Report',
    icon: <ReportIcon sx={{ mr: 1 }} />,
    path: '/reports',
  },
];

    const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentWorkOrders, setRecentWorkOrders] = useState<WorkOrder[]>([]);
  const [userName, setUserName] = useState("Administrator");
  const [userRole, setUserRole] = useState("Administrator");
  const navigate = useNavigate();

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.name) setUserName(profile.name);
        if (profile.role) setUserRole(profile.role);
      } catch (err) {
        console.error("Error reading profile:", err);
      }
    }

    const loadDashboard = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);

        const workOrderData = await getWorkOrders(0, 5);
        setRecentWorkOrders(workOrderData.content ?? []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const kpiData = [
    {
      label: "Total Customers",
      value: dashboardData?.totalCustomers ?? 0,
      icon: <GroupsIcon fontSize="medium" sx={{ color: "primary.main" }} />,
      detail: "Customer accounts tracked",
    },
    {
      label: "Total Sites",
      value: dashboardData?.totalSites ?? 0,
      icon: <PlaceIcon fontSize="medium" sx={{ color: "primary.main" }} />,
      detail: "Active service locations",
    },
    {
      label: "Active Work Orders",
      value: dashboardData?.inProgressWorkOrders ?? 0,
      icon: <WorkIcon fontSize="medium" sx={{ color: "primary.main" }} />,
      detail: "Currently in progress",
    },
    {
      label: "Completed Orders",
      value: dashboardData?.completedWorkOrders ?? 0,
      icon: <DescriptionIcon fontSize="medium" sx={{ color: "primary.main" }} />,
      detail: "Completed work orders",
    },
    {
      label: "Pending Orders",
      value: dashboardData?.openWorkOrders ?? 0,
      icon: <BarChartIcon fontSize="medium" sx={{ color: "primary.main" }} />,
      detail: "Open work orders",
    },
    {
      label: "Technicians",
      value: dashboardData?.totalTechnicians ?? 0,
      icon: <BuildIcon fontSize="medium" sx={{ color: "primary.main" }} />,
      detail: "Registered technicians",
    },
  ];

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const dynamicActivities = recentWorkOrders.length > 0
    ? recentWorkOrders.map((wo) => ({
        time: wo.createdAt ? new Date(wo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
        title: `Work Order WO-${wo.id}: ${wo.title}`,
        description: `Priority: ${wo.priority || 'Medium'} | Status: ${wo.status || 'NEW'} | Technician: ${wo.technicianName || 'Unassigned'}`,
      }))
    : [
        {
          time: 'System',
          title: 'System Ready',
          description: 'No recent activity recorded. Create customers, sites, or work orders to get started.',
        },
      ];

  const dynamicNotifications = [
    {
      title: 'High Priority Alert',
      description: `${dashboardData?.highPriorityWorkOrders ?? 0} high-priority work order(s) requiring attention.`,
      variant: (dashboardData?.highPriorityWorkOrders ?? 0) > 0 ? 'warning' : 'info',
    },
    {
      title: 'Pending Dispatch Queue',
      description: `${dashboardData?.openWorkOrders ?? 0} open work order(s) ready for service assignment.`,
      variant: 'info',
    },
    {
      title: 'Technician Resource Status',
      description: `${dashboardData?.totalTechnicians ?? 0} active field technician(s) registered in database.`,
      variant: 'success',
    },
  ];

  const dynamicUpcomingTasks = recentWorkOrders.length > 0
    ? recentWorkOrders.slice(0, 4).map((wo) => ({
        label: `WO-${wo.id}: ${wo.title} (${wo.siteName || 'Field Site'})`,
        completed: wo.status === 'COMPLETED' || wo.status === 'Completed',
      }))
    : [
        { label: 'Review field service schedules', completed: false },
        { label: 'Approve technician timesheets', completed: true },
        { label: 'Validate site access requests', completed: false },
        { label: 'Prepare weekly operations report', completed: false },
      ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f7f8fb', minHeight: '100vh' }}>
      <Stack spacing={3}>
        <Card sx={{ borderRadius: 3, boxShadow: 2, p: { xs: 2, md: 3 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="overline" color="primary" sx={{ letterSpacing: 1.2 }}>
                Welcome Back,
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                {userName}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {currentDate}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: { xs: 2, md: 0 } }}>
              <Chip label={userRole} color="primary" sx={{ borderRadius: 2, px: 2, py: 1, fontWeight: 600 }} />
              <IconButton color="primary" sx={{ backgroundColor: 'primary.light', '&:hover': { backgroundColor: 'primary.main' } }}>
                <NotificationsIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Card>

        <Grid container spacing={3}>
          {kpiData.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.label}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 1,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                        {loading ? <Skeleton width={80} /> : item.value}
                      </Typography>
                    </Box>
                    <Avatar sx={{ backgroundColor: 'primary.light', color: 'primary.main', width: 48, height: 48 }}>
                      {item.icon}
                    </Avatar>
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 2, fontSize: 13 }}>
                    {item.detail}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Recent Work Orders
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
                      Latest work order summary from live field service database.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<CalendarMonthIcon />}
                    onClick={() => navigate('/work-orders')}
                  >
                    View all
                  </Button>
                </Stack>
                <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>WO ID</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Title</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Site</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Priority</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Technician</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                          <TableRow key={index}>
                            {Array.from({ length: 7 }).map((__ , cellIndex) => (
                              <TableCell key={cellIndex}>
                                <Skeleton />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : recentWorkOrders.length > 0 ? (
                         recentWorkOrders.map((order) => (
                           <TableRow
                              key={order.id}
                              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                            >
                              <TableCell>{`WO-${order.id}`}</TableCell>

                              <TableCell>
                                {order.title}
                              </TableCell>

                              <TableCell>
                                {order.siteName ?? "—"}
                              </TableCell>

                              <TableCell>
                                <Chip
                                  label={order.priority}
                                  size="small"
                                  color={
                                    order.priority?.toUpperCase() === "HIGH" || order.priority?.toUpperCase() === "URGENT"
                                      ? "error"
                                      : order.priority?.toUpperCase() === "MEDIUM"
                                        ? "warning"
                                        : "default"
                                  }
                                  sx={{ textTransform: "capitalize" }}
                                />
                              </TableCell>

                              <TableCell>
                                <Chip
                                  label={order.status}
                                  size="small"
                                  color={
                                    order.status?.toUpperCase() === "COMPLETED"
                                      ? "success"
                                      : order.status?.toUpperCase() === "IN_PROGRESS"
                                        ? "primary"
                                        : order.status?.toUpperCase() === "OPEN" || order.status?.toUpperCase() === "NEW"
                                          ? "info"
                                          : "warning"
                                  }
                                  sx={{ textTransform: "capitalize" }}
                                />
                              </TableCell>

                              <TableCell>
                                {order.technicianName ?? "Unassigned"}
                              </TableCell>

                              <TableCell>
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString()
                                  : "—"}
                              </TableCell>
                            </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                            <Typography color="text.secondary">No recent work orders found in database.</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack direction="column" spacing={3}>
              <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Stack spacing={1}>
                    {quickActions.map((action) => (
                      <Button
                        key={action.label}
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate(action.path)}
                        sx={{ justifyContent: 'flex-start', borderRadius: 2, textTransform: 'none' }}
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Recent Activity
                  </Typography>
                  <Stack spacing={2}>
                    {dynamicActivities.map((activity, idx) => (
                      <Stack key={idx} direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ minWidth: 70 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {activity.time}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, borderRadius: 2, backgroundColor: 'grey.100', p: 1.5 }}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {activity.title}
                          </Typography>
                          <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 12 }}>
                            {activity.description}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1, height: '100%' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <NotificationsIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Notifications
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {dynamicNotifications.map((notification, idx) => (
                    <Paper
                      key={idx}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor:
                          notification.variant === 'warning'
                            ? 'warning.light'
                            : notification.variant === 'success'
                            ? 'success.light'
                            : 'info.light',
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700}>
                        {notification.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
                        {notification.description}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1, height: '100%' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <ChecklistIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Upcoming Tasks
                  </Typography>
                </Stack>
                <Stack spacing={1.5}>
                  {dynamicUpcomingTasks.map((task, idx) => (
                    <Stack key={idx} direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'grey.100' }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: task.completed ? 'success.main' : 'primary.main', flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: task.completed ? 'text.secondary' : 'text.primary', textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1, height: '100%' }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <CalendarMonthIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Schedule Overview
                  </Typography>
                </Stack>
                <Typography color="text.secondary" sx={{ mb: 2, fontSize: 14 }}>
                  Overview of current operational assignments and site dispatch status.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                  <Chip label={`${dashboardData?.openWorkOrders ?? 0} Open Queue`} color="primary" sx={{ borderRadius: 2, py: 1 }} />
                  <Chip label={`${dashboardData?.inProgressWorkOrders ?? 0} In Progress`} color="warning" sx={{ borderRadius: 2, py: 1 }} />
                  <Chip label={`${dashboardData?.totalSites ?? 0} Service Sites`} variant="outlined" sx={{ borderRadius: 2, py: 1 }} />
                  <Chip label={`${dashboardData?.totalTechnicians ?? 0} Technicians`} variant="outlined" sx={{ borderRadius: 2, py: 1 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default Dashboard;
 