import IncreaseYellow from "../icons/IncreaseYellow";
import MemberCountBlack from "../icons/MemberCountBlack";
import MemberCountPurple from "../icons/MemberCountPurple";

export const memberDetail = (
  activeMemberCount,
  memberCount,
  renewalMemberCount
) => {
  return [
    {
      boxName: "Assigned Members",
      logo: MemberCountBlack,
      mainCount: memberCount,
    },
    {
      boxName: "Active Members",
      logo: MemberCountPurple,
      mainCount: activeMemberCount,
      colorName: "green",
    },
    {
      boxName: "Renewal Due",
      logo: IncreaseYellow,
      mainCount: renewalMemberCount,
      colorName: "yellow",
    },
  ];
};
