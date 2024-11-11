import { Box, Button, Divider, Stack, Typography } from "@mui/material";

const ResetPassword = ({
  inputField,
  formValues,
  validationError,
  handlerResetPassword,
  handleBack,
}) => {
  return (
    <>
      <Typography
        variant="h5"
        padding={1}
        textAlign="center"
        letterSpacing={"-0.01em"}
        fontWeight={700}
      >
        Reset your password
      </Typography>
      <Divider sx={{ width: "80%" }} component="div" role="presentation" />
      <Typography
        variant="body2"
        padding={1}
        textAlign="center"
        letterSpacing={"-0.01em"}
        fontWeight={500}
        color={"primary"}
      >
        The password must be different than before
      </Typography>
      <Box
        component="section"
        display="flex"
        flexDirection={"column"}
        alignItems="center"
        justifyContent="center"
        gap={"15px"}
        sx={{ width: "100%" }}
        padding={1}
      >
        {inputField?.map((ele, index) => {
          return ele;
        })}
        <Stack marginTop={1} direction={"row"} gap={2} marginBottom={1}>
          <>
            <Button
              variant="contained"
              sx={{ textTransform: "capitalize" }}
              size="large"
              onClick={handleBack}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: "capitalize" }}
              size="large"
              onClick={handlerResetPassword}
              disabled={
                !formValues?.password?.value ||
                !formValues?.passwordAgain?.value ||
                validationError?.passwordAgain
              }
            >
              Continue
            </Button>
          </>
        </Stack>
      </Box>
    </>
  );
};
export default ResetPassword;
