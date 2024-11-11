import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useFetchUserListMutation } from "../../../services/apiService/adminApiService";
import useLoading from "../../../hooks/useLoading";
import toaster from "../../../components/Toaster/toaster";
import SimpleTable from "../../../components/simpleTable/SimpleTable";
import { IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import {
  useCreateChatMutation,
  useUpdateUserMutation,
} from "../../../services/apiService/userApiService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MyButton from "../../../components/MyButton";
const Users = () => {
  const { userDtls } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [createChat] = useCreateChatMutation();
  const [tabName, setTabName] = useState("all");
  const [fetchUserList] = useFetchUserListMutation();
  const [updateUserInfo] = useUpdateUserMutation();
  const { startLoading, stopLoading } = useLoading(); //To set loading
  const [userList, setUserList] = useState([]);

  /**
   * To approve the user
   */
  const handlerApproveUser = async (userId) => {
    try {
      startLoading();
      const response = await updateUserInfo({
        userId,
        toBeUpdated: { isApproved: true },
      }).unwrap();
      if (response?._id) {
        getUserList(tabName);
      } else {
        console.error("error", "Approve user failed");
      }
    } catch (err) {
      if (err?.data?.message) {
        setUserList([]);
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to fetch user list", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };
  /**
   * To fetch the user list based on the approved type
   */
  const getUserList = async (tabName) => {
    try {
      startLoading();
      let payload;
      if (tabName === "request") {
        payload = false;
      } else if (tabName === "users") {
        payload = true;
      } else {
        payload = "all";
      }
      const response = await fetchUserList(payload).unwrap();
      if (response?.data) {
        setUserList(response?.data);
      } else {
        setUserList([]);
      }
    } catch (err) {
      if (err?.data?.message) {
        setUserList([]);
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to fetch user list", err);
        toaster("error", "Something went wrong");
      }
    } finally {
      stopLoading();
    }
  };
  /**
   * To handle the chat navigation
   */
  const handlerChat = async (data) => {
    try {
      startLoading();
      const payload = {
        isGroupChat: false,
        id: userDtls?.userId,
        userId: data?.userId,
      };
      const response = await createChat(payload).unwrap();
      if (response?.data[0]?._id || response?.data?._id) {
        navigate(`/chat/${response?.data[0]?._id || response?.data?._id}`);
      } else {
        toaster("error", "Chat creation failed");
      }
    } catch (err) {
      if (err?.data?.message) {
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
   * To set the tab name
   */
  const handlerSetTabName = (e, tabName) => {
    setTabName(tabName);
  };
  /**
   * To set column
   */
  const columns = [
    {
      width: 100,
      label: "User Name",
      dataKey: "username",
    },
    {
      width: 100,
      label: "Email",
      dataKey: "email",
    },
    {
      width: 100,
      label: "Type",
      dataKey: "type",
    },
    {
      width: 100,
      label: "Approved",
      dataKey: "isApproved",
      cell: (tableData) => {
        return tableData["isApproved"] ? (
          "User"
        ) : (
          <MyButton onClick={() => handlerApproveUser(tableData?.userId)}>
            Accept
          </MyButton>
        );
      },
    },
    {
      width: 50,
      label: "",
      dataKey: "chat",
      cell: (column) => {
        return (
          <IconButton
            sx={{ height: "32px" }}
            color="primary"
            onClick={() => {
              handlerChat(column);
            }}
          >
            <ChatIcon />
          </IconButton>
        );
      },
    },
  ];

  useEffect(() => {
    if (tabName) {
      getUserList(tabName);
    }
  }, [tabName]);
  return (
    <>
      <TabContext value={tabName} sx={{ padding: "5px", width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handlerSetTabName}
            aria-label="lab API tabs example"
            sx={{ textTransform: "capitalize" }}
          >
            <Tab
              sx={{ textTransform: "capitalize" }}
              fontWeight={700}
              label="All"
              value="all"
              color="white"
            />
            <Tab
              sx={{ textTransform: "capitalize" }}
              label="Request"
              value="request"
            />
            <Tab
              sx={{ textTransform: "capitalize" }}
              label="Users"
              value="users"
            />
          </TabList>
        </Box>
        <Box
          width={"100%"}
          height={"calc(100% - 49px)"}
          padding={1}
          boxShadow={3}
        >
          <SimpleTable
            tableData={userList}
            columns={columns}
            handlerApproveUser={handlerApproveUser}
          ></SimpleTable>
        </Box>
      </TabContext>
    </>
  );
};

export default Users;
