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
  firstName: yup
    .string()
    .required("First Name is required")
    .min(2, "First Name should have minimum of 2 character"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .min(2, "Last Name should have minimum of 2 character"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should have minimum 8 characters")
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])/,
      "Password must contain at least one lowercase character"
    )
    .matches(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase character"
    )
    .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
    .matches(
      /^(?=.*[!@#%&])/,
      "Password must contain at least one special character"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const Register = () => {
  const auth = useAuth();

  const handleRegister = async (
    values: RegisterRequest & { confirmPassword: string }
  ) => {
    try {
      // Exclude confirmPassword before sending to registerAction
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...registerRequest } = values;
      await auth?.registerAction?.(registerRequest);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <AuthContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Register - Time track
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
            <FormLabel htmlFor="fistName">
              First Name<sup>*</sup>
            </FormLabel>
            <TextField
              id="firstName"
              type="text"
              name="firstName"
              placeholder="Enter First Name"
              required
              fullWidth
              variant="outlined"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
              color={
                formik.touched.firstName && Boolean(formik.errors.firstName)
                  ? "error"
                  : "primary"
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">
              Last Name<sup>*</sup>
            </FormLabel>
            <TextField
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Enter Last Name"
              required
              fullWidth
              variant="outlined"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              color={
                formik.touched.lastName && Boolean(formik.errors.lastName)
                  ? "error"
                  : "primary"
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">
              Email<sup>*</sup>
            </FormLabel>
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
            <FormLabel htmlFor="password">
              Password<sup>*</sup>
            </FormLabel>
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
          <FormControl>
            <FormLabel htmlFor="confirmPassword">
              Confirm Password<sup>*</sup>
            </FormLabel>
            <TextField
              name="confirmPassword"
              placeholder="••••••"
              type="password"
              id="confirmPassword"
              required
              fullWidth
              variant="outlined"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              color={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
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
            Sign Up
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
            Already have an account?{" "}
            <MuiLink
              href="/login"
              component={Link}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Sign In
            </MuiLink>
          </Typography>
        </Box>
      </Card>
    </AuthContainer>
  );
};

export default Register;
