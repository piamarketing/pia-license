import List from "@/components/List";
import MainContainer from "@/components/MainContainer";
import {
  Button,
  HStack,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  PopoverBody,
  useToast,
  PopoverCloseButton,
  PopoverArrow,
  Badge,
  Tooltip,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FiArrowRight,
  FiCreditCard,
  FiDelete,
  FiEdit,
  FiPlus,
  FiTrash,
} from "react-icons/fi";
import { useQuery } from "react-query";
import API, { ENDPOINTS } from "@/lib/API";
import { useState } from "react";
import moment from "moment";
import { BitcoinLogo } from "@/lib/ui/horizon/components/icons/Icons";
import { FaBitcoin } from "react-icons/fa";

import { PermissionGuard } from "@/components/PermissionGuard";

import dynamic from "next/dynamic";
import "@inovua/reactdatagrid-enterprise/index.css";
const ReactDataGrid = dynamic(
  () => import("@inovua/reactdatagrid-enterprise"),
  {
    ssr: false,
  }
);

export type InvoiceStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "canceled"
  | "rejected"
  | "waiting";
export interface InvoiceStatusProps {
  status: InvoiceStatus;
}

export const InvoiceStatus = ({ status }: InvoiceStatusProps) => {
  switch (status) {
    case "pending":
      return (
        <Badge colorScheme="yellow" variant="solid">
          Pending
        </Badge>
      );
    case "paid":
      return (
        <Badge colorScheme="green" variant="solid">
          Paid
        </Badge>
      );
    case "failed":
      return (
        <Badge colorScheme="red" variant="solid">
          Failed
        </Badge>
      );
    case "refunded":
      return (
        <Badge colorScheme="red" variant="solid">
          Refunded
        </Badge>
      );
    case "canceled":
      return (
        <Badge colorScheme="red" variant="solid">
          Canceled
        </Badge>
      );
    case "rejected":
      return (
        <Badge colorScheme="red" variant="solid">
          Rejected
        </Badge>
      );
    case "waiting":
      return (
        <Badge colorScheme="blue" variant="solid">
          Waiting
        </Badge>
      );
    default:
      return (
        <Badge colorScheme="yellow" variant="solid">
          Pending
        </Badge>
      );
  }
};

export default function Invoices() {
  const router = useRouter();
  const toast = useToast();
  const { data, isLoading, refetch } = useQuery("invoices", () =>
    API.get(ENDPOINTS.invoices)
  );

  const filterValue = [
    { name: "client.website", operator: "contains", type: "string", value: "" },
  ];

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`${ENDPOINTS.invoices}/${id}`);
      toast({
        title: "Invoice deleted",
        description: "Invoice has been deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const gridStyle = { minHeight: 650 };
  const columns = [
    {
      name: "client.website",
      header: "Client",
      minWidth: 50,
      defaultFlex: 0.4,
      render: ({ value, data }: any) => {
        return <>{data?.client?.website}</>;
      },
    },
    {
      name: "status",
      header: "Status",
      minWidth: 50,
      defaultFlex: 0.2,
      render: ({ value, data }: any) => {
        return <InvoiceStatus status={value} />;
      },
    },
    {
      name: "totalAmount",
      header: "Price",
      minWidth: 50,
      defaultFlex: 0.2,
      render: ({ value, data }: any) => {
        return (
          <>
            {(data.totalAmount || 0).toLocaleString("en-US", {
              style: "currency",
              currency: "EUR",
            })}
          </>
        );
      },
    },
		{
			name: "dueDate",
			header: "Due Date",
			minWidth: 50,
			defaultFlex: 0.2,
			render: ({ value, data }: any) => {
				return <>{moment(data.dueDate || data.createdAt).format("DD/MM/YYYY")}</>;
			},
		},
		{
			name: "_id",
			header: "Actions",
			minWidth: 50,
			defaultFlex: 0.2,
			render: ({ value, data }: any) => {
				return (
					<HStack>
                <PermissionGuard
                  _for="admin"
                  requiredPermission="invoices.edit"
                >
                  <Tooltip label="Delete invoice">
                    <IconButton
                      aria-label="Delete"
                      icon={<FiTrash />}
                      size="xs"
                      colorScheme="red"
                      onClick={() => handleDelete(data._id)}
                    />
                  </Tooltip>
                </PermissionGuard>
                <Tooltip label="Go to invoice">
                  <IconButton
                    aria-label="GO"
                    icon={<FiArrowRight />}
                    size="xs"
                    colorScheme="blue"
                    onClick={() => router.push(`/admin/invoices/${data._id}`)}
                  />
                </Tooltip>
              </HStack>
				);
			},
		},
  ];

  return (
    <MainContainer requiredPermission="invoices.view" _for="all">
      {!isLoading && (
        <>
          <Heading fontSize="3xl" mb="7">
            Invoices
          </Heading>
          <ReactDataGrid
            idProperty="id"
            columns={columns}
            dataSource={data?.data?.data}
            style={gridStyle}
            pagination
          />
        </>
      )}
    </MainContainer>
  );
}
