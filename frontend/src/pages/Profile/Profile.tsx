 import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';

import {
  Edit as EditIcon,
  LockReset as LockResetIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  department: string;
}

const defaultProfile: ProfileData = {
  name: 'Administrator',
  email: 'admin@fieldservice.com',
  phone: '+1 555-0100',
  department: 'Operations',
};

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);

  const [profile, setProfile] = useState(defaultProfile);
  const [formData, setFormData] = useState(defaultProfile);

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Load saved profile when page opens
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');

    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);

        setProfile(parsedProfile);
        setFormData(parsedProfile);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    }
  }, []);

  // Open edit mode
  const handleEdit = () => {
    setPasswordMode(false);
    setFormData(profile);
    setEditMode(true);
  };

  // Save profile
  const handleSave = () => {
    setProfile(formData);

    localStorage.setItem(
      'userProfile',
      JSON.stringify(formData)
    );

    setEditMode(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  // Update profile fields
  const handleChange =
    (field: keyof ProfileData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [field]: event.target.value,
      });
    };

  // Open password mode
  const handlePasswordMode = () => {
    setEditMode(false);

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    setPasswordError('');
    setPasswordSuccess('');

    setPasswordMode(true);
  };

  // Update password fields
  const handlePasswordChange =
    (field: keyof PasswordData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordData({
        ...passwordData,
        [field]: event.target.value,
      });

      setPasswordError('');
      setPasswordSuccess('');
    };

  // Change password
  const handlePasswordSave = () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    const savedPassword =
      localStorage.getItem('userPassword') || 'admin123';

    if (passwordData.currentPassword !== savedPassword) {
      setPasswordError('Current password is incorrect.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(
        'New password must be at least 6 characters.'
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        'New password and confirm password do not match.'
      );
      return;
    }

    localStorage.setItem(
      'userPassword',
      passwordData.newPassword
    );

    setPasswordSuccess('Password changed successfully.');

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  // Cancel password change
  const handlePasswordCancel = () => {
    setPasswordMode(false);

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    setPasswordError('');
    setPasswordSuccess('');
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: '100vh',
        backgroundColor: '#f7f8fb',
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 2,
          maxWidth: 1000,
          mx: 'auto',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>

          {/* Header */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >

            {/* Profile Avatar */}
            <Avatar
              sx={{
                width: 110,
                height: 110,
                bgcolor: 'primary.main',
                color: '#ffffff',
                fontSize: 40,
                fontWeight: 600,
              }}
            >
              {profile.name
                ? profile.name.trim().charAt(0).toUpperCase()
                : 'A'}
            </Avatar>

            {/* Profile Title */}
            <Box sx={{ flex: 1 }}>

              <Typography
                variant="h4"
                sx={{ fontWeight: 700 }}
              >
                {profile.name} Profile
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Manage account details and password security.
              </Typography>

              {/* Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{ mt: 2 }}
              >

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<LockResetIcon />}
                  onClick={handlePasswordMode}
                >
                  Change Password
                </Button>

              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* EDIT PROFILE */}
          {editMode ? (

            <Stack spacing={2.5}>

              <TextField
                label="Name"
                value={formData.name}
                onChange={handleChange('name')}
                fullWidth
              />

              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                fullWidth
              />

              <TextField
                label="Phone"
                value={formData.phone}
                onChange={handleChange('phone')}
                fullWidth
              />

              <TextField
                label="Department"
                value={formData.department}
                onChange={handleChange('department')}
                fullWidth
              />

              {/* Save / Cancel */}
              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 1 }}
              >

                <Button
                  variant="contained"
                  onClick={handleSave}
                >
                  SAVE
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleCancel}
                >
                  CANCEL
                </Button>

              </Stack>

            </Stack>

          ) : passwordMode ? (

            /* CHANGE PASSWORD */
            <Stack spacing={2.5}>

              <Typography
                variant="h5"
                sx={{ fontWeight: 700 }}
              >
                Change Password
              </Typography>

              <Typography color="text.secondary">
                Update your account password.
              </Typography>

              {passwordError && (
                <Alert severity="error">
                  {passwordError}
                </Alert>
              )}

              {passwordSuccess && (
                <Alert severity="success">
                  {passwordSuccess}
                </Alert>
              )}

              {/* Current Password */}
              <TextField
                label="Current Password"
                type={
                  showCurrentPassword
                    ? 'text'
                    : 'password'
                }
                value={passwordData.currentPassword}
                onChange={handlePasswordChange(
                  'currentPassword'
                )}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowCurrentPassword(
                            !showCurrentPassword
                          )
                        }
                        edge="end"
                      >
                        {showCurrentPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* New Password */}
              <TextField
                label="New Password"
                type={
                  showNewPassword
                    ? 'text'
                    : 'password'
                }
                value={passwordData.newPassword}
                onChange={handlePasswordChange(
                  'newPassword'
                )}
                fullWidth
                helperText="Minimum 6 characters"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword
                          )
                        }
                        edge="end"
                      >
                        {showNewPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm Password */}
              <TextField
                label="Confirm New Password"
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange(
                  'confirmPassword'
                )}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Buttons */}
              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 1 }}
              >

                <Button
                  variant="contained"
                  onClick={handlePasswordSave}
                >
                  CHANGE PASSWORD
                </Button>

                <Button
                  variant="outlined"
                  onClick={handlePasswordCancel}
                >
                  CANCEL
                </Button>

              </Stack>

            </Stack>

          ) : (

            /* VIEW PROFILE */
            <Stack spacing={2.5}>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                }}
              >
                <Typography color="text.secondary">
                  Email
                </Typography>

                <Typography fontWeight={600}>
                  {profile.email}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                }}
              >
                <Typography color="text.secondary">
                  Phone
                </Typography>

                <Typography fontWeight={600}>
                  {profile.phone}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                }}
              >
                <Typography color="text.secondary">
                  Role
                </Typography>

                <Typography fontWeight={600}>
                  Administrator
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                }}
              >
                <Typography color="text.secondary">
                  Department
                </Typography>

                <Typography fontWeight={600}>
                  {profile.department}
                </Typography>
              </Box>

            </Stack>
          )}

        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;