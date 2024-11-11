import React, { useState } from "react";
import {
  Stack,
  Typography,
  IconButton,
  Paper,
  Switch,
  Divider,
  Modal,
  TextField,
  Button,
  Box,
  FormHelperText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setClearUserDtls } from "../../store/Slicers/authSlice";
import "./setting.css";
import LogoutIcon from "@mui/icons-material/Logout";
import toaster from "../../components/Toaster/toaster";
import { useResetPasswordMutation } from "../../services/apiService/userApiService";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import CropFreeIcon from "@mui/icons-material/CropFree";

const SettingsPanel = () => {
  const navigate = useNavigate();

  const [resetPassword] = useResetPasswordMutation();
  const { userDtls, instagramData, isCompany } = useSelector(
    (state) => state?.auth
  );
  const dispatch = useDispatch();
  /**
   * To logout
   */
  const handlerLogout = () => {
    dispatch(setClearUserDtls());
  };
  const [passwordModal, setPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleClose = () => {
    setPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
  };

  const handleSavePassword = async () => {
    let isValid = true;
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    try {
      const responce = await resetPassword({
        email: userDtls?.email,
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      if (
        responce?.error?.data?.message ===
        "The old password does not match the existing password"
      ) {
        setCurrentPasswordError(
          "The current password does not match the existing password"
        );
      }
      if (!currentPassword) {
        setCurrentPasswordError("Current password is required");
        isValid = false;
      }
      if (!newPassword) {
        setNewPasswordError("New password is required");
        isValid = false;
      }
      // else if (newPassword.length < 4) {
      //   setNewPasswordError("Password must be at least 6 characters");
      //   isValid = false;
      // }
      if (newPassword !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
        isValid = false;
      }
      if (responce?.data?.message === "Password updated successfully") {
        toaster("success", "Password changed successfully!");
        handleClose();
      }
    } catch (error) {
      toaster("error", "Something went wrong");
    }
  };
  return (
    <div className="setting-panel">
      <Stack
        className="setting-stack-panel"
        spacing={3}
        sx={{
          overflow: "auto",
          height: "100vh",
          width: "85%",
          padding: 2,
          backgroundColor: "#F0F4F8",
          borderRadius: 2,
        }}
      >
        {/* Account Settings */}
        <Typography variant="h6" fontWeight="bold">
          Account Settings
        </Typography>
        <Stack spacing={2} className="account-settings">
          <Paper
            elevation={0}
            sx={{
              marginTop: "16px !important",
              height: "54px",
              padding: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2">Full Name</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">{userDtls?.username}</Typography>
              <IconButton size="small">
                <EditIcon
                  fontSize="small"
                  onClick={() => navigate("/accounts")}
                />
              </IconButton>
            </Stack>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              padding: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2">Username</Typography>
            <Typography>
              {userDtls?.username}
              <IconButton size="small">
                <AddIcon fontSize="small" />
              </IconButton>
            </Typography>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              padding: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2">Email</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">{userDtls?.email}</Typography>
            </Stack>
          </Paper>
          <Paper
            elevation={0}
            sx={{
              padding: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2">Password</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">***</Typography>
              <IconButton size="small">
                <EditIcon
                  fontSize="small"
                  onClick={() => setPasswordModal(true)}
                />
              </IconButton>
            </Stack>
          </Paper>
        </Stack>
        {/* Social media */}
        {userDtls?.type === "influencer" && (
          <>
            <Typography variant="subtitle1" fontWeight="bold">
              Social Media
            </Typography>
            <Divider />
            {/* <Stack spacing={2} className="Social-Media">
          <Paper
            elevation={0}
            sx={{
              marginTop: "16px !important",
              height: "54px",
              padding: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              <FacebookIcon fontSize="large" sx={{ color: "#3b5998", mr: 2 }} />
              <Typography variant="body2">{`@${userDtls?.username}`}</Typography>
            </Stack>
            <IconButton size="small">
              <EditIcon
                fontSize="small"
                onClick={() => navigate("/accounts")}
              />
            </IconButton>
          </Paper>
        </Stack> */}
            <Stack spacing={2} className="Social-Media">
              <Paper
                elevation={0}
                sx={{
                  marginTop: "16px !important",
                  height: "54px",
                  padding: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={3}>
                  <InstagramIcon
                    fontSize="large"
                    sx={{ color: "#E4405F", mr: 2 }}
                  />
                  <Typography variant="body2">{`@${instagramData?.username}`}</Typography>
                  <Typography variant="body2">{`${instagramData?.followers_count} Followers`}</Typography>
                </Stack>
                <IconButton size="small">
                  <EditIcon
                    fontSize="small"
                    onClick={() => navigate("/accounts")}
                  />
                </IconButton>
              </Paper>
            </Stack>
            <Stack spacing={2} className="Social-Media">
              <Paper
                elevation={0}
                sx={{
                  marginTop: "16px !important",
                  height: "54px",
                  padding: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={3}>
                  <CropFreeIcon fontSize="large" sx={{ mr: 2 }} />
                  <Typography fontWeight="bold">Link More</Typography>
                </Stack>
                <IconButton size="small">
                  <AddIcon
                    fontSize="medium"
                    onClick={() => navigate("/accounts")}
                  />
                </IconButton>
              </Paper>
            </Stack>

            {/* favorite brands */}
            <Typography variant="subtitle1" fontWeight="bold">
              Favorite Brands
            </Typography>
            <Divider />
            {/* Mini Bio */}
            <Typography variant="subtitle1" fontWeight="bold">
              Mini Bio
            </Typography>
            <Divider />

            <Stack spacing={2} className="">
              <Paper
                elevation={0}
                sx={{
                  marginTop: "16px !important",
                  maxHeight: "200px",
                  padding: 1.5,
                }}
              >
                <Stack direction="column" alignItems="left">
                  <Typography fontWeight="bold">lorem some content</Typography>
                  <IconButton size="small">Edit</IconButton>
                </Stack>
              </Paper>
            </Stack>
          </>
        )}

        {/* Notification Settings */}
        <Typography variant="h6" fontWeight="bold">
          Notification Settings
        </Typography>

        {/* Offers Section */}
        <Stack className="notification-offer">
          <Stack>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{ paddingTop: 2 }}
            >
              Offers
            </Typography>
            <Paper
              elevation={0}
              sx={{
                padding: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2">
                Receive Offer Notifications
              </Typography>
              <Switch defaultChecked />
            </Paper>
          </Stack>
          <Stack>
            {/* Locations Section */}
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{ paddingTop: 2 }}
            >
              Locations
            </Typography>
            <Paper
              elevation={0}
              sx={{
                padding: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2">Setting</Typography>
              <Switch defaultChecked />
            </Paper>
          </Stack>
        </Stack>
        {/* Companies Section */}
        <Typography
          variant="subtitle1"
          fontWeight="medium"
          sx={{ paddingTop: 2 }}
        >
          Companies
        </Typography>
        <Stack spacing={2} className="setting-changes">
          <Paper
            className="setting-companies"
            elevation={0}
            sx={{
              padding: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2">Setting</Typography>
            <Switch defaultChecked />
          </Paper>
          <Paper
            elevation={0}
            sx={{
              padding: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2">New Companies to Follow</Typography>
            <Switch defaultChecked />
          </Paper>
        </Stack>
        <Divider
          sx={{ width: "90%", marginTop: 2 }}
          component="div"
          role="presentation"
        />
        <Button
          sx={{ marginLeft: 4, color: "dark", textTransform: "capitalize" }}
          color="gray"
          onClick={handlerLogout}
        >
          <LogoutIcon />
          <span>Logout</span>
        </Button>
      </Stack>
      {passwordModal && (
        <Modal
          open={passwordModal}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              width: "400px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography id="modal-title" variant="h6">
              Change Password
            </Typography>

            <Typography>Current Password</Typography>
            <TextField
              id="current-password"
              type="password"
              variant="outlined"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              error={Boolean(currentPasswordError)}
            />
            {currentPasswordError && (
              <FormHelperText error>{currentPasswordError}</FormHelperText>
            )}

            <Typography>New Password</Typography>
            <TextField
              id="new-password"
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              error={Boolean(newPasswordError)}
            />
            {newPasswordError && (
              <FormHelperText error>{newPasswordError}</FormHelperText>
            )}

            <Typography>Retype New Password</Typography>
            <TextField
              id="confirm-password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              error={Boolean(confirmPasswordError)}
            />
            {confirmPasswordError && (
              <FormHelperText error>{confirmPasswordError}</FormHelperText>
            )}

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSavePassword}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default SettingsPanel;
