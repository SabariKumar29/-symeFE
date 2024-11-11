import { atom } from "recoil";

export const meAtom = atom({
  key: "meState",
  default: {
    username: "",
    userId: "",
    type: "",
    email: "",
  },
});
