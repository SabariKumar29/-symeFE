import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import OTPInput from "../../components/OTPInput/OTPInput";
import MyButton from "../../components/MyButton";
import { useSelector } from "react-redux";

const EmailOtpVerification = ({
  otp,
  setOtp,
  email,
  handlerGenerateOtp,
  handlerVerifyOtp,
  handleBack,
}) => {
  const { userDtls } = useSelector((state) => state.auth);
  return (
    <>
      <Typography
        variant="h5"
        padding={1}
        textAlign="center"
        letterSpacing={"-0.01em"}
        fontWeight={700}
      >
        Enter code
      </Typography>
      <Divider sx={{ width: "80%" }} component="div" role="presentation" />
      <Typography
        variant="body2"
        padding={1}
        textAlign="center"
        letterSpacing={"-0.01em"}
        fontWeight={700}
        mt={12}
      >
        We sent a code to {email || userDtls?.email}
      </Typography>
      <Box
        component="section"
        display="flex"
        flexDirection={"column"}
        alignItems="center"
        justifyContent="center"
        gap={1}
        sx={{ width: "100%" }}
        padding={1}
      >
        <OTPInput otp={otp} setOtp={setOtp} />
        <Typography
          variant="body2"
          padding={1}
          textAlign="center"
          letterSpacing={"-0.01em"}
          fontWeight={700}
        >
          <Box
            component="section"
            display="flex"
            flexDirection={"row"}
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%" }}
            padding={1}
          >
            Don't receive the OTP?
            <MyButton variant={"text"} onClick={handlerGenerateOtp}>
              Resent OTP
            </MyButton>
          </Box>
        </Typography>
        <Stack marginTop={1} direction={"row"} gap={2} marginBottom={1}>
          <>
            <Button
              variant="contained"
              sx={{ textTransform: "capitalize" }}
              size="large"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: "capitalize" }}
              size="large"
              onClick={handlerVerifyOtp}
              disabled={!(otp?.length > 5)}
            >
              Verify
            </Button>
          </>
        </Stack>
      </Box>
    </>
  );
};

export default EmailOtpVerification;
