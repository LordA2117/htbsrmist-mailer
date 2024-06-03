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
  } from "@mui/material";
  import Link from "next/link";
  
  export default function signUpPage({ csrfToken, providers }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const { data: session } = useSession();
  
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
    <>            
        <Link href="/">
        <button className="flex justify-center items-center mt-4 py-2 w-44 text-2xl rounded-3xl gap-5 tracking-wider bg-[#12273e] hover:bg-[#9FEF00] active:bg-[#5B8E23] focus:outline-none  text-white ">
            <span>Go Back</span>
        </button>
        </Link>
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "90vh",
          backgroundColor: "black",
        }}
      >
        <Box
          component="form"
          onSubmit={signupUser}
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
            Add User
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
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <button
          type="submit"
          className="w-full bg-[#9fef00d7] text-2xl rounded-3xl tracking-wider text-black py-2 px-4 hover:bg-[#9FEF00]"
        >
          Add
        </button>
          </Box>
        </Box>
      </Container>
    </>
    );
  }
  
  export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
    if (!session) {
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
  