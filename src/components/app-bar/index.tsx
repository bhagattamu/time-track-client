"use client";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import TimerIcon from "@mui/icons-material/Timer";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppSelector } from "@/state/redux";
import Link from "next/link";
import { useLogoutMutation } from "@/state/api/authApi";
import { useToast } from "@/app/context";

type NavItem = {
  title: string;
  link: string;
};

const beforeLoginPages: NavItem[] = [
  { title: "Login", link: "/login" },
  { title: "Register", link: "/register" },
];
const afterLoginPages: NavItem[] = [
  { title: "Dashboard", link: "/" },
  { title: "Time Logs", link: "/time-logs" },
];
const settings: NavItem[] = [{ title: "Profile", link: "/profile" }];

const TimeTrackAppBar = () => {
  const [logout] = useLogoutMutation();
  const authUser = useAppSelector((state) => state.global.auth);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const toast = useToast();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      if (toast) toast.successToast("Logout successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      if (toast) toast.errorToast("Failed to logout!");
    }
    handleCloseUserMenu();
  };
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TimerIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href={authUser?.accessToken ? "/" : "/login"}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Time Track
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {(authUser?.accessToken ? afterLoginPages : beforeLoginPages).map(
                (page) => (
                  <Link key={page.title} href={page.link}>
                    <MenuItem onClick={handleCloseNavMenu}>
                      <Typography sx={{ textAlign: "center" }}>
                        {page.title}
                      </Typography>
                    </MenuItem>
                  </Link>
                )
              )}
            </Menu>
          </Box>
          <TimerIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Time Track
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {(authUser?.accessToken ? afterLoginPages : beforeLoginPages).map(
              (page) => (
                <Link key={page.title} href={page.link}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.title}
                  </Button>
                </Link>
              )
            )}
          </Box>
          {authUser?.accessToken && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <Link key={setting.title} href={setting.link}>
                    <MenuItem key={setting.title} onClick={handleCloseUserMenu}>
                      <Typography sx={{ textAlign: "center" }}>
                        {setting.title}
                      </Typography>
                    </MenuItem>
                  </Link>
                ))}
                <MenuItem onClick={handleLogout}>
                  <Typography sx={{ textAlign: "center" }}>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TimeTrackAppBar;
