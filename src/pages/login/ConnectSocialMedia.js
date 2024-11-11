import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
// import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import InstagramIcon from "@mui/icons-material/Instagram";
import logosyme from "../../assets/image/logosyme.png";

const ConnectSocialMedia = ({
  userName,
  setStep,
  handlerInstagramLogin,
  socialMediaOpenId,
  handlerGenerateOtp,
  props,
}) => {
  const [labelList] = useState([
    <Stack>
      <Typography>Connect with Instagram</Typography> Select and link your
      account
    </Stack>,
  ]);
  const initialFormValue = {
    termsAndConditions: {
      value: false,
    },
    privacy: {
      value: false,
    },
  };
  const [selectedSocialMedia, setSelectedSocialMedia] = useState("");
  const [isShowConformationModal, setIsShowConfirmationModal] = useState(false);
  const { userDtls, instagramData } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({ ...initialFormValue });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #b6b6b6",
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
  };

  /**
   * To handle the social media connection
   * @param (social media name)
   * @returns Null
   */
  const handleLinkSocialMedia = (name) => {
    if (name === "Facebook") {
      //Do need full things
    }
    setIsShowConfirmationModal(false);
  };

  /**
   * To show the conforation modal
   * @param (social media name)
   * @returns Jsx element
   */
  const ConformationModal = () => {
    return (
      <Modal
        padding={1}
        open={isShowConformationModal}
        onClose={() => setIsShowConfirmationModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          padding={1}
          sx={style}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
        >
          <CloseIcon
            onClick={() => setIsShowConfirmationModal(false)}
            className="modal-Close-icon"
          />
          <Typography id="modal-modal-title" variant="h5" component="h2">
            {`Connect ${selectedSocialMedia}`}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {userName}
          </Typography>
          <Divider
            sx={{
              marginTop: 1,
            }}
          />
          <Stack direction={"row"} gap={2}>
            <Button
              sx={{ textTransform: "capitalize" }}
              variant="contained"
              color="secondary"
              onClick={() => setIsShowConfirmationModal(false)}
            >
              Cancel
            </Button>
            <Button
              sx={{ textTransform: "capitalize" }}
              variant="contained"
              onClick={handlerInstagramLogin}
            >
              Connect
            </Button>
          </Stack>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      <ConformationModal />
      <Avatar
        sx={{ height: "96px", width: "96px" }}
        src={logosyme}
        alt="loading"
      ></Avatar>
      <Typography
        variant="h5"
        padding={1}
        textAlign="center"
        letterSpacing={"-0.01em"}
        fontWeight={700}
        sx={{
          color: "#8F3A98",
        }}
      >
        Create an influencer account
      </Typography>
      <Divider
        sx={{ width: "80%", mb: 10 }}
        component="div"
        role="presentation"
      />

      {/* <Container justifyContent="center" maxWidth="sm"> */}
      {/* <Stack justifyContent="center" alignItems="center" spacing={2}> */}
      {instagramData?.id ? (
        <>
          {" "}
          <Button
            sx={{ textTransform: "capitalize", width: "60%" }}
            variant="contained"
            color="light1"
          >
            {instagramData?.username}
          </Button>
        </>
      ) : (
        <>
          {labelList?.map((ele) => {
            return (
              <Button
                sx={{
                  textTransform: "capitalize",
                  width: "336px",
                  color: "#8F3A98",
                  borderRadius: "16px",
                }}
                onClick={() => {
                  console.log("clicked");
                  setIsShowConfirmationModal(true);
                  setSelectedSocialMedia(ele);
                }}
                variant="contained"
                color="light1"
                startIcon={<InstagramIcon />}
              >
                {ele}
              </Button>
            );
          })}
          <Stack>
            <FormControlLabel
              sx={{ margin: 0, fontSize: "0.9rem", color: "#8F3A98" }}
              label="I have read and accept the Terms and conditions"
              control={
                <Checkbox
                  name="checked"
                  checked={formValues?.termsAndConditions?.value}
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
              sx={{ margin: 0, fontSize: "0.9rem", color: "#8F3A98" }}
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
          </Stack>
        </>
      )}

      {/* </Stack> */}
      {/* </Container> */}
      <Stack
        marginTop={1}
        direction={"row"}
        gap={2}
        marginBottom={1}
        width={"60%"}
      >
        <>
          <Button
            variant="contained"
            sx={{ textTransform: "capitalize", flex: 1 }}
            size="large"
            onClick={() => setStep("signUp")}
          >
            Back
          </Button>
          <Button
            disabled={
              !instagramData?.username ||
              !formValues?.termsAndConditions?.value ||
              !formValues?.privacy?.value
            }
            variant="contained"
            sx={{ textTransform: "capitalize", flex: 1 }}
            size="large"
            onClick={() => {
              // handlerGenerateOtp();
              setStep("uploadProfile");
              // handlerSignUp();
            }}
          >
            Next
          </Button>
        </>
      </Stack>
    </>
  );
};
export default ConnectSocialMedia;
