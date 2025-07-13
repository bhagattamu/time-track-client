"use client";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import Card from "@/components/card";
import { useFormik } from "formik";
import * as yup from "yup";
import AuthContainer from "@/components/auth-container";
import Link from "next/link";
import { useAuth } from "@/app/context";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const Login = () => {
  const auth = useAuth();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      await auth?.loginAction?.(values);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <AuthContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Login - Time track
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              color={
                formik.touched.email && Boolean(formik.errors.email)
                  ? "error"
                  : "primary"
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              required
              fullWidth
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              color={
                formik.touched.password && Boolean(formik.errors.password)
                  ? "error"
                  : "primary"
              }
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
          <Button type="submit" fullWidth variant="contained">
            Sign in
          </Button>
          {/* <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Forgot your password?
            </Link> */}
        </Box>
        <Divider>or</Divider>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button> */}
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <MuiLink
              href="/register"
              component={Link}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Sign up
            </MuiLink>
          </Typography>
        </Box>
      </Card>
    </AuthContainer>
  );
};

export default Login;
