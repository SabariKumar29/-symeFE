import moment from "moment/moment";
import { saveAs } from "file-saver";

export const formatDate = (dateString, format = "DD MMM HH:mm") => {
  return moment(dateString).format(format);
};

export const downloadFunction = async (url, fileName) => {
  try {
    saveAs(url, fileName);
  } catch (err) {
    console.log(err);
  }
};
