import {
  getCsrfToken,
  getProviders,
  signIn,
  getSession,
} from "next-auth/react";
import Router from "next/router";
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
} from "@mui/material";
import Fingerprint from '@mui/icons-material/Fingerprint';

export default function signInPage({ csrfToken, providers }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const { data: session } = useSession();

  const signInUser = async (e) => {
    e.preventDefault();
    let options = { redirect: false, email, password };
    const res = await signIn("credentials", options);
    setMessage(null);
    if (res?.error) {
      setMessage(res.error);
    } else {
      return Router.push("/");
    }
  };

  // const signupUser = async (e) => {
  //   e.preventDefault();
  //   setMessage(null);
  //   const res = await fetch("/api/register", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ email, password }),
  //   });
  //   let data = await res.json();
  //   if (data.message) {
  //     setMessage(data.message);
  //   }
  
  //   if (data.message === "Registered successfully") {
  //     let options = { redirect: false, email, password };
  //     const res = await signIn("credentials", options);
  //     return Router.push("/");
  //   }
  // };

  return (
    <Box 
      className="themes-wrapper"
      sx={{ 
        backgroundColor: '#121212', // Dark background
        color: '#fff', // Text color for light on dark background
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        px: 4 
      }}
    >
      <Box
        component="form"
        onSubmit={signInUser}
        sx={{
          backgroundColor: "#1e1e1e", // Dark card background
          border: "2px solid #9FEF00", // Accent color for border
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: '400px',
          color: '#fff'
        }}
      >
        <Box sx={{ mb: 2 }}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <Typography variant="h4" component="h3" fontWeight="bold" gutterBottom sx={{ color: '#9FEF00' }}>
            Log In
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ color: '#b0b0b0' }}>
            Enter your email below to login to your account.
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            color="primary"
            InputLabelProps={{
              style: { color: '#fff' }, // Label color
            }}
            sx={{
              input: { color: '#fff' }, // Text color inside input
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#9FEF00', // Border color for dark theme
                },
                '&:hover fieldset': {
                  borderColor: '#7FCE00', // Hover border color
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9FEF00', // Focus border color
                },
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            color="secondary"
            InputLabelProps={{
              style: { color: '#fff' }, // Label color
            }}
            sx={{
              input: { color: '#fff' }, // Text color inside input
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#9FEF00', // Border color for dark theme
                },
                '&:hover fieldset': {
                  borderColor: '#7FCE00', // Hover border color
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9FEF00', // Focus border color
                },
              },
            }}
          />
        </Box>

        {message && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: '#ff5252', color: '#fff' }}>
            {message}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <IconButton
          color="success"
            onClick={signInUser}
          >
            <Fingerprint /> Log In
          </IconButton>
        </Box>

        {/* Uncomment below code for sign-up button */}
        {/* <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#9fef00d7",
              color: "black",
              "&:hover": {
                backgroundColor: "#9FEF00",
              },
            }}
          >
            Sign up
          </Button>
        </Box> */}
      </Box>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }
  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();
  return {
    props: { csrfToken, providers },
  };
}
