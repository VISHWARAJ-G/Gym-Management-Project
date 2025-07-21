import CalenderLogo from "../icons/CalenderLogo";
import PlanLogo from "../icons/PlanLogo";
import TrainerNameLogo from "../icons/TrainerNameLogo";
import PDFLogo from "../icons/PDFLogo";

export const gridDetail = (paidUserDetails, daysLeft, end_date) => {
  return [
    {
      mainName: "Current Plan",
      logo: PlanLogo,
      name: paidUserDetails?.plans?.plan_name,
      stringName: `Expires ${end_date}`,
    },
    {
      mainName: "Personal Trainer",
      logo: TrainerNameLogo,
      name: paidUserDetails?.trainer?.name,
      stringName: `Certified Professional`,
    },
    {
      mainName: "Days Until Renewal",
      logo: CalenderLogo,
      name: daysLeft,
      stringName: `Renewal on ${end_date}`,
    },
    {
      mainName: "Payment Status",
      logo: PDFLogo,
      name:
        paidUserDetails?.status === "active" ||
        paidUserDetails?.status === "expired"
          ? "Paid"
          : "Unpaid",
      stringName: `Next: ${end_date}`,
    },
  ];
};
