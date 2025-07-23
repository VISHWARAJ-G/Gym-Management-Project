import {
  faAdd,
  faAddressBook,
  faPeopleGroup,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import IncreaseLogo from "../icons/IncreaseLogo";
import IncreaseLogoViolet from "../icons/IncreaseLogoViolet";
import UserLogo from "../icons/UserLogo";
import Warning from "../icons/Warning";

export const buttons = ["Overview", "Users", "Trainers", "Add Trainer"];

export const buttonLogos = {
  Overview: faAddressBook,
  Users: faUser,
  Trainers: faPeopleGroup,
  "Add Trainer": faAdd,
};

export const gridBoxes = (
  totalMembers,
  activeMembers,
  expireMembers,
  revenue
) => {
  return [
    {
      name: "Total Users",
      Logo: UserLogo,
      func: totalMembers,
      isRupeeRequired: false,
      isExtraColorRequired: false,
      isExtraBorderRequired: false,
      boxName: "",
      others: "All Users",
    },
    {
      name: "Active Users",
      Logo: IncreaseLogo,
      func: activeMembers,
      isRupeeRequired: false,
      isExtraColorRequired: true,
      isExtraBorderRequired: true,
      boxName: "active",
      others: "Active",
    },
    {
      name: "Renewal Due",
      Logo: Warning,
      func: expireMembers,
      isRupeeRequired: false,
      isExtraColorRequired: true,
      isExtraBorderRequired: true,
      boxName: "expiring",
      others: "Expiring Soon",
    },
    {
      name: "Total Revenue",
      Logo: IncreaseLogoViolet,
      func: revenue,
      isRupeeRequired: true,
      isExtraColorRequired: false,
      isExtraBorderRequired: false,
      boxName: "",
      others: "Income",
    },
  ];
};
