import CopyableId from "@/components/shared/CopyAndRoutebyId";
import { Badge } from "@/components/ui/badge";

export const createOrderColumns = () => [
  {
    key: "id",
    label: "Order ID",
    render: (row: any) => (
      <CopyableId
        id={row.id}
        href={`/orders/${row.id}`}
        className="font-mono text-sm font-semibold text-primary hover:text-accent transition-colors"
        showShort={row.id.slice(0, 10) ? "..." : row.id}
        key={row.id}
      />
    ),
  },
  {
    key: "customerId",
    label: "Customer ID",
    render: (row: any) => (
      <CopyableId
        id={row.customerId}
        href={`/profile/user/${row.customerId}`}
        className="font-mono text-xs text-muted-foreground"
        showShort={row.customerId.slice(0, 10) ? "..." : row.customerId}
        key={row.customerId}
      />
    ),
  },
  {
    key: "providerId",
    label: "Provider ID",
    render: (row: any) => (
      <CopyableId
        id={row.providerId}
        href={`/providers/${row.providerId}`}
        className="font-mono text-xs text-muted-foreground"
        showShort={row.providerId.slice(0, 10) ? "..." : row.providerId}
        key={row.providerId}
      />
    ),
  },
  {
    key: "phone",
    label: "Phone",
    render: (row: any) => (
      <span className="text-foreground text-sm font-medium">{row.phone}</span>
    ),
  },
  {
    key: "paymentStatus",
    label: "Payment Status",
    render: (row: any) => {
      const isPaid = row.paymentStatus === "PAID";
      return (
        <Badge
          variant={isPaid ? "secondary" : "destructive"}
          className={`min-w-[96px] justify-center px-3 py-1 rounded-lg text-xs font-semibold border-border bg-secondary text-secondary-foreground ${
            isPaid
              ? "bg-secondary text-secondary-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {isPaid ? "Paid" : "Unpaid"}
        </Badge>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (row: any) => (
      <Badge
        variant="outline"
        className="capitalize min-w-[85px] px-3 py-1 rounded-lg text-xs font-bold border border-border bg-muted text-muted-foreground tracking-wide"
      >
        {row.status}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (row: any) => {
      const date = new Date(row.createdAt);
      return (
        <span className="text-xs px-3 py-1 rounded bg-background text-muted-foreground border border-border font-medium">
          {isNaN(date.getTime())
            ? "-"
            : date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
        </span>
      );
    },
  },
  {
    key: "totalPrice",
    label: "Total Price",
    render: (row: any) => (
      <span className="font-semibold rounded bg-accent text-accent-foreground px-3 py-1 text-xs">
        ৳ {Number(row.totalPrice).toFixed(2)}
      </span>
    ),
  },
];