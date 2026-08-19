 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email address and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await login({
        email: email.trim(),
        password,
      });

      const token = typeof res === "string" ? res : res?.token;
      if (!token || token.startsWith("Email not found") || token.startsWith("Invalid password")) {
        const msg = typeof res === "string" ? res : "Invalid email or password";
        setErrorMsg(msg);
        return;
      }

      localStorage.setItem("token", token);

      if (typeof res === "object" && res !== null) {
        localStorage.setItem("userProfile", JSON.stringify({
          name: res.fullName || email.split("@")[0],
          email: res.email || email,
          role: res.role || "User",
        }));
        window.dispatchEvent(new Event("storage"));
      }

      navigate("/dashboard");
    } catch (error: any) {
      let msg = "Invalid email or password";
      if (error?.code === "ECONNABORTED") {
        msg = "Request timed out. The backend server on Render may be waking up. Please try again in a few seconds.";
      } else if (typeof error?.response?.data?.message === "string") {
        msg = error.response.data.message;
      } else if (error?.message === "Network Error") {
        msg = "Unable to connect to backend server. Please check your network connection.";
      }
      setErrorMsg(msg);
      console.error("Login error:", error);
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
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 5 }, backgroundColor: "#ffffff" }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: "#0d47a1" }}>
                Field Service Management Platform
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                Enterprise Portal
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleLogin} noValidate>
              {errorMsg && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {errorMsg}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email Address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                margin="normal"
                type="email"
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                margin="normal"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        size="large"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  mt: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      color="primary"
                    />
                  }
                  label="Remember Me"
                />
                 <Link
  component="button"
  type="button"
  underline="none"
  onClick={() => navigate("/forgot-password")}
  sx={{
    color: "primary.main",
    fontWeight: 600,
    border: 0,
    background: "none",
    cursor: "pointer",
    padding: 0,
  }}
>
  Forgot Password?
</Link>
              </Box>

              <Button
  fullWidth
  type="submit"
  variant="contained"
  color="primary"
  size="large"
  disabled={loading}
  sx={{ mt: 3, py: 1.6, borderRadius: 2, fontWeight: 700 }}
>
  {loading ? "Signing In..." : "Sign In"}
</Button>
            </Box>

             <Box sx={{ textAlign: "center", mt: 4 }}>
  <Typography color="text.secondary" sx={{ fontSize: 14 }}>
    New user?{" "}
    <Link
      component="button"
      type="button"
      underline="none"
      onClick={() => navigate("/register")}
      sx={{
        color: "primary.main",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Create Account
    </Link>
  </Typography>

  <Typography color="text.secondary" sx={{ fontSize: 14, mt: 2 }}>
    Authorized Users Only. Contact your System Administrator for account access.
  </Typography>
</Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Login;
