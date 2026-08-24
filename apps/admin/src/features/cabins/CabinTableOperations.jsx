import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "全部" },
          { value: "no-discount", label: "无优惠" },
          { value: "with-discount", label: "有优惠" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "按名称排序（A-Z）" },
          { value: "name-desc", label: "按名称排序（Z-A）" },
          { value: "regularPrice-asc", label: "按价格排序（从低到高）" },
          { value: "regularPrice-desc", label: "按价格排序（从高到低）" },
          { value: "maxCapacity-asc", label: "按容量排序（从低到高）" },
          { value: "maxCapacity-desc", label: "按容量排序（从高到低）" },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
