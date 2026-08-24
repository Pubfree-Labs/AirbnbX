import styled from "styled-components";
import { Link } from "react-router-dom";

import Tag from "../../ui/Tag";
import { Flag } from "../../ui/Flag";
import Button from "../../ui/Button";
import CheckoutButton from "./CheckoutButton";
import { HiOutlineGlobeAlt } from "react-icons/hi2";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;

  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

const FlagPlaceholder = styled.span`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  color: var(--color-grey-400);

  & svg {
    width: 1.8rem;
    height: 1.8rem;
  }
`;

function TodayItem({ activity }) {
  const { id, status, guests, numNights } = activity;
  const hasValidFlag = /^https?:\/\//i.test(guests.countryFlag ?? "");

  return (
    <StyledTodayItem>
      {status === "unconfirmed" && <Tag type="green">即将入住</Tag>}
      {status === "checked-in" && <Tag type="blue">即将退房</Tag>}

      {hasValidFlag ? (
        <Flag src={guests.countryFlag} alt={`${guests.country || "顾客"}旗帜`} />
      ) : (
        <FlagPlaceholder title="尚未填写国家或地区" aria-label="尚未填写国家或地区">
          <HiOutlineGlobeAlt />
        </FlagPlaceholder>
      )}
      <Guest>{guests.fullName}</Guest>
      <div>{numNights}晚</div>

      {status === "unconfirmed" && (
        <Button
          size="small"
          variation="primary"
          as={Link}
          to={`/checkin/${id}`}
        >
          办理入住
        </Button>
      )}
      {status === "checked-in" && <CheckoutButton bookingId={id} />}
    </StyledTodayItem>
  );
}

export default TodayItem;
