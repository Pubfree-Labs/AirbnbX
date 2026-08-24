import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";

function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "全部" },
          { value: "checked-out", label: "已退房" },
          { value: "checked-in", label: "已入住" },
          { value: "unconfirmed", label: "未确认" },
        ]}
      />

      <SortBy
        options={[
          { value: "startDate-desc", label: "按日期排序（最近优先）" },
          { value: "startDate-asc", label: "按日期排序（较早优先）" },
          {
            value: "totalPrice-desc",
            label: "按金额排序（从高到低）",
          },
          { value: "totalPrice-asc", label: "按金额排序（从低到高）" },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
