import React, { useState, useEffect } from "react";

import { useRecoilState } from "recoil";
import { meAtom } from "../../../atoms/meAtom";
import { api } from "../../../api/api";
import { Dialog, Button } from "@mui/material";
import CreateNewOfferForm from "./CreateNewOfferForm";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import OfferedByMe from "./OfferedByMe";
import OfferedToMe from "./OfferedToMe";
import Offer from "./Offer";

const OffersInfluencer = () => {
  const [user, setUser] = useRecoilState(meAtom);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tabIndex, setTabIndex] = useState("1");
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchActiveOffers = async () => {
      try {
        const data = await api.get("dealer/offer/fetchActive");
        setOffers(data);
        return data;
      } catch (e) {
        console.log(e);
      }
    };

    fetchActiveOffers();
  }, []);

  useEffect(() => {
    console.log("fetch offers here", offers);
  }, [offers]);

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      {/*       <Button
        variant="contained"
        color="primary"
        onClick={handleOpenCreateOfferModal}
      >
        Create new offer
      </Button>
      <Dialog open={showCreateModal} onClose={handleCloseCreateOfferModal}>
        <CreateNewOfferForm
          handleClose={handleCloseCreateOfferModal}
          handleCreateNewOffer={handleCreateNewOffer}
          user={user}
        />
      </Dialog>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tabIndex}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleTabChange}
              aria-label="lab API tabs example"
            >
              <Tab label="Created by me" value="1" />
              <Tab label="Offered to me" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <OfferedByMe user={user} />
          </TabPanel>
          <TabPanel value="2">
            <OfferedToMe user={user} />
          </TabPanel>
        </TabContext>
      </Box> */}
      <OfferedToMe user={user} />
      {offers.map((offer) => {
        return <Offer offer={offer} />;
      })}
    </div>
  );
};

export default OffersInfluencer;
