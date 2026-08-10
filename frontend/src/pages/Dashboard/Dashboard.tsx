import Grid from "@mui/material/Grid";
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

const kpiData = [
  {
    label: 'Total Customers',
    value: '1,280',
    icon: <GroupsIcon fontSize="medium" sx={{ color: 'primary.main' }} />,
    detail: 'Customer accounts tracked',
  },
  {
    label: 'Total Sites',
    value: '445',
    icon: <PlaceIcon fontSize="medium" sx={{ color: 'primary.main' }} />,
    detail: 'Active service locations',
  },
  {
    label: 'Active Work Orders',
    value: '76',
    icon: <WorkIcon fontSize="medium" sx={{ color: 'primary.main' }} />,
    detail: 'Open assignments',
  },
  {
    label: 'Completed Orders',
    value: '1,132',
    icon: <DescriptionIcon fontSize="medium" sx={{ color: 'primary.main' }} />,
    detail: 'Closed in the last 30 days',
  },
  {
    label: 'Pending Orders',
    value: '18',
    icon: <BarChartIcon fontSize="medium" sx={{ color: 'primary.main' }} />,
    detail: 'Awaiting customer approval',
  },
  {
    label: 'Technicians',
    value: '52',
    icon: <BuildIcon fontSize="medium" sx={{ color: 'primary.main' }} />,
    detail: 'Skilled field staff available',
  },
];

const workOrders = [
  {
    id: 'WO-1087',
    customer: 'Greenfield Manufacturing',
    site: 'Warehouse 12',
    priority: 'High',
    status: 'In Progress',
    technician: 'A. Johnson',
    date: '2026-08-05',
  },
  {
    id: 'WO-1074',
    customer: 'Northgate Logistics',
    site: 'Distribution Center',
    priority: 'Medium',
    status: 'Scheduled',
    technician: 'M. Patel',
    date: '2026-08-04',
  },
  {
    id: 'WO-1062',
    customer: 'Broadway Retail',
    site: 'Flagship Store',
    priority: 'Low',
    status: 'Completed',
    technician: 'S. Lee',
    date: '2026-08-03',
  },
  {
    id: 'WO-1059',
    customer: 'Centra Telecom',
    site: 'Service Hub',
    priority: 'High',
    status: 'Pending Review',
    technician: 'D. Taylor',
    date: '2026-08-02',
  },
];

const activityItems = [
  {
    time: '08:30 AM',
    title: 'Work order WO-1087 updated',
    description: 'Priority changed to High and technician assigned.',
  },
  {
    time: '10:00 AM',
    title: 'New site added',
    description: 'Customer: Northgate Logistics.',
  },
  {
    time: '11:15 AM',
    title: 'Technician availability confirmed',
    description: 'S. Lee is ready for deployment.',
  },
];

const upcomingTasks = [
  { label: 'Review field service schedules', completed: false },
  { label: 'Approve technician timesheets', completed: true },
  { label: 'Validate site access requests', completed: false },
  { label: 'Prepare weekly operations report', completed: false },
];

const quickActions = [
  { label: 'Create Customer', icon: <PersonAddIcon sx={{ mr: 1 }} /> },
  { label: 'Create Site', icon: <PlaceIcon sx={{ mr: 1 }} /> },
  { label: 'Create Work Order', icon: <WorkIcon sx={{ mr: 1 }} /> },
  { label: 'Assign Technician', icon: <BuildIcon sx={{ mr: 1 }} /> },
  { label: 'Generate Report', icon: <ReportIcon sx={{ mr: 1 }} /> },
];

const notifications = [
  {
    title: 'Service notification',
    description: 'Scheduled maintenance window starts at 09:00 PM.',
    variant: 'info',
  },
  {
    title: 'Staff allocation',
    description: 'Two technicians are now available for priority assignments.',
    variant: 'success',
  },
];

const Dashboard = () => {
  const loading = false;
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f7f8fb', minHeight: '100vh' }}>
      <Stack spacing={3}>
        <Card sx={{ borderRadius: 3, boxShadow: 2, p: { xs: 2, md: 3 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="overline" color="primary" sx={{ letterSpacing: 1.2 }}>
                Good Morning,
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>
                Administrator
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {currentDate}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: { xs: 2, md: 0 } }}>
              <Chip label="Administrator" color="primary" sx={{ borderRadius: 2, px: 2, py: 1 }} />
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
            <Card sx={{ borderRadius: 3, boxShadow: 1, minHeight: 420 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Recent Work Orders
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
                      Latest work order summary from the field service queue.
                    </Typography>
                  </Box>
                  <Button variant="contained" color="primary" size="small" startIcon={<CalendarMonthIcon />}>View all</Button>
                </Stack>
                <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                  <Table sx={{ minWidth: 720 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Work Order ID</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Customer</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Site</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Priority</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontWeight: 700 }}>Assigned Technician</TableCell>
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
                      ) : (
                        workOrders.map((order) => (
                          <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.site}</TableCell>
                            <TableCell>{order.priority}</TableCell>
                            <TableCell>
                              <Chip
                                label={order.status}
                                size="small"
                                color={order.status === 'Completed' ? 'success' : order.status === 'Scheduled' ? 'info' : order.status === 'Pending Review' ? 'warning' : 'primary'}
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </TableCell>
                            <TableCell>{order.technician}</TableCell>
                            <TableCell>{order.date}</TableCell>
                          </TableRow>
                        ))
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
                    {activityItems.map((activity) => (
                      <Stack key={activity.time} direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{ minWidth: 76 }}>
                          <Typography variant="body2" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1, borderRadius: 2, backgroundColor: 'grey.100', p: 2 }}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {activity.title}
                          </Typography>
                          <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
                            {activity.description}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <NotificationsIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                      Notifications
                    </Typography>
                  </Stack>
                  <Stack spacing={2}>
                    {notifications.map((notification) => (
                      <Paper key={notification.title} elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: notification.variant === 'success' ? 'success.light' : 'info.light' }}>
                        <Typography variant="subtitle2" fontWeight={700}>
                          {notification.title}
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: 14 }}>
                          {notification.description}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <ChecklistIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Upcoming Tasks
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {upcomingTasks.map((task) => (
                    <Stack key={task.label} direction="row" alignItems="center" spacing={2} sx={{ p: 2, borderRadius: 2, backgroundColor: 'grey.100' }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: task.completed ? 'success.main' : 'text.secondary' }} />
                      <Typography sx={{ color: task.completed ? 'text.secondary' : 'text.primary', textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 1, minHeight: 240 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <CalendarMonthIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Schedule Overview
                  </Typography>
                </Stack>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Review upcoming assignments and keep field operations aligned with service priorities.
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip label="Field Walkthrough" color="primary" sx={{ borderRadius: 2, py: 1.25 }} />
                  <Chip label="Client Presentation" variant="outlined" sx={{ borderRadius: 2, py: 1.25 }} />
                  <Chip label="Equipment Audit" variant="outlined" sx={{ borderRadius: 2, py: 1.25 }} />
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
 