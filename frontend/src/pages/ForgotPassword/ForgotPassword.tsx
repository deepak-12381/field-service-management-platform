import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await authService.resetPassword(
        email,
        newPassword
      );

      if (response === "Email not found!") {
        setError("Email not found!");
        return;
      }

      if (response === "Password reset successfully!") {
        alert("Password reset successfully!");

        navigate("/login");
        return;
      }

      setError(response || "Password reset failed");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Password reset failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#edf1f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 4, md: 5 },
              backgroundColor: "#fff",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: "#0d47a1" }}
              >
                Field Service Management Platform
              </Typography>

              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Reset your password
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
            >
              <Stack spacing={2.5}>
                {error && (
                  <Alert severity="error">
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />

                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.6,
                    borderRadius: 2,
                    fontWeight: 700,
                  }}
                >
                  {loading
                    ? "Resetting Password..."
                    : "Reset Password"}
                </Button>

                <Button
                  variant="text"
                  onClick={() => navigate("/login")}
                  sx={{ fontWeight: 600 }}
                >
                  Back to Sign In
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ForgotPassword;