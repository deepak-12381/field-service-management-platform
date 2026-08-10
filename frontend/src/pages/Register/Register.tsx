import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

type Role = 'CUSTOMER' | 'TECHNICIAN' | 'MANAGER';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validate = () => {
    if (!fullName.trim()) return 'Full Name is required';
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Enter a valid email address';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    if (!role) return 'Role is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await authService.register({ fullName, email, password, role });
      setSuccess('Registration successful — redirecting to login');
      navigate('/login');
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#edf1f5', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
      <Container maxWidth="sm">
        <Card elevation={4} sx={{ borderRadius: 3, boxShadow: '0 24px 60px rgba(15,23,42,0.08)' }}>
          <CardContent sx={{ p: { xs: 4, md: 5 }, backgroundColor: '#fff' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#0d47a1' }}>
                Field Service Management Platform
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                Enterprise Portal — Create an account
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth required />

                <TextField label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required type="email" autoComplete="email" />

                <TextField
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => setShowPassword((s) => !s)} size="large" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth required type={showPassword ? 'text' : 'password'} />

                <FormControl fullWidth>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select labelId="role-label" value={role} label="Role" onChange={(e) => setRole(e.target.value as Role)}>
                    <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                    <MenuItem value="TECHNICIAN">TECHNICIAN</MenuItem>
                    <MenuItem value="MANAGER">MANAGER</MenuItem>
                  </Select>
                </FormControl>

                <Button type="submit" variant="contained" color="primary" size="large" sx={{ py: 1.6, fontWeight: 700 }} disabled={loading}>
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
