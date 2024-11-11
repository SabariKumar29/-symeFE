import React, { useState, useEffect } from "react";
import { api } from "../../../api/api";
import NoImage from "../../../resources/no-image.png";
import iconCalendar from "../../../resources/icon-calendar.svg";
import iconBookmark from "../../../resources/icon-bookmark.svg";
import "./Offer.css";

const Offer = (props) => {
  const offer = props.offer;
  const [creator, setCreator] = useState();

  useEffect(() => {
    const fetchCreator = async (id) => {
      try {
        const data = await api.get(`barracks/user/fetch/${id}`);
        setCreator(data);
        console.log(data);
        return data;
      } catch (e) {
        console.log(e);
      }
    };

    fetchCreator(offer.createdBy);
  }, []);

  const getImageIndex = (id, imagesArray) => {
    const index = imagesArray.findIndex((item) => item.imageId === id);
    return index;
  };

  const convertDate = (date_string) => {
    let date = new Date(date_string);
    return ` ${date.getDate()} ${
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][date.getMonth()]
    }`;
  };

  return (
    <div className="offer-wrapper">
      <div className="offer-top-wrapper">
        <img
          className="offer-title-image"
          src={offer.offerImageUrl ? offer.offerImageUrl : NoImage}
          alt={"AccountImage"}
        />
        <div className="offer-top-right">
          <div className="offer-top-title">{offer.title}</div>
          <div className="offer-top-subheader">
            {creator && (
              <>
                <img
                  className="offer-top-company-image"
                  src={
                    creator.profileImage && creator.images
                      ? creator.images[
                          getImageIndex(creator.profileImage, creator.images)
                        ].url
                      : NoImage
                  }
                  alt={"AccountImage"}
                />
                <div className="offer-top-company-title">
                  by <span>{creator && creator.username}</span>
                </div>
                <div
                  className="offer-top-booked"
                  style={{
                    backgroundColor:
                      offer.spots.booked === 0
                        ? "#34AFF7"
                        : offer.spots.booked === offer.spots.availableSpots
                        ? "#717D96"
                        : "#FE9D35",
                  }}
                >
                  {offer.spots.booked}/{offer.spots.availableSpots} Booked
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="offer-mid-wrapper">
        <div className="offer-mid-left">{offer.types[0]}</div>
        <div className="offer-mid-right">
          <img
            className="offer-mid-calendar-image"
            src={iconCalendar}
            alt={"CalendarImage"}
          />
          <span>Due </span>
          {convertDate(offer.availableDates.from)} -{" "}
          {convertDate(offer.availableDates.to)}
        </div>
      </div>
      <div className="offer-bottom-wrapper">
        <img
          className="offer-bottom-bookmark-image"
          src={iconBookmark}
          alt={"BookmarImage"}
        />
        <div
          className="offer-bottom-accept-button"
          onClick={() => {
            console.log("clicked");
          }}
        >
          Accept
        </div>
      </div>
    </div>
  );
};

export default Offer;
