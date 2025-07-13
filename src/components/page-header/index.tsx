import { Grid, Typography } from "@mui/material";
import React, { ReactElement } from "react";

type PageHeaderProps = {
  title: string;
  children?: ReactElement | React.ReactNode | string;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <Grid
      container
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Grid>
        <Typography variant="h4" component="h2">
          {title}
        </Typography>
      </Grid>
      <Grid>{children}</Grid>
    </Grid>
  );
};

export default PageHeader;
