import { Button, Stack, styled, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Signin.css";
import LoginImage from "../../assets/image/loginBg.png";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import ConnectSocialMedia from "./ConnectSocialMedia";
import AccountConfirm from "./AccountConfirm";
import {
  useSignInMutation,
  useSignUpMutation,
  useResetPasswordMutation,
  useGenerateOtpMutation,
  useVerifyOtpMutation,
  useUploadImageMutation,
  useUpdateUserProfileMutation,
} from "../../services/apiService/userApiService";
import {
  setClearUserDtls,
  setInstagramAccessToken,
  setInstagramData,
  setIsNewUser,
  setUserDetails,
} from "../../store/Slicers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import toaster from "../../components/Toaster/toaster";
import MyButton from "../../components/MyButton";
import SignUp from "./Signup";
import EmailOtpVerification from "./EmailOtpVerification";
import ResetPassword from "./ResetPassword";
import useLoading from "../../hooks/useLoading";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import axios from "axios";
import {
  useFindUserByInstagramOpenIdMutation,
  useGetInstagramAccessTokenMutation,
  useGetInstagramLongLiveTokenMutation,
  useGetInstagramUserDataMutation,
  useInstagramOauthMutation,
  useUpdateSocialMediaOpenIdMutation,
} from "../../services/apiService/oauthApiService";
import { setTemporaryUserDtls } from "../../store/Slicers/authSlice";
// import InstagramRedirect from "./loginWithSocial/InstagramRedirect";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [signIn] = useSignInMutation();
  const [signUp] = useSignUpMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [generateOtp] = useGenerateOtpMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [instagramOauth] = useInstagramOauthMutation();
  const { startLoading, stopLoading } = useLoading();
  const [imageUpload] = useUploadImageMutation();
  const [updateProfileImage] = useUpdateUserProfileMutation();
  const [updateOpenId] = useUpdateSocialMediaOpenIdMutation();
  const [uploadFile, setUploadFile] = useState(null);
  const { userDtls, tempUserDtls, isLoggedIn, isNewUser } = useSelector(
    (state) => state?.auth
  );
  // const { tempUserDtls } = useSelector((state) => state?.user);
  const [isForgetPassword, setIsForgetPassword] = useState(false); // To set is registration or not
  const [step, setStep] = useState("signIn"); //steps - signIn,signUp,resetPassword,otpVerify,connectSocialMedia, uploadProfile,accountConfirm
  const [socialMediaOpenId, setSocialMediaOpenId] = useState({});
  const [tabView, setTabView] = useState("influencer");
  const initialFormValue = {
    userName: {
      value: "",
      error: false,
      errorMessage: "You must enter user name",
    },
    email: {
      value: "",
      error: false,
      errorMessage: "You must enter email",
    },
    password: {
      value: "",
      error: false,
      errorMessage: "You must enter your password",
    },
    passwordAgain: {
      value: "",
      error: false,
      errorMessage: "You must enter your password",
    },
    userType: {
      value: tabView,
      error: false,
    },
    termsAndConditions: {
      value: false,
    },
    privacy: {
      value: false,
    },
  };
  const initialValidationErrorValue = {
    email: false,
    passwordAgain: false,
    message: "",
  };
  const [validationError, setValidationError] = useState(
    initialValidationErrorValue
  );
  const [formValues, setFormValues] = useState({ ...initialFormValue });
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signIn");
    } else {
      navigate("/offers");
    }
  }, [isLoggedIn]);
  /**
   * To handle sign in
   */
  const handlerSignIn = async () => {
    try {
      startLoading();
      const response = await signIn({
        email: formValues?.email.value,
        password: formValues?.password.value,
      }).unwrap();
      if (response.data) {
        if (!response?.data?.isEmailVerified) {
          handlerGenerateOtp();
          setStep("otpVerify");
        } else if (response.data?.socialLogins?.instagram?.access_token) {
          // if (response.data?.socialLogins?.instagram?.access_token) {
          const instagramUserData = await getInstagramUserData(
            response.data?.socialLogins?.instagram?.access_token
          ).unwrap();
          if (instagramUserData?.id) {
            dispatch(setInstagramData(instagramUserData));
          } else {
            toaster("error", response?.message);
          }
          toaster("success", "Sign in successfully completed");
          navigateToOffer(response.data);
          // }
        } else if (response.data?.type === "influencer") {
          setStep("connectSocialMedia");
          toaster("info", "Link social media");
        } else {
          navigateToOffer(response.data);
          // toaster("success", "Sign in successfully completed");
        }
      } else {
        toaster("error", response?.message);
      }
    } catch (err) {
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to sign in:", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };

  /**
   * To handle sign up
   */
  const handlerSignUp = async (openId = socialMediaOpenId?.id) => {
    try {
      startLoading();
      const response = await signUp({
        username: formValues?.userName.value || tempUserDtls?.userName.value,
        email: formValues?.email.value || tempUserDtls?.email.value,
        password: formValues?.password.value || tempUserDtls?.password.value,
        type: formValues?.userType.value || tempUserDtls?.userType.value,
        openId,
      }).unwrap();
      if (response?.data) {
        // dispatch(setTemporaryUserDtls({}));
        // if (!isSingIn) {
        handlerGenerateOtp();
        setStep("otpVerify");
        // }
        dispatch(setUserDetails(response?.data));
      } else {
        dispatch(setInstagramData({}));
        dispatch(setUserDetails());
        // dispatch(setTemporaryUserDtls({}));
        setStep("signUp");
        dispatch(setIsNewUser(true));
        toaster("error", response?.message);
      }
    } catch (err) {
      if (err?.data?.message) {
        dispatch(setInstagramData({}));
        dispatch(setUserDetails());
        dispatch(setTemporaryUserDtls({}));
        setStep("signUp");
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to Sign up:", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };
  /**
   * To handle the forget password
   */
  const handlerResetPassword = async () => {
    try {
      startLoading();
      const response = await resetPassword({
        email: formValues?.email.value,
        password: formValues?.password.value,
      }).unwrap();
      if (response?.data) {
        toaster("success", "Reset password successfully completed");
        navigateToOffer(response.data);
      } else {
        toaster("error", "Reset password failed");
      }
    } catch (err) {
      console.error("Failed to Reset password:", err);
      toaster("error", "Something went wrong");
    } finally {
      stopLoading();
    }
  };
  /**
   * To upload the profile image
   */
  const handlerUploadImage = async () => {
    try {
      startLoading();
      const formData = new FormData();
      formData?.append("files", uploadFile);
      const imageUrl = await imageUpload(formData)?.unwrap();
      if (imageUrl?.data?.length > 0) {
        const response = await updateProfileImage({
          userId: userDtls?.userId || "51c8fc37-df37-4064-b9c7-dd31b636ec6c",
          imageId: imageUrl?.data[0],
        }).unwrap();
        if (response?.data) {
          dispatch(setUserDetails(response?.data));
          setStep("accountConfirm");
        } else {
          toaster("error", "Reset password failed");
        }
      } else {
        toaster("error", imageUrl?.message);
        return;
      }
    } catch (err) {
      console.error("Failed to Reset password:", err);
      toaster("error", "Something went wrong");
    } finally {
      stopLoading();
    }
  };
  /**
   * To navigate offers
   */
  const navigateToOffer = (data) => {
    if (data?.type === "admin" || data?.isApproved) {
      dispatch(setUserDetails(data));
      navigate("/offers", { replace: true });
    } else {
      toaster("info", "Your request is pending try after sometime");
      dispatch(setClearUserDtls());
    }
  };

  /**
   * To handle the input changes
   * @param {event}
   */
  const handleChangeFields = (e) => {
    const { name, value } = e.target;
    if (name === "email" || name === "passwordAgain") {
      setValidationError({});
    }
    setFormValues({
      ...formValues,
      [name]: {
        ...formValues[name],
        value: name === "email" ? value.toLowerCase() : value,
        error: false,
      },
    });
  };

  const handleOnBlur = (e) => {
    const { name, value } = e.target;
    if (!value) {
      setFormValues({
        ...formValues,
        [name]: {
          ...formValues[name],
          error: value ? false : true,
        },
      });
    }
  };

  /**
   * To handle sent email
   */
  const handlerGenerateOtp = async () => {
    try {
      startLoading();
      const response = await generateOtp({
        email: formValues?.email.value || tempUserDtls?.email.value,
      }).unwrap();
      if (response?.data) {
        toaster("success", "Email sent successfully");
        setStep("otpVerify");
      } else {
        toaster("error", response?.message);
      }
    } catch (err) {
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to Email sent:", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };

  /**
   * To handle verify otp
   */
  const handlerVerifyOtp = async () => {
    try {
      startLoading();
      const response = await verifyOtp({
        email: formValues?.email?.value,
        otp,
        isEmailVerification: true,
      }).unwrap();
      if (response?.data) {
        if (isNewUser && response?.data?.type === "influencer") {
          setStep("connectSocialMedia");
          return;
        }
        if (isForgetPassword) {
          toaster("success", "OTP verification successfully completed");
          navigateToOffer(response.data);
        } else {
          dispatch(setUserDetails({ ...response?.data }));
          toaster("success", "OTP verification successfully completed ");
          setStep("accountConfirm");
        }
      } else {
        toaster("error", "OTP verification failed");
      }
    } catch (err) {
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to OTP verification:", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };

  /**
   * To handle the back to signin
   */
  const handlerBackToSignIn = () => {
    setStep("signIn");
    dispatch(setTemporaryUserDtls({}));
    setFormValues(initialFormValue);
    dispatch(setIsNewUser(false));
  };

  /**
   * To validate email
   */
  const validateEmail = (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(e?.target?.value)) {
      setValidationError({
        ...validationError,
        email: false,
        emailErrorMessage: "",
      });
    } else {
      setValidationError({
        ...validationError,
        email: true,
        emailErrorMessage: "Invalid email",
      });
    }
  };

  /**
   * To validate email
   */
  const validatePassword = (value1, value2) => {
    if (value1 !== value2) {
      setValidationError({
        ...validationError,
        passwordAgain: true,
        passwordErrorMessage: "Password is not match",
      });
    } else {
      setValidationError({
        ...validationError,
        passwordAgain: false,
        passwordErrorMessage: "",
      });
    }
  };
  /**
   * To get input field for the respective tab
   * @returns array of jsx element
   */
  const inputField = () => {
    const fieldList = [];
    if (step === "signUp" && !isForgetPassword) {
      fieldList.push(
        <TextField
          onChange={handleChangeFields}
          onBlur={handleOnBlur}
          value={formValues.userName.value}
          name="userName"
          type={"text"}
          variant="outlined"
          size="small"
          placeholder="User name"
          required={true}
          error={formValues.userName.error}
          helperText={
            formValues.userName.error && formValues.userName.errorMessage
          }
          sx={{
            minWidth: 250,
            width: "50%",
            borderRadius: "15px",
          }}
        />
      );
    }
    if (step !== "resetPassword") {
      fieldList.push(
        <TextField
          onChange={(e) => {
            handleChangeFields(e);
            validateEmail(e);
          }}
          value={formValues.email.value}
          name="email"
          type={"text"}
          variant="outlined"
          size="small"
          placeholder="Email"
          required={true}
          onBlur={(e) => {
            handleOnBlur(e);
          }}
          error={formValues.email.error || validationError?.email}
          helperText={
            (formValues.email.error && formValues.email.errorMessage) ||
            (validationError?.email && validationError?.emailErrorMessage)
          }
          sx={{
            minWidth: 250,
            width: "50%",
            borderRadius: "15px",
          }}
        />
      );
    }
    if (!isForgetPassword) {
      fieldList.push(
        <TextField
          onChange={(e) => {
            handleChangeFields(e);
            if (formValues.passwordAgain.value)
              validatePassword(
                e?.target?.value,
                formValues.passwordAgain.value
              );
          }}
          value={formValues.password.value}
          name="password"
          type={"password"}
          variant="outlined"
          size="small"
          placeholder="Password"
          required={true}
          onBlur={handleOnBlur}
          error={formValues.password.error}
          helperText={
            formValues.password.error && formValues.password.errorMessage
          }
          sx={{
            minWidth: 250,
            width: "50%",
            borderRadius: "15px",
          }}
        />
      );
    }

    if ((step === "signUp" || step === "resetPassword") && !isForgetPassword) {
      fieldList.push(
        <TextField
          onChange={(e) => {
            handleChangeFields(e);
            validatePassword(e?.target?.value, formValues?.password?.value);
          }}
          value={formValues.passwordAgain.value}
          name="passwordAgain"
          type={"password"}
          size="small"
          variant="outlined"
          placeholder={isForgetPassword ? "Confirm password" : "Password again"}
          onBlur={(e) => {
            handleOnBlur(e);
          }}
          error={
            formValues?.passwordAgain?.error || validationError?.passwordAgain
          }
          helperText={
            (formValues.passwordAgain.error &&
              formValues.passwordAgain.errorMessage) ||
            (validationError?.passwordAgain &&
              validationError?.passwordErrorMessage)
          }
          sx={{
            minWidth: 250,
            width: "50%",
            borderRadius: "15px",
          }}
        />
      );
    }
    return fieldList;
  };

  /**
   * To handle set tab view
   * @param (tabName)
   * @returns null
   */
  const handleSetTabView = (tabName) => {
    setFormValues(initialFormValue);
    setTabView(tabName);
    setFormValues({
      ...initialFormValue,
      userType: {
        value: tabName,
        error: false,
      },
    });
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  /**
   * To handle instagram login
   */
  const handlerInstagramLogin = async () => {
    try {
      startLoading();
      const resp = await instagramOauth();
      if (resp?.data?.url) {
        window.location.href = `${resp?.data.url}`;
      }
    } catch (err) {
      console.log(err);
    } finally {
      // stopLoading();
    }
  };

  useEffect(() => {
    if (location?.pathname === "/signUp") {
      setStep("signUp");
    }
  }, [location.pathname]);

  //Social medial login
  const [getAccessToken] = useGetInstagramAccessTokenMutation();
  const [getInstagramUserData] = useGetInstagramUserDataMutation();
  const [getUserByInstagramOpenId] = useFindUserByInstagramOpenIdMutation();
  const [getLongLiveToken] = useGetInstagramLongLiveTokenMutation();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  /**
   * To fetch the access token
   */
  const fetchAccessToken = async (code) => {
    try {
      startLoading();
      const response = await getAccessToken({ code }).unwrap();
      if (response?.data) {
        fetchInstagramUserData(response?.data);
      } else {
        toaster("error", "Instagram login failed");
      }
    } catch (err) {
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to Instagram login :", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };
  /**
   * To fetch the instagram user data
   */
  const fetchInstagramUserData = async (responseData) => {
    try {
      startLoading();
      const resp = await getLongLiveToken(responseData?.access_token);
      if (resp?.data) {
        dispatch(setInstagramAccessToken(responseData));
      } else {
        toaster("error", "Instagram login failed");
        handlerBackToSignIn();
        return;
      }
      const instagramUserData = await getInstagramUserData(
        resp?.data?.access_token
      ).unwrap();
      if (instagramUserData?.id) {
        dispatch(setInstagramData(instagramUserData));
        setSocialMediaOpenId(instagramUserData?.id);

        if (!isNewUser) {
          // setStep()
          fetchUserByInstagramOpenId(instagramUserData?.id);
        } else {
          //update open id to that user
          await updateOpenId({
            userId: userDtls?.userId,
            openId: instagramUserData?.id,
            access_token: resp?.data?.access_token,
          });
          // handlerSignUp(instagramUserData?.id);
        }
      } else {
        toaster("error", "Instagram login failed");
        handlerBackToSignIn();
      }
    } catch (err) {
      handlerBackToSignIn();
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to Instagram login :", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };

  /**
   * To fetch the access token
   */
  const fetchUserByInstagramOpenId = async (openId) => {
    try {
      startLoading();
      const response = await getUserByInstagramOpenId({ openId }).unwrap();
      if (response?.data) {
        toaster("success", "Sign in successfully completed");
        navigateToOffer(response.data);
      } else {
        setStep("signUp");
        toaster("error", "Failed to Instagram login");
      }
    } catch (err) {
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to Instagram login :", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    if (code) {
      const frontendHost = process.env.REACT_APP_FRONTEND_HOST;
      if (window.location.origin !== frontendHost) {
        window.location.href = `${frontendHost}/signIn?code=${code}`;
        console.log(">>>>>>>>>>>>>;", window.location.origin, frontendHost);
      } else {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", frontendHost);
        fetchAccessToken(code);
        if (isNewUser) {
          setStep("connectSocialMedia");
        } else {
          setStep("signIn");
        }
      }
    }
  }, [code]);

  return (
    <div className="signIn-ctn">
      <div className="signIn-overlay">
        <div className="section-1">
          <div className="login-img-content1">
            <img
              src={LoginImage}
              className="login-image1 img1"
              alt="loading"
            ></img>
          </div>
        </div>
        <Container height="100%" className="section-2">
          <Box
            color="primary"
            variant="contained"
            width={"100%"}
            height={"100%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            className="mobile-image"
            sx={{
              // boxShadow: { xs: "none", md: 3 },
              bgcolor: "white",
            }}
            onKeyDown={(e) => {
              // className="boxing"
              if (e.key === "Enter") {
                const isEmailValid =
                  formValues?.email?.value && !formValues.email.error;
                const isPasswordValid =
                  formValues?.password?.value && !formValues.password.error;

                if (isEmailValid && isPasswordValid) {
                  handlerSignIn();
                }
              }
            }}
          >
            <Box
              component="section"
              display="flex"
              flexDirection={"column"}
              alignItems="center"
              justifyContent="flex-start"
              gap={"15px"}
              sx={{ width: "100%" }}
            >
              {step === "signIn" && (
                <>
                  <Typography
                    variant="h5"
                    padding={1}
                    textAlign="center"
                    letterSpacing={"-0.01em"}
                    fontWeight={700}
                  >
                    {isForgetPassword ? "Forget password" : "Sign in"}
                  </Typography>
                  <Divider
                    sx={{ width: "80%" }}
                    component="div"
                    role="presentation"
                  />
                  <Typography
                    padding={1}
                    textAlign="left"
                    letterSpacing={"-0.01em"}
                    fontSize={20}
                    fontWeight={500}
                  >
                    {isForgetPassword
                      ? "Enter your email to reset password"
                      : " Log in to your account"}
                  </Typography>
                  {inputField().map((ele) => {
                    return ele;
                  })}
                  {isForgetPassword ? (
                    <Stack direction={"row"} gap={2} marginTop={5}>
                      <MyButton
                        onClick={() => {
                          setStep("signIn");
                          setIsForgetPassword(false);
                          setFormValues(initialFormValue);
                          setValidationError(initialValidationErrorValue);
                        }}
                      >
                        Back
                      </MyButton>
                      <MyButton
                        disabled={
                          !formValues?.email?.value || validationError?.email
                        }
                        onClick={
                          isForgetPassword
                            ? handlerGenerateOtp
                            : handlerVerifyOtp
                        }
                      >
                        {isForgetPassword ? "Sent Otp" : "Verify Otp"}
                      </MyButton>
                    </Stack>
                  ) : (
                    <>
                      <Typography
                        role="button"
                        padding={1}
                        textAlign="center"
                        letterSpacing={"-0.01em"}
                        fontSize={18}
                        fontWeight={500}
                        onClick={() => {
                          console.log(step);
                          setIsForgetPassword(true);
                          setFormValues(initialFormValue);
                          setValidationError(initialValidationErrorValue);
                        }}
                      >
                        Forget password
                      </Typography>
                      <Button
                        onClick={handlerSignIn}
                        sx={{ textTransform: "capitalize", width: "50%" }}
                        variant="contained"
                        disabled={
                          !formValues?.email?.value ||
                          !formValues?.password?.value ||
                          formValues.email.error ||
                          formValues.password.error ||
                          validationError?.email
                        }
                      >
                        Sign in
                      </Button>
                      <Typography
                        padding={1}
                        textAlign="center"
                        letterSpacing={"-0.01em"}
                        fontSize={24}
                        fontWeight={600}
                      >
                        Or login with
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <InstagramIcon onClick={handlerInstagramLogin} />
                        <FacebookIcon />
                      </Stack>
                      <Button
                        onClick={() => {
                          setStep("signUp");
                          setFormValues(initialFormValue);
                          setValidationError(initialValidationErrorValue);
                          dispatch(setIsNewUser(true));
                        }}
                        variant="contained"
                        sx={{
                          marginBottom: 2,
                          textTransform: "capitalize",
                          width: "50%",
                        }}
                      >
                        Create account
                      </Button>
                    </>
                  )}
                </>
              )}
              {step === "signUp" && (
                <SignUp
                  {...{
                    inputFieldList: inputField(),
                    formValues,
                    setFormValues,
                    handleSetTabView,
                    tabView,
                    handlerBackToSignIn,
                    setStep,
                    validationError,
                    handlerSignUp,
                  }}
                />
              )}
              {step === "resetPassword" && (
                <ResetPassword
                  inputField={inputField()}
                  formValues={formValues}
                  validationError={validationError}
                  handlerResetPassword={handlerResetPassword}
                  handleBack={handlerBackToSignIn}
                />
              )}
              {step === "uploadProfile" && (
                <>
                  {uploadFile && (
                    <Box width={200} height={200}>
                      <img
                        style={{
                          display: "block",
                          height: "100%",
                          margin: "auto",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                        src={URL.createObjectURL(uploadFile)}
                        alt="loading"
                      ></img>
                    </Box>
                  )}
                  <Button
                    sx={{ textTransform: "capitalize" }}
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    color={"secondary"}
                    startIcon={<AddOutlinedIcon />}
                  >
                    Upload profile
                    <VisuallyHiddenInput
                      type="file"
                      accept=".jpg, .jpeg, .png,.webp"
                      onChange={(e) => {
                        setUploadFile(e?.target?.files[0]);
                      }}
                      // multiple
                    />
                  </Button>
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
                        disabled={!uploadFile}
                        variant="contained"
                        sx={{ textTransform: "capitalize", flex: 1 }}
                        size="large"
                        onClick={() => {
                          handlerUploadImage();
                        }}
                      >
                        Next
                      </Button>
                    </>
                  </Stack>
                </>
              )}
              {step === "otpVerify" && (
                <EmailOtpVerification
                  otp={otp}
                  setOtp={setOtp}
                  email={formValues?.email?.value || tempUserDtls?.email?.value}
                  handlerVerifyOtp={handlerVerifyOtp}
                  handleBack={handlerBackToSignIn}
                />
              )}
              {step === "connectSocialMedia" && (
                <ConnectSocialMedia
                  socialMediaOpenId={socialMediaOpenId}
                  userName={formValues?.userName?.value}
                  setStep={setStep}
                  handlerInstagramLogin={handlerInstagramLogin}
                  handlerSignUp={handlerSignUp}
                  handlerGenerateOtp={handlerGenerateOtp}
                  {...{
                    formValues,
                    setFormValues,
                  }}
                />
              )}
              {step === "accountConfirm" && (
                <AccountConfirm
                  name={
                    formValues?.userName?.value || tempUserDtls?.userName?.value
                  }
                />
              )}
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default SignIn;
