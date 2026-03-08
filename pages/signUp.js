import {
  getCsrfToken,
  getProviders,
  getSession,
} from "next-auth/react";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from "next/router";
import { useEffect } from "react";

import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function signUpPage({ csrfToken, providers }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  const ADMIN_EMAILS = ["mailer@htbchennai.in", "test@gmail.com"];

  useEffect(() => {
    if (session && !ADMIN_EMAILS.includes(session.user.email)) {
      router.push("/");
    }
  }, [session, router]);

  const signupUser = async (e) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    let data = await res.json();
    if (data.message) {
      setMessage(data.message);
    }

    if (data.message === "Registered successfully") {
      setMessage("User registered successfully. You can now sign in.");
    }
  };

  return (
    <Box
      className="flex items-center justify-center min-h-screen relative overflow-hidden"
      sx={{
        backgroundColor: '#000',
        color: '#fff',
      }}
    >
      <Box
        component="form"
        onSubmit={signupUser}
        className="relative z-10 w-full max-w-[420px] p-10 flex flex-col gap-6"
        sx={{
          backgroundColor: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: "12px",
        }}
      >
        <Box sx={{ mb: 1, textAlign: "center" }}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

          <div className="flex justify-center mb-6 mt-2">
            <img src="/logo.png" alt="HTB Logo" className="h-10 object-contain" />
          </div>

          <Typography variant="h4" component="h1" fontWeight="800" gutterBottom sx={{ color: '#fff', letterSpacing: '-0.5px' }}>
            Create Account
          </Typography>
          <Typography variant="body1" sx={{ color: '#888' }}>
            Register a new user to access the mailer.
          </Typography>
        </Box>

        <Box className="flex flex-col gap-5">
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: '#888' } }}
            sx={{
              input: { color: '#fff', padding: '16px' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(159, 239, 0, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#9FEF00', borderWidth: '1px' },
              },
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: '#888' } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#888' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              input: { color: '#fff', padding: '16px' },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(159, 239, 0, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#9FEF00', borderWidth: '1px' },
              },
            }}
          />
        </Box>

        {message && (
          <Alert
            severity={message.includes("successfully") ? "success" : "error"}
            sx={{
              backgroundColor: message.includes("successfully") ? 'rgba(159, 239, 0, 0.1)' : 'rgba(255, 82, 82, 0.1)',
              color: message.includes("successfully") ? '#9FEF00' : '#ff8a80',
              border: message.includes("successfully") ? '1px solid rgba(159, 239, 0, 0.3)' : '1px solid rgba(255, 82, 82, 0.3)',
              borderRadius: '10px'
            }}
          >
            {message}
          </Alert>
        )}

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            type="submit"
            fullWidth
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: "600",
              fontSize: "1rem",
              textTransform: "none",
              padding: "12px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#e5e5e5",
              },
              transition: "all 0.2s ease-in-out"
            }}
          >
            Sign Up
          </Button>

          <Link href="/signIn" style={{ textDecoration: 'none' }}>
            <Button
              fullWidth
              startIcon={<ArrowBackIcon />}
              sx={{
                backgroundColor: "transparent",
                color: "#aaa",
                fontWeight: "500",
                textTransform: "none",
                padding: "12px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#fff"
                },
                transition: "all 0.2s ease-in-out"
              }}
            >
              Back to Login
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  const ADMIN_EMAILS = ["mailer@htbchennai.in", "test@gmail.com"];

  if (!session || !ADMIN_EMAILS.includes(session.user.email)) {
    return {
      redirect: { destination: "/signIn" },
    };
  }

  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();
  return {
    props: { csrfToken, providers },
  };
}
