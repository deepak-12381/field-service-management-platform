 import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
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
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';

const kpiCards = [
  {
    label: 'Completed Jobs',
    value: '184',
    detail: 'This month',
  },
  {
    label: 'Pending Review',
    value: '24',
    detail: 'Requires action',
  },
  {
    label: 'Avg. Resolution',
    value: '3.2h',
    detail: 'Per incident',
  },
];

const recentReports = [
  {
    id: 'RPT-104',
    name: 'Monthly Service Summary',
    date: '2026-07-30',
    status: 'Ready',
  },
  {
    id: 'RPT-103',
    name: 'Technician Utilization',
    date: '2026-07-25',
    status: 'Pending',
  },
  {
    id: 'RPT-102',
    name: 'Customer Satisfaction',
    date: '2026-07-18',
    status: 'Ready',
  },
];

const chartData = [48, 72, 58, 84, 66, 90];

/* -----------------------------
   Download Report as CSV
------------------------------ */
const handleDownloadReport = () => {
  const headers = ['Report ID', 'Report Name', 'Date', 'Status'];

  const rows = recentReports.map((report) => [
    report.id,
    report.name,
    report.date,
    report.status,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'field-service-reports.csv';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/* -----------------------------
   Export / Print as PDF
------------------------------ */
const handleExportPDF = () => {
  window.print();
};

const Reports = () => {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: '100vh',
        backgroundColor: '#f7f8fb',

        '@media print': {
          backgroundColor: '#ffffff',
          p: 0,
        },
      }}
    >
      <Stack spacing={3}>

        {/* --------------------------------
            HEADER
        -------------------------------- */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,

            '@media print': {
              boxShadow: 'none',
            },
          }}
        >
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
                  fontWeight={700}
                >
                  Reports & Analytics
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Review performance metrics and export operational reports.
                </Typography>
              </Box>

              {/* Hide buttons while printing */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{
                  '@media print': {
                    display: 'none',
                  },
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadReport}
                >
                  Download Report
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PdfIcon />}
                  onClick={handleExportPDF}
                >
                  Export PDF
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* --------------------------------
            KPI CARDS
        -------------------------------- */}
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, minmax(0, 1fr))',
            },
          }}
        >
          {kpiCards.map((card) => (
            <Card
              key={card.label}
              sx={{
                borderRadius: 3,
                boxShadow: 2,

                '@media print': {
                  boxShadow: 'none',
                  border: '1px solid #ddd',
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                >
                  {card.label}
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ mt: 1 }}
                >
                  {card.value}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    fontSize: 13,
                  }}
                >
                  {card.detail}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* --------------------------------
            SERVICE PERFORMANCE
        -------------------------------- */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,

            '@media print': {
              boxShadow: 'none',
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Service Performance
            </Typography>

            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: '#f9fbff',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 1.5,
                  height: 180,
                }}
              >
                {chartData.map((value, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{ mb: 0.5 }}
                    >
                      {value}
                    </Typography>

                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 44,
                        height: value,
                        borderRadius: '999px 999px 0 0',
                        backgroundColor:
                          index % 2 === 0
                            ? 'primary.main'
                            : 'primary.light',
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      W{index + 1}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </CardContent>
        </Card>

        {/* --------------------------------
            RECENT REPORTS
        -------------------------------- */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,

            '@media print': {
              boxShadow: 'none',
            },
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Recent Reports
            </Typography>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                backgroundColor: 'transparent',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: '#f7f9fc',
                    }}
                  >
                    <TableCell>
                      <strong>Report ID</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {recentReports.map((report) => (
                    <TableRow
                      key={report.id}
                      hover
                    >
                      <TableCell>
                        {report.id}
                      </TableCell>

                      <TableCell>
                        {report.name}
                      </TableCell>

                      <TableCell>
                        {report.date}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={report.status}
                          color={
                            report.status === 'Ready'
                              ? 'success'
                              : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

      </Stack>
    </Box>
  );
};

export default Reports;