"use client";

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

const Organization = () => {
  return (
    <>
      <div className="flex">
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Organization
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          onClick={() => {
            // Handle create organization logic here
            console.log("Create Organization clicked");
          }}
        >
          Create Organization
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Organization</TableCell>
              <TableCell align="right">Default</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Organization;
