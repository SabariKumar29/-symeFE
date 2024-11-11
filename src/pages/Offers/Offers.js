import InfluencerOffers from "../../components/Influencer/Offers/InfluencerOffer";
import CompanyOffer from "../../components/Company/Offers/CompanyOffers";
import "../../style/CommonStyle.css";
import { useSelector } from "react-redux";
const Offers = () => {
  const { userType } = useSelector((state) => state?.auth);
  return (
    <>{userType === "influencer" ? <InfluencerOffers /> : <CompanyOffer />}</>
  );
};
export default Offers;
