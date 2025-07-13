"use client";

import { useToast } from "@/app/context";
import PageHeader from "@/components/page-header";
import PageLoader from "@/components/page-loader";
import { useGetTrackQuery } from "@/state/api/trackApi";
import {
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { Fragment, useEffect } from "react";

const TimeLogDetail = () => {
  const { timelogId } = useParams();
  const { data, isLoading, isError } = useGetTrackQuery(
    typeof timelogId === "string" ? timelogId : "",
    {
      skip: !timelogId,
    }
  );
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      router.push("/time-logs");
      if (toast)
        toast.errorToast(
          "Failed to fetch time log! Redirecting to time logs page."
        );
      router.push("/time-logs");
    }
  }, [isError, toast, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return <PageLoader />;
  }

  return (
    <>
      <title>Time log</title>
      {data && (
        <div>
          <Container>
            <PageHeader
              title={`Time Log: ${new Date(data.date).toLocaleDateString()}`}
            ></PageHeader>
          </Container>
          <Container className="pt-5">
            <Typography variant="h5" component="h3">
              Movement logs:
            </Typography>
            <Divider />
            <List>
              {data.movements.map((movement) => (
                <Fragment key={new Date(movement.time).toLocaleTimeString()}>
                  <ListItem>
                    <ListItemText primary="Move" secondary={movement.move} />
                    <ListItemText
                      primary="Time"
                      secondary={new Date(movement.time).toLocaleTimeString()}
                    />
                  </ListItem>
                  <Divider />
                </Fragment>
              ))}
              <ListItem>
                <ListItemText
                  primary="Total Hour"
                  secondary={`${data.totalHour.toFixed(2)} hrs`}
                />
              </ListItem>
            </List>
          </Container>
        </div>
      )}
    </>
  );
};

export default TimeLogDetail;
