"use client";

import CreateOrganization from "@/components/create-organization";
import CreateOrganizationSetting from "@/components/create-setting";
import PageHeader from "@/components/page-header";
import TabPanel from "@/components/tab-panel";
import { useGetDefaultOrganizationQuery } from "@/state/api/organizationApi";
// import { useGetOrganizationSettingQuery } from "@/state/api/organizationSettingApi";
import {
  useCreateTrackMutation,
  useGetActiveTrackQuery,
} from "@/state/api/trackApi";
import { useAppSelector } from "@/state/redux";
import {
  Box,
  Container,
  Dialog,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useToast } from "./context";
import PageLoader from "@/components/page-loader";
import { APP_NAME } from "@/config";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Home() {
  const [track] = useCreateTrackMutation();
  const [openAddOrganizationModal, setOpenAddOrganizationModal] =
    useState(true);
  const authUser = useAppSelector((state) => state.global.auth);
  const { data: organization, isLoading: isOrganizationQueryLoading } =
    useGetDefaultOrganizationQuery();
  // const { data: organizationSetting, isOrganizationSettingQueryLoading } =
  //   useGetOrganizationSettingQuery(organization?.id || "", {
  //     skip: !organization?.id,
  //   });
  const { data: activeTrack, isLoading: isActiveTrackLoading } =
    useGetActiveTrackQuery();
  const [currentTime, setCurrentTime] = useState(new Date());
  const toast = useToast();

  const handleClockInAndOut = async (move: Move) => {
    try {
      await track({
        user: authUser?.userId || "",
        organization: organization?.id || "",
        move: move,
      }).unwrap();
      if (toast)
        toast.successToast(`Successfully clocked ${move.toLowerCase()}!`);
    } catch (error) {
      console.error(`Clock ${move} error:`, error);
      if (toast) toast.errorToast(`Failed to clock ${move.toLowerCase()}!`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (isOrganizationQueryLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <title>Dashboard</title>
      {!organization && (
        <>
          <CreateOrganizationModal
            organization={organization || null}
            isOpen={openAddOrganizationModal}
            handleClose={() => setOpenAddOrganizationModal(false)}
          />
        </>
      )}
      {organization && (
        <div>
          <Container>
            <PageHeader title={`${organization.name} ${APP_NAME}`} />
          </Container>

          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md text-center">
              <h1 className="text-2xl font-bold mb-4 text-gray-800">
                Punch Clock In / Clock Out
              </h1>
              <div className="text-4xl font-mono text-blue-600 mb-6">
                {currentTime.toLocaleTimeString()}
              </div>

              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => handleClockInAndOut("IN")}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                  Clock In
                </button>
                <button
                  onClick={() => handleClockInAndOut("OUT")}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                  Clock Out
                </button>
              </div>
              {isActiveTrackLoading ? (
                <p>Loading active track...</p>
              ) : activeTrack ? (
                <div className="text-left text-sm text-gray-700 space-y-2">
                  <Typography variant="h5" component="h3">
                    Movement logs:
                  </Typography>
                  <Divider />
                  <List>
                    {activeTrack.movements.map((movement, i) => (
                      <Fragment key={i}>
                        <ListItem>
                          <ListItemText
                            primary="Move"
                            secondary={movement.move}
                          />
                          <ListItemText
                            primary="Time"
                            secondary={new Date(
                              movement.time
                            ).toLocaleTimeString()}
                          />
                        </ListItem>
                        <Divider />
                      </Fragment>
                    ))}
                    <ListItem>
                      <ListItemText
                        primary="Total Hour"
                        secondary={`${activeTrack.totalHour.toFixed(2)} hrs`}
                      />
                    </ListItem>
                  </List>
                </div>
              ) : (
                <p>No active track found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const CreateOrganizationModal = ({
  organization: organizationValue,
  isOpen,
  handleClose,
}: {
  organization: Organization | null;
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const [tabIndex, setTabIndex] = useState(organizationValue ? 1 : 0);
  const [settingTabDisabled, setSettingTabDisabled] = useState(
    organizationValue ? false : true
  );
  const [organization, setOrganization] = useState<Organization | null>(
    organizationValue
  );
  const handleCreateOrganization = (createdOrganization: Organization) => {
    console.log("Created Organization:", createdOrganization);
    setOrganization(createdOrganization);
    // setTabIndex(1);
    setSettingTabDisabled(false);
    handleClose();
  };

  const handleCreateOrganizationSetting = (
    createdSetting: OrganizationSetting
  ) => {
    console.log("Created Organization Setting:", createdSetting);

    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      scroll="body"
    >
      <DialogContent>
        {/* <Box sx={style}> */}
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabIndex}
              onChange={(_event, newValue) => setTabIndex(newValue)}
              aria-label="basic tabs example"
            >
              <Tab
                label="Organization"
                {...a11yProps(0)}
                disabled={!settingTabDisabled}
              />
              {/* <Tab
                label="Settings"
                {...a11yProps(1)}
                disabled={settingTabDisabled}
              /> */}
            </Tabs>
          </Box>
          <TabPanel value={tabIndex} index={0}>
            <CreateOrganization onCreate={handleCreateOrganization} />
          </TabPanel>
          {organization && (
            <TabPanel value={tabIndex} index={1}>
              <Typography>{organization.name || ""}</Typography>
              <CreateOrganizationSetting
                organization={organization?.id || ""}
                onCreate={handleCreateOrganizationSetting}
              />
            </TabPanel>
          )}
        </Box>
        {/* </Box> */}
      </DialogContent>
    </Dialog>
  );
};
