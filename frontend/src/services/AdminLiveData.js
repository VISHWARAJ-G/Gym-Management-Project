import IncreaseLogo from "../icons/IncreaseLogo";
import IncreaseLogoViolet from "../icons/IncreaseLogoViolet";
import UserLogo from "../icons/UserLogo";
import Warning from "../icons/Warning";

export const buttons = ["Overview", "Users", "Trainers", "Add Trainer"];

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
      others: "All Registered Users",
    },
    {
      name: "Active Users",
      Logo: IncreaseLogo,
      func: activeMembers,
      isRupeeRequired: false,
      isExtraColorRequired: true,
      isExtraBorderRequired: true,
      boxName: "active",
      others: "Active Status",
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
      others: "Overall Income",
    },
  ];
};
