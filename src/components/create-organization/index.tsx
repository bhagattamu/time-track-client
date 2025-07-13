"use client";

import { useCreateOrganizationMutation } from "@/state/api/organizationApi";
import { useAppSelector } from "@/state/redux";
import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

type CreateOrganizationProps = {
  onCreate: (values: Organization) => void;
};

const validationSchema = yup.object({
  user: yup.string().length(24).required("User ID is required"),
  name: yup
    .string()
    .min(2, "Organization Name should be of minimum 2 characters length")
    .required("Organization Name is required"),
  default: yup.boolean().required("Default is required"),
});

const CreateOrganization: React.FC<CreateOrganizationProps> = ({
  onCreate,
}) => {
  const authUser = useAppSelector((state) => state.global.auth);
  const [createOrganization] = useCreateOrganizationMutation();

  const handleCreateOrganization = async (
    values: CreateOrganizationRequest
  ) => {
    try {
      const response = await createOrganization(values).unwrap();
      onCreate(response);
    } catch (error) {
      console.error("Failed to create organization:", error);
    }
  };
  const formik = useFormik({
    initialValues: {
      user: authUser?.userId || "",
      name: "",
      default: true,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: handleCreateOrganization,
  });

  return (
    <div>
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
          <FormLabel htmlFor="name">Organization Name</FormLabel>
          <TextField
            id="name"
            type="text"
            name="name"
            placeholder="Your Organization Name"
            autoComplete="name"
            autoFocus
            required
            fullWidth
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            color={
              formik.touched.name && Boolean(formik.errors.name)
                ? "error"
                : "primary"
            }
          />
        </FormControl>
        <Button type="submit" fullWidth variant="contained">
          Save
        </Button>
      </Box>
    </div>
  );
};

export default CreateOrganization;
