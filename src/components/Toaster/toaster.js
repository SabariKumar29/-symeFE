import { Bounce, toast } from "react-toastify";

const toaster = (type, message) => {
  const toasterStyle = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };
  toast.dismiss();
  switch (type) {
    case "success":
      return toast.success(message, toasterStyle);
    case "warning":
      return toast.warn(message, toasterStyle);
    case "error":
      return toast.error(message, toasterStyle);
    default:
      return toast.info(message, toasterStyle);
  }
};
export default toaster;
