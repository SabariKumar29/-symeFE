import toaster from "../components/Toaster/toaster";
import { useCreateNotificationMutation } from "../services/apiService/userApiService";

// Custom hook for notifications
const useNotification = () => {
  const [createNotification, { isLoading, isError, error }] =
    useCreateNotificationMutation();

  // Function to send the notification
  const sendNotification = async (data) => {
    try {
      const response = await createNotification(data).unwrap();
      if (!response?.data) {
        toaster("error", "Push notification failed");
      }
    } catch (err) {
      if (err?.data?.message) {
        toaster("error", err?.data?.message);
      } else {
        console.error("Failed to push notification:", err);
        toaster("error", "Something went wrong");
      }
    }
  };

  // Return the function and loading/error states (optional)
  return { sendNotification, isLoading, isError, error };
};

export default useNotification;
