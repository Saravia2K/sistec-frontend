"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import {
  Box,
  Menu,
  List,
  Avatar,
  AppBar,
  Button,
  Drawer,
  Toolbar,
  Tooltip,
  Divider,
  MenuItem,
  ListItem,
  Container,
  IconButton,
  Typography,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import links from "./links";

import logotype_sistec from "@/assets/images/logotype_sistec.png";
import Link from "next/link";

export default function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [pages, setPages] = useState(links.admin);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="relative" sx={{ bgcolor: "#fff", boxShadow: "none" }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: { xs: "space-between", md: "none" },
          }}
        >
          <IconButton
            onClick={() => setOpenDrawer(true)}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={() => setOpenDrawer(false)}
            >
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inicio" />
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider />
              <List>
                {pages.links.map(({ text, path, icon: I }) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <I />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>

          <Link href="/">
            <Image
              src={logotype_sistec}
              alt="Sistec"
              style={{ height: "50px", width: "auto" }}
            />
          </Link>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
              pr: 6,
              gap: 6,
            }}
          >
            {pages.links.map(({ text, path }) => (
              <Button
                key={text}
                // onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "#078349",
                  display: "block",
                  textTransform: "none",
                }}
              >
                {text}
              </Button>
            ))}
          </Box>

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
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

const settings = ["Profile", "Account", "Dashboard", "Logout"];
