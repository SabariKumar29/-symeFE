import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import "./LandingPage.css";
import Divider from "@mui/material/Divider";
import { Drawer, Grid, Typography, useMediaQuery } from "@mui/material";
import "./LandingPage.css";
import companyImg from "../../assets/image/company.jpg";
import influencerImg from "../../assets/image/influencer.jpg";
import MyButton from "../../components/MyButton";
import logoSyme from "../../assets/image/logosyme.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CropFreeIcon from "@mui/icons-material/CropFree";
import MenuIcon from "@mui/icons-material/Menu";
import { navbarItems } from "../../utils/constants";
import { Carousel } from "react-responsive-carousel";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const imgList1 = [
    "https://images.unsplash.com/photo-1549396535-c11d5c55b9df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550133730-695473e544be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550167164-1b67c2be3973?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1550338861-b7cfeaf8ffd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
  ];
  /**
   * To view the footer
   * @returns Jsx element
   */
  const Footer = () => {
    return (
      <Box
        sx={{
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          bgcolor: "secondary.light",
          flexDirection: isMobile ? "column" : "row",
          fontWeight: "500",
        }}
      >
        <Typography variant="body2" style={{ marginBottom: isMobile ? 10 : 0 }}>
          Copyright 2022 Company Name
        </Typography>
        <Stack
          className="privacy-landing"
          sx={{ textTransform: "capitalize" }}
          direction={isMobile ? "row" : "row"}
        >
          <Link href="#" color="inherit">
            Privacy Policy
          </Link>
          <Link
            href="#"
            color="inherit"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Contact
          </Link>
          <Link href="#" color="inherit">
            Cookie Policy
          </Link>
          <Link href="#" color="inherit">
            Terms & Conditions
          </Link>
        </Stack>
      </Box>
    );
  };

  return (
    <>
      <div className="landing-ctn">
        <div className="header-ctn">
          <div className="">
            <div className="icon-syme">
              <img src={logoSyme} alt="SYME" className="logo-img" />
              <div>SYME</div>
            </div>
          </div>
          <div className="section-2">
            <button class="link-button">How it works</button>
            <button class="link-button">influencer</button>
            <button class="link-button">Companies</button>
            <button class="link-button">Invertors</button>
            <button class="link-button">contact</button>
            <MyButton onClick={() => navigate("/signIn")}>Sign in</MyButton>
            <MyButton onClick={() => navigate("/signUp")}>
              Create account
            </MyButton>
          </div>
          <Box
            display="flex"
            alignItems="center"
            sx={{ display: { md: "none" } }}
          >
            <MyButton onClick={() => navigate("/signIn")}>Sign in</MyButton>
            <Button onClick={() => setNavbarOpen(true)}>
              <MenuIcon />
            </Button>
          </Box>
        </div>

        {/* side nav bar in mobile screens  */}
        <Drawer
          open={isNavbarOpen}
          onClose={() => setNavbarOpen(false)}
          PaperProps={{ sx: { backgroundColor: "#EDF0F7" } }}
        >
          <Grid container direction="column" spacing={3} padding={2}>
            {navbarItems.map((item) => (
              <Grid
                item
                display="flex"
                alignItems="center"
                onClick={() => setNavbarOpen(false)}
              >
                <CropFreeIcon />
                <Typography sx={{ ml: 1 }} fontSize={20}>
                  {item}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Drawer>

        <div className="ctn-1">
          <Container maxWidth="lg">
            <Box color="primary" variant="contained" sx={{ height: "100vh" }}>
              <div className="boxing">
                <Typography
                  variant="h2"
                  padding={3}
                  textAlign="center"
                  marginTop={4}
                  letterSpacing={"-0.06em"}
                  className=""
                  sx={{ bgcolor: "light" }}
                >
                  Lorem
                </Typography>
                <Typography
                  variant="h5"
                  // padding={4}
                  textAlign="center"
                  // fontFamily={"Krona One"}
                  letterSpacing={"-0.06em"}
                  className="login-title"
                >
                  Lorem
                </Typography>
                <Typography
                  variant="h5"
                  // padding={4}
                  textAlign="center"
                  // fontFamily={"Krona One"}
                  letterSpacing={"-0.06em"}
                  // className="login-title"
                  style={{ backgroundColor: "light" }}
                >
                  Head line goes here...
                </Typography>
                <Typography
                  variant="h5"
                  textAlign="center"
                  letterSpacing={"-0.06em"}
                  className="login-title"
                >
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </Typography>
                <Box marginTop={10}>
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained">Learn more</Button>
                    <Button variant="contained">Request demo</Button>
                  </Stack>
                </Box>
              </div>
            </Box>
          </Container>
        </div>

        <Container maxWidth="lg">
          <Box
            color="primary"
            variant="contained"
            width={"100%"}
            height={"100%"}
            sx={{ borderRadius: "15px" }}
          >
            <div className="boxing">
              <Typography
                variant="h2"
                padding={3}
                textAlign="center"
                // fontFamily={"Krona One"}
                letterSpacing={"-0.06em"}
                className=""
                sx={{ bgcolor: "light" }}
              >
                lorem
              </Typography>
              <Typography
                variant="h6"
                padding={4}
                textAlign="center"
                // fontFamily={"Krona One"}
                letterSpacing={"-0.06em"}
                // className="login-title"
              >
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </Typography>
              <Box
                className="section2-box1"
                component="section"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={4}
                p={2}
                width={"100%"}
                height={"100%"}
              >
                <Box
                  height={"100%"}
                  component="section"
                  sx={{ p: 2, border: "1px solid grey", borderRadius: 15 }}
                >
                  <Container maxWidth="sm">
                    <img className="image" src={companyImg} alt="Paris"></img>
                  </Container>
                  <Container maxWidth="sm">
                    <Typography
                      variant="h5"
                      padding={4}
                      textAlign="center"
                      // fontFamily={"Krona One"}
                      letterSpacing={"-0.06em"}
                      className="login-title"
                    >
                      Influencers
                    </Typography>
                    <Typography
                      variant="body2"
                      padding={4}
                      textAlign="center"
                      letterSpacing={"-0.06em"}
                      className="login-title"
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      At purus tellus arcu sit nibh consectetur.
                    </Typography>
                  </Container>
                </Box>
                <Box
                  height={"100%"}
                  component="section"
                  sx={{ p: 2, border: "1px solid grey", borderRadius: 15 }}
                >
                  <Container maxWidth="sm">
                    <img
                      className="image"
                      src={influencerImg}
                      alt="Paris"
                    ></img>
                  </Container>
                  <Container maxWidth="sm">
                    <Typography
                      variant="h5"
                      padding={4}
                      textAlign="center"
                      // fontFamily={"Krona One"}
                      letterSpacing={"-0.06em"}
                      className="login-title"
                    >
                      Companies
                    </Typography>
                    <Typography
                      variant="body2"
                      padding={4}
                      textAlign="center"
                      // fontFamily={"Krona One"}
                      letterSpacing={"-0.06em"}
                      className="login-title"
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      At purus tellus arcu sit nibh consectetur.
                    </Typography>
                  </Container>
                </Box>
              </Box>
            </div>
          </Box>
          <Divider
            sx={{
              marginTop: 4,
              marginBottom: 4,
            }}
          />
        </Container>

        <Container maxWidth="lg">
          <Box
            component="section"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={4}
            p={2}
            width={"100%"}
            height={"100%"}
          >
            <MyButton onClick={() => navigate("/signIn")}>
              Create account
            </MyButton>
          </Box>
          {console.log("isMobile", isMobile)}
          {isMobile ? (
            <Box display="flex" justifyContent="center">
              <Carousel showThumbs={false}>
                {imgList1?.map((ele, index) => {
                  return (
                    <img
                      key={index}
                      src={ele}
                      style={{
                        display: "block",
                        height: "100%",
                        margin: "auto",
                        width: "100%",
                        borderRadius: "15px",
                      }}
                      alt="loading"
                    />
                  );
                })}
              </Carousel>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {imgList1?.map((ele, index) => {
                return (
                  <Grid
                    item
                    md={3}
                    xs={12}
                    sx={{
                      display: isMobile ? "inline-block" : "block",
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    <img
                      key={index}
                      src={ele}
                      style={{
                        display: "block",
                        height: "100%",
                        margin: "auto",
                        width: "100%",
                        borderRadius: "15px",
                      }}
                      alt="loading"
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
        <Footer />
      </div>
    </>
  );
};
export default LandingPage;
