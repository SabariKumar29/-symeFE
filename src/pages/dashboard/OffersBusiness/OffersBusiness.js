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

const OffersBusiness = () => {
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
    <div style={{ height: "100%", overflowY: "auto" }}>offers business</div>
  );
};

export default OffersBusiness;
