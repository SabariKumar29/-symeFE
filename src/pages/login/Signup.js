import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import logosyme from "../../assets/image/logosyme.png";
import { setTemporaryUserDtls } from "../../store/Slicers/authSlice";
import { useDispatch } from "react-redux";
import MyButton from "../../components/MyButton";

const SignUp = (props) => {
  const [userType, setUserType] = useState(false);

  const dispatch = useDispatch();
  const {
    inputFieldList,
    formValues,
    setFormValues,
    handleSetTabView,
    handlerBackToSignIn,
    tabView,
    validationError,
    setStep,
    handlerSignUp,
  } = props;

  const handleUserTypeSelection = (type) => {
    handleSetTabView(type); // Pass the selected user type to the handler
    setUserType(type);
  };
  return (
    <>
      {userType ? (
        <>
          <Stack
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ height: "96px", width: "96px" }}
              src={logosyme}
              alt="loading"
            ></Avatar>
          </Stack>
          <Typography
            sx={{ color: "#8F3A98" }}
          >{`Create an ${userType} account`}</Typography>
          <Stack
            sx={{
              padding: 1.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">
              I Represent a company <Switch defaultChecked />
            </Typography>
          </Stack>
          <Box
            component="section"
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            justifyContent="center"
            gap={"15px"}
            sx={{ width: "100%" }}
          >
            {inputFieldList?.map((ele, index) => {
              return ele;
            })}
          </Box>
          {/* <Stack>
            <FormControlLabel
              sx={{ margin: 0, fontSize: "0.9rem" }}
              label="I have read and accept the Terms and conditions"
              control={
                <Checkbox
                  name="checked"
                  checked={formValues.termsAndConditions.value}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      termsAndConditions: {
                        value: e?.target?.checked,
                      },
                    })
                  }
                />
              }
            />
            <FormControlLabel
              sx={{ margin: 0, fontSize: "0.9rem" }}
              label="I have read and accept the Privacy Policy"
              control={
                <Checkbox
                  name="checked"
                  checked={formValues.privacy.value}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      privacy: {
                        value: e?.target?.checked,
                      },
                    })
                  }
                />
              }
            />
          </Stack> */}
          <Stack marginTop={1} direction={"row"} gap={2} marginBottom={1}>
            <>
              <Button
                variant="contained"
                sx={{ textTransform: "capitalize" }}
                size="large"
                onClick={handlerBackToSignIn}
              >
                Back
              </Button>
              <Button
                variant="contained"
                sx={{ textTransform: "capitalize" }}
                size="large"
                onClick={() => {
                  // if (formValues?.userType?.value === "company") {
                  handlerSignUp();
                  // } else {
                  // dispatch(setTemporaryUserDtls(formValues));
                  // setStep("connectSocialMedia");
                  // }
                }}
                disabled={
                  !formValues?.email?.value ||
                  !formValues?.password?.value ||
                  !formValues?.userName?.value ||
                  !formValues?.passwordAgain?.value ||
                  validationError?.email ||
                  validationError?.passwordAgain
                }
              >
                Next
              </Button>
            </>
          </Stack>
        </>
      ) : (
        <>
          <Box
            className="sign-up-logo"
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "end",
              justifyContent: "center",
            }}
          >
            <Stack sx={{ width: "132px", height: "132px" }}>
              <img src={logosyme} alt="loading"></img>
            </Stack>
          </Box>
          <Stack sx={{ width: "100%" }}>
            <Typography
              variant="h5"
              padding={1}
              sx={{ height: "63px" }}
              fontWeight={400}
              fontSize={20}
              marginRight={"auto"}
            >
              Create account
            </Typography>
            <Stack
              sx={{ height: "147px", padding: "10px", gap: "15px" }}
              display={"flex"}
              alignItems={"center"}
            >
              <MyButton
                sx={{ height: "56px", width: "312px", borderRadius: "16px" }}
                onClick={() => handleUserTypeSelection("influencer")}
              >
                I am an influencer
              </MyButton>
              <MyButton
                color="secondary"
                sx={{ height: "56px", width: "312px", borderRadius: "16px" }}
                onClick={() => handleUserTypeSelection("company ")}
              >
                I am an company
              </MyButton>
            </Stack>
            <Typography
              sx={{ cursor: "pointer" }}
              variant="h5"
              padding={1}
              fontWeight={400}
              fontSize={20}
              marginRight={"auto"}
              onClick={handlerBackToSignIn}
            >
              I already have one
              <Divider
                sx={{ backgroundColor: "#49454F" }}
                component="div"
                role="presentation"
              />
            </Typography>
          </Stack>
        </>
      )}
    </>
  );
};

export default SignUp;
