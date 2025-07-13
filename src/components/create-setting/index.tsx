"use client";

import { useGetDefaultOrganizationQuery } from "@/state/api/organizationApi";
import { useCreateOrganizationSettingMutation } from "@/state/api/organizationSettingApi";
import { useAppSelector } from "@/state/redux";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Field, FormikProps, FormikProvider, useFormik } from "formik";
import React, { useState } from "react";
import * as yup from "yup";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";

type CreateOrganizationSettingProps = {
  organization: string;
  onCreate: (values: OrganizationSetting) => void;
};

const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const timeValidationSchema = yup.object({
  hour: yup.number().min(0).max(23).required("Hour is required"),
  minute: yup.number().min(0).max(59).required("Minute is required"),
});

const weekScheduleValidationSchema = yup
  .object({
    startTime: timeValidationSchema,
    endTime: timeValidationSchema,
    breakTimes: yup.array().of(
      yup.object({
        breakTime: timeValidationSchema,
        durationInMinute: yup.number().min(0).required("Duration is required"),
        paid: yup.boolean().required("Paid status is required"),
      })
    ),
  })
  .nullable();

const validationSchema = yup.object({
  organization: yup.string().length(24).required("Organization ID is required"),
  schedules: yup
    .object({
      sun: weekScheduleValidationSchema,
      mon: weekScheduleValidationSchema,
      tue: weekScheduleValidationSchema,
      wed: weekScheduleValidationSchema,
      thu: weekScheduleValidationSchema,
      fri: weekScheduleValidationSchema,
      sat: weekScheduleValidationSchema,
    })
    .required("Schedules are required"),
});

const CreateOrganizationSetting: React.FC<CreateOrganizationSettingProps> = ({
  organization,
  onCreate,
}) => {
  const authUser = useAppSelector((state) => state.global.auth);
  const [createOrganizationSetting] = useCreateOrganizationSettingMutation();
  const { data, isLoading } = useGetDefaultOrganizationQuery();
  const [value, setValue] = useState<Dayjs | null>(null);

  const handleCreateOrganizationSetting = async (
    values: CreateOrganizationSettingRequest
  ) => {
    try {
      console.log("Creating organization setting with values:", values);
      const response = await createOrganizationSetting(values).unwrap();
      onCreate(response);
    } catch (error) {
      console.error("Failed to create organization setting:", error);
    }
  };
  const formik = useFormik({
    initialValues: {
      organization: organization || "",
      schedules: {
        sun: null,
        mon: null,
        tue: null,
        wed: null,
        thu: null,
        fri: null,
        sat: null,
      },
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: handleCreateOrganizationSetting,
  });

  const handleTimeChange = (day: any, field: any, value: any) => {
    formik.setFieldValue(`schedules.${day}.${field}`, value);
  };

  if (!organization) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (data) {
      organization = data.id;
    }
  }
  console.log({ value: formik.values });

  return (
    <FormikProvider value={formik}>
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {days.map((day) => {
            return <DaySetting key={day} day={day} formik={formik} />;
          })}
        </LocalizationProvider>
        <Button type="submit" fullWidth variant="contained">
          Save
        </Button>
      </Box>
    </FormikProvider>
  );
};

export default CreateOrganizationSetting;

const DaySetting = ({
  day,
  formik,
}: {
  day: string;
  formik: FormikProps<any>;
}) => {
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [checked, setChecked] = useState(false);
  return (
    <Box mb={3}>
      <Typography variant="subtitle1" gutterBottom>
        {day.toUpperCase()}
      </Typography>
      <Grid container spacing={{ sm: 1, md: 2 }}>
        <Grid size={{ xs: 6 }}>
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => {
              setStartTime(newValue);
              formik.setFieldValue(
                `schedules.${day}.startTime.hour`,
                newValue?.hour()
              );
              formik.setFieldValue(
                `schedules.${day}.startTime.minute`,
                newValue?.minute()
              );
            }}
            disabled={checked}
            slotProps={{
              textField: {
                error:
                  formik.touched[`schedules.${day}.startTime.hour`] &&
                  Boolean(formik.errors[`schedules.${day}.startTime.hour`]),
                helperText:
                  formik.touched[`schedules.${day}.startTime.hour`] &&
                  formik.errors[`schedules.${day}.startTime.hour`] &&
                  "Please select start time",
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => {
              setEndTime(newValue);
              formik.setFieldValue(
                `schedules.${day}.endTime.hour`,
                newValue?.hour()
              );
              formik.setFieldValue(
                `schedules.${day}.endTime.minute`,
                newValue?.minute()
              );
            }}
            disabled={checked}
            slotProps={{
              textField: {
                error:
                  formik.touched[`schedules.${day}.endTime.hour`] &&
                  Boolean(formik.errors[`schedules.${day}.endTime.hour`]),
                helperText:
                  formik.touched[`schedules.${day}.endTime.hour`] &&
                  formik.errors[`schedules.${day}.endTime.hour`] &&
                  "Please select start time",
              },
            }}
          />
        </Grid>
      </Grid>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setChecked(e.target.checked);
              if (e.target.checked) {
                // reset
                formik.setFieldValue(`schedules.${day}`, null);
                setStartTime(null);
                setEndTime(null);
              }
            }}
          />
        }
        label="No Start Time and End Time"
      />
    </Box>
  );
};
