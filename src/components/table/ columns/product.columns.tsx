"use client";

import { TResponseProduct } from "@/types/product.type";
import { ColumnDef } from "@tanstack/react-table";


export const productColumns:
  ColumnDef<TResponseProduct>[] = [
  {
    accessorKey: "title",

    header: "Title",
  },

  {
    accessorKey: "price",

    header: "Price",

    cell: ({ row }) => {
      return (
        <div>
          ৳ {row.original.price}
        </div>
      );
    },
  },

  {
    accessorKey: "category_name",

    header: "Category",
  },

  {
    accessorKey: "location",

    header: "Location",
  },

  {
    accessorKey: "brand",

    header: "Brand",
  },

  {
    accessorKey: "createdAt",

    header: "Created At",

    cell: ({ row }) => {
      return new Date(
        row.original.createdAt
      ).toLocaleDateString();
    },
  },
];