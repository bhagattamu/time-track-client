"use client";

import PageHeader from "@/components/page-header";
import { useLazyGetTimelogQuery } from "@/state/api/timelogApi";
import { Box, Button, Container } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useToast } from "../context";
import PageLoader from "@/components/page-loader";

type DayInNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type DayInString = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

type TimelogDataGrid = {
  id: string;
  date: string;
  day?: DayInString;
  totalHour: string;
};

const getDay = (day: DayInNumber) => {
  let dayString: DayInString;
  switch (day) {
    case 0:
      dayString = "sun";
      break;
    case 1:
      dayString = "mon";
      break;
    case 2:
      dayString = "tue";
      break;
    case 3:
      dayString = "wed";
      break;
    case 4:
      dayString = "thu";
      break;
    case 5:
      dayString = "fri";
      break;
    case 6:
      dayString = "sat";
      break;
    default:
      return;
  }
  return dayString;
};

const TimeLog = () => {
  const [getTimelog, { data: paginatedData, isLoading, isFetching }] =
    useLazyGetTimelogQuery();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    getTimelog();
  }, [getTimelog]);

  const handleNavigationToViewPage = (id: string) => {
    router.push(`/time-logs/${id}`);
  };

  const renderActionButtons = (
    params: GridRenderCellParams<TimelogDataGrid>
  ) => {
    const row = params.row;
    return (
      <Button
        color="primary"
        onClick={() => handleNavigationToViewPage(row.id)}
      >
        View
      </Button>
    );
  };

  const columns: GridColDef<TimelogDataGrid>[] = [
    {
      field: "date",
      headerName: "Date",
      width: 100,
    },
    {
      field: "day",
      headerName: "Day",
      flex: 1,
      valueFormatter: (value: string) => (value || "").toLocaleUpperCase(),
    },
    {
      field: "totalHour",
      headerName: "Total Hour",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: renderActionButtons,
      width: 100,
    },
  ];

  const handleFilterWithDate = () => {
    getTimelog({
      startDate: startDate ? startDate.format("MM/DD/YYYY") : "",
      endDate: endDate ? endDate.format("MM/DD/YYYY") : "",
    })
      .then(() => {
        toast?.successToast("Successfully filtered time logs!");
      })
      .catch((err) => {
        console.error(err);
        toast?.errorToast("Failed to filter time logs!");
      });
  };

  if (isLoading) <PageLoader />;

  return (
    <>
      <title>Time Logs</title>
      <Container>
        <PageHeader title="Time Logs">
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                maxDate={endDate ? endDate : dayjs()}
                disableFuture
              />
              <DatePicker
                label="End Date"
                value={endDate}
                disabled={!startDate}
                onChange={(newValue) => setEndDate(newValue)}
                minDate={startDate ? startDate : dayjs()}
                maxDate={dayjs()}
                disableFuture
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<FilterListIcon />}
                disabled={!startDate || !endDate}
                onClick={handleFilterWithDate}
              >
                Filter
              </Button>
            </LocalizationProvider>
          </Box>
        </PageHeader>
      </Container>
      <Container className="pt-5">
        <Box component="section" sx={{ height: 400, width: "100%" }}>
          <DataGrid
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            rows={
              paginatedData?.data
                ? paginatedData?.data?.map((timelog) => ({
                    id: timelog.id,
                    date: timelog.date,
                    day: getDay(new Date(timelog.date).getDay() as DayInNumber),
                    totalHour: timelog.totalHour.toFixed(2),
                  }))
                : []
            }
            columns={columns}
            loading={isFetching}
            // rowCount={rowCount}
            pageSizeOptions={[10]}
            paginationModel={{
              page: paginatedData?.meta?.page
                ? paginatedData?.meta?.page - 1
                : 0,
              pageSize: paginatedData?.meta?.dataPerPage || 10,
            }}
            // paginationMode="server"
            // sortingMode="server"
            // onPaginationModelChange={(model) =>
            //   setQueryOptions((prev) => ({ ...prev, page: model.page + 1 }))
            // }
            disableRowSelectionOnClick
          />
        </Box>
      </Container>
    </>
  );
};

export default TimeLog;
