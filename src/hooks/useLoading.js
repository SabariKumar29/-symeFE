import { setIsLoading } from "../store/Slicers/authSlice";
import { useDispatch } from "react-redux";
//For the loading screen
const useLoading = () => {
  const dispatch = useDispatch();

  const startLoading = () => dispatch(setIsLoading(true));
  const stopLoading = () => dispatch(setIsLoading(false));

  return { startLoading, stopLoading };
};
export default useLoading;
