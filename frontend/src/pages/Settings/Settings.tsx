 import { useEffect, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

interface SettingsData {
  companyName: string;
  address: string;
  supportEmail: string;
  darkMode: boolean;
  compactLayout: boolean;
  emailNotifications: boolean;
  smsAlerts: boolean;
  twoFactorAuth: boolean;
  autoLogout: boolean;
}

const defaultSettings: SettingsData = {
  companyName: 'Field Service Management',
  address: '1200 Blue Avenue, Suite 400',
  supportEmail: 'support@fieldservice.com',
  darkMode: true,
  compactLayout: true,
  emailNotifications: true,
  smsAlerts: true,
  twoFactorAuth: true,
  autoLogout: true,
};

const Settings = () => {
  const [settings, setSettings] =
    useState<SettingsData>(defaultSettings);

  const [savedSettings, setSavedSettings] =
    useState<SettingsData>(defaultSettings);

  const [openSnackbar, setOpenSnackbar] =
    useState(false);

  /* --------------------------------
     LOAD SETTINGS
  -------------------------------- */
  useEffect(() => {
    const storedSettings =
      localStorage.getItem('settings');

    if (!storedSettings) {
      return;
    }

    try {
      const parsedSettings = JSON.parse(
        storedSettings
      );

      const loadedSettings: SettingsData = {
        ...defaultSettings,
        ...parsedSettings,
      };

      setSettings(loadedSettings);
      setSavedSettings(loadedSettings);
    } catch (error) {
      console.error(
        'Failed to load settings:',
        error
      );
    }
  }, []);

  /* --------------------------------
     UPDATE SETTING
  -------------------------------- */
  const updateSetting = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* --------------------------------
     SAVE SETTINGS
  -------------------------------- */
  const handleSave = () => {
    localStorage.setItem(
      'settings',
      JSON.stringify(settings)
    );

    setSavedSettings(settings);

    setOpenSnackbar(true);
  };

  /* --------------------------------
     CANCEL CHANGES
  -------------------------------- */
  const handleCancel = () => {
    setSettings(savedSettings);
  };

  /* --------------------------------
     RESET SETTINGS
  -------------------------------- */
  const handleReset = () => {
    setSettings(defaultSettings);

    localStorage.setItem(
      'settings',
      JSON.stringify(defaultSettings)
    );

    setSavedSettings(defaultSettings);

    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: '100vh',
        backgroundColor: '#f7f8fb',
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
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, md: 4 },
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
            >
              System Settings
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Configure company preferences and
              platform defaults.
            </Typography>
          </CardContent>
        </Card>

        {/* --------------------------------
            COMPANY INFORMATION
        -------------------------------- */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, md: 4 },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Company Information
            </Typography>

            <Stack spacing={2}>

              <TextField
                label="Company Name"
                value={settings.companyName}
                onChange={(e) =>
                  updateSetting(
                    'companyName',
                    e.target.value
                  )
                }
                fullWidth
              />

              <TextField
                label="Address"
                value={settings.address}
                onChange={(e) =>
                  updateSetting(
                    'address',
                    e.target.value
                  )
                }
                fullWidth
              />

              <TextField
                label="Support Email"
                type="email"
                value={settings.supportEmail}
                onChange={(e) =>
                  updateSetting(
                    'supportEmail',
                    e.target.value
                  )
                }
                fullWidth
              />

            </Stack>
          </CardContent>
        </Card>

        {/* --------------------------------
            THEME SETTINGS
        -------------------------------- */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, md: 4 },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Theme Settings
            </Typography>

            <Stack spacing={1}>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={(e) =>
                      updateSetting(
                        'darkMode',
                        e.target.checked
                      )
                    }
                  />
                }
                label="Enable dark mode"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.compactLayout}
                    onChange={(e) =>
                      updateSetting(
                        'compactLayout',
                        e.target.checked
                      )
                    }
                  />
                }
                label="Use compact layout"
              />

            </Stack>
          </CardContent>
        </Card>

        {/* --------------------------------
            NOTIFICATION SETTINGS
        -------------------------------- */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, md: 4 },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Notification Settings
            </Typography>

            <Stack spacing={1}>

              <FormControlLabel
                control={
                  <Switch
                    checked={
                      settings.emailNotifications
                    }
                    onChange={(e) =>
                      updateSetting(
                        'emailNotifications',
                        e.target.checked
                      )
                    }
                  />
                }
                label="Email notifications"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsAlerts}
                    onChange={(e) =>
                      updateSetting(
                        'smsAlerts',
                        e.target.checked
                      )
                    }
                  />
                }
                label="SMS alerts"
              />

            </Stack>
          </CardContent>
        </Card>

        {/* --------------------------------
            SECURITY SETTINGS
        -------------------------------- */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent
            sx={{
              p: { xs: 3, md: 4 },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Security Settings
            </Typography>

            <Stack spacing={1}>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={(e) =>
                      updateSetting(
                        'twoFactorAuth',
                        e.target.checked
                      )
                    }
                  />
                }
                label="Require two-factor authentication"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoLogout}
                    onChange={(e) =>
                      updateSetting(
                        'autoLogout',
                        e.target.checked
                      )
                    }
                  />
                }
                label="Auto logout inactive sessions"
              />

            </Stack>
          </CardContent>
        </Card>

        {/* --------------------------------
            ACTION BUTTONS
        -------------------------------- */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
        >

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
          >
            SAVE SETTINGS
          </Button>

          <Button
            variant="outlined"
            onClick={handleCancel}
          >
            CANCEL
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleReset}
          >
            RESET DEFAULTS
          </Button>

        </Stack>

        {/* --------------------------------
            SUCCESS MESSAGE
        -------------------------------- */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() =>
            setOpenSnackbar(false)
          }
        >
          <Alert
            onClose={() =>
              setOpenSnackbar(false)
            }
            severity="success"
            variant="filled"
          >
            Settings saved successfully.
          </Alert>
        </Snackbar>

      </Stack>
    </Box>
  );
};

export default Settings;