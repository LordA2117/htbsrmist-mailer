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
} from "@mui/material";

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
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "black",
      }}
    >
      <Box
        component="form"
        onSubmit={signInUser}
        sx={{
          backgroundColor: "#12273e",
          border: "2px solid #9FEF00",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
        }}
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <Typography variant="h4" component="h1" color="#9FEF00" gutterBottom>
          Log In
        </Typography>
        <TextField
          label="Email address"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            style: { color: "#9FEF00" },
          }}
          InputLabelProps={{
            style: { color: "#9FEF00" },
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            style: { color: "#9FEF00" },
          }}
          InputLabelProps={{
            style: { color: "#9FEF00" },
          }}
        />
        {message && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={signInUser}
          className="w-full bg-[#9fef00d7] text-2xl rounded-3xl tracking-wider text-black py-2 px-4 hover:bg-[#9FEF00]"
        >
          Log in
        </button>
        </Box>
        {/* <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={signupUser}
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
    </Container>
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
