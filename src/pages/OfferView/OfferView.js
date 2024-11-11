import "../../style/CommonStyle.css";
import { useSelector } from "react-redux";
import InfluencerOfferView from "../../components/Influencer/Offers/InfluencerOfferView";
import CompanyOfferView from "../../components/Company/Offers/CompanyOfferView";
const OfferView = () => {
  const { userType } = useSelector((state) => state?.auth);
  return (
    <>
      {userType === "influencer" ? (
        <InfluencerOfferView />
      ) : (
        <CompanyOfferView />
      )}
    </>
  );
};
export default OfferView;
