import {
  Box,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MobileScreenShareIcon from "@mui/icons-material/MobileScreenShare";
import { useEffect, useState } from "react";
import { ResetTvRounded } from "@mui/icons-material";
import MyButton from "../../MyButton";
import { useSelector } from "react-redux";

const CompanyOffersRequest = ({
  data,
  handlerUpdateBookingStatus,
  selectedInfluencer,
}) => {
  const { userDtls } = useSelector((state) => state?.auth);
  const [requirement, setRequirement] = useState([]);
  const [links, setLinks] = useState([]);
  const totalLinkCount = data?.requirement?.reduce(
    (total, item) => total + item?.count,
    0
  );
  useEffect(() => {
    if (selectedInfluencer?.userId || userDtls.type === "influencer") {
      const link = data?.completedByInfluencer?.find((ele) =>
        ele?.id === selectedInfluencer?.userId
          ? selectedInfluencer?.userId
          : userDtls?.userId
      );
      const tempData = JSON.parse(JSON.stringify(data || {}));
      if (link?.links?.length > 0) {
        const requirementList =
          tempData?.requirement.map((ele, index) => {
            if (ele?.count > 0) {
              ele.link = link?.links?.slice(index, index + ele?.count);
            }
            return ele;
          }) || [];
        setRequirement(requirementList);
      } else {
        setRequirement(data?.requirement);
      }
    } else {
      setRequirement(data?.requirement);
    }
    // else {

    // } else {
    //   setRequirement(data?.requirement);
  }, []);

  /**
   * To handle onchange
   */
  const handlerOnchange = (value, key) => {
    const index = links?.findIndex((ele) => ele?.includes(key));
    if (index === -1) {
      setLinks([...links, `${value},${key}`]);
    } else {
      setLinks((prev) => {
        const dupLinks = [...prev];
        dupLinks[index] = `${value},${key}`;
        return dupLinks;
      });
    }
  };
  /**
   * To check offer is completed or not
   */
  const isOfferCompleted = () => {
    if (
      data?.completedByInfluencer?.find((ele) => ele?.id === userDtls?.userId)
    ) {
      return true;
    }
    return false;
  };

  return (
    <Box>
      <Typography marginBottom={3} color={"primary"}>
        <Stack direction={"row"} gap={2} mt={2}>
          <InstagramIcon />
          Instagram
        </Stack>
      </Typography>
      {requirement?.map((ele) => {
        if (!ele.description?.length) {
          return null;
        }
        return (
          <>
            <div role="button" className="requestBtn">
              <Stack
                direction={"row"}
                gap={2}
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Stack direction={"row"} gap={2}>
                  <PostAddIcon color="#light2" />

                  <span>{ele?.name}</span>
                </Stack>
                <KeyboardArrowDownIcon />
              </Stack>
              <Divider
                sx={{ width: "90%", marginTop: 2 }}
                component="div"
                role="presentation"
              />
              {/* </Box> */}
              <Box
                width={"100%"}
                display={"flex"}
                flexDirection={"column"}
                gap={2}
              >
                {ele?.description?.map((text, idx) => {
                  return (
                    <>
                      <Typography fontSize="subtitle2">{`${ele?.name} ${
                        idx + 1
                      } Description`}</Typography>
                      <Typography fontSize="body2">{text}</Typography>
                      {isOfferCompleted() ||
                      (ele?.link && ele?.link[idx]?.split(",")[0]) ? (
                        <>
                          <Link
                            target="_blank"
                            onClick={(e) => {
                              e.preventDefault();
                              const url =
                                ele?.link && ele?.link[idx]?.split(",")[0];
                              if (url) {
                                window.location.href = url;
                              }
                            }}
                            className="border"
                            href={
                              `"${
                                ele?.link && ele?.link[idx]?.split(",")[0]
                              }"` || "#"
                            }
                            underline="none"
                          >
                            {`Link : ${
                              (ele?.link && ele?.link[idx]?.split(",")[0]) ||
                              "test"
                            }`}
                          </Link>
                        </>
                      ) : (
                        <TextField
                          disabled={
                            isOfferCompleted() ||
                            userDtls?.type === "company" ||
                            !data?.isOfferedToInfluencer
                          }
                          id="outlined-multiline-static"
                          multiline
                          rows={1}
                          variant="outlined"
                          fullWidth
                          placeholder=" Add link..."
                          defaultValue={
                            (ele?.link && ele?.link[idx]?.split(",")[0]) || null
                          }
                          onChange={(e) =>
                            handlerOnchange(
                              e?.target?.value,
                              `${ele?.name}${idx + 1}`
                            )
                          }
                        />
                      )}
                    </>
                  );
                })}
              </Box>
            </div>
          </>
        );
      })}
      {handlerUpdateBookingStatus && (
        <MyButton
          disabled={
            !(links?.length === totalLinkCount) ||
            !data?.isOfferedToInfluencer ||
            isOfferCompleted()
          }
          onClick={(e) => handlerUpdateBookingStatus(e, data, links)}
        >
          {"Save & Complete"}
        </MyButton>
      )}
    </Box>
  );
};
export default CompanyOffersRequest;
