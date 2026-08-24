import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),

    onSuccess: (data) => {
      toast.success(`预订 #${data.id} 已成功办理退房`);
      queryClient.invalidateQueries({ active: true });
    },

    onError: () => toast.error("办理退房时发生错误"),
  });

  return { checkout, isCheckingOut };
}
