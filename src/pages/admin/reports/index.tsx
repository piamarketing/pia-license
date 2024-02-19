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
  FormControl,
  FormLabel,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import API, { ENDPOINTS } from "@/lib/API";
import { useState } from "react";
import { PermissionGuard } from "@/components/PermissionGuard";
import CustomCard from "@/lib/ui/horizon/components/card/Card";
import { SingleDatepicker } from "chakra-dayzed-datepicker";


import dynamic from "next/dynamic";
import "@inovua/reactdatagrid-enterprise/index.css";
const ReactDataGrid = dynamic(
  () => import("@inovua/reactdatagrid-enterprise"),
  {
    ssr: false,
  }
);


export default function Domains() {
  const router = useRouter();
  const toast = useToast();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { data, isLoading, refetch } = useQuery(["general_report", startDate, endDate], () =>
    API.get(ENDPOINTS.reports + "/general", {
      params: {
        startDate,
        endDate,
      },
    }).then((res) => res.data)
  );

  // Yesterday



  const gridStyle = { minHeight: 650 };
  const columns = [
    {
      name: "website",
      header: "Client",
      minWidth: 50,
      defaultFlex: 0.4,
      render: ({ value, data }: any) => {
        return <>{data?.website}</>;
      },
    },
    {
      name: "inovices.total",
      header: "Total Invoices",
      minWidth: 50,
      defaultFlex: 0.4,
      render: ({ value, data }: any) => {
        return <>{(data?.invoices?.total || 0).toLocaleString("en-US", {
          style: "currency",
          currency: "EUR",
        })}</>;
      },
    },
    {
      name: "domians.count",
      header: "Domains Count",
      minWidth: 50,
      defaultFlex: 0.4,
      render: ({ value, data }: any) => {
        return <>{data?.domains?.count}</>;
      },
    },
    {
      name: "domains.total",
      header: "Domains Total",
      minWidth: 50,
      defaultFlex: 0.4,
      render: ({ value, data }: any) => {
        return <>{(data?.domains?.total || 0).toLocaleString("en-US", {
          style: "currency",
          currency: "EUR",
        })}</>;
      },
    },
  ];


  return (
    <MainContainer requiredPermission="tibs.view" _for="admin">
      <CustomCard mb="20px">
        <Text fontSize="lg" mb="20px" fontWeight="700" lineHeight="100%">
          Reports
        </Text>
        <HStack spacing="20px" mb="20px" px="0px">
          <FormControl>
            <FormLabel>Start Date</FormLabel>
            <SingleDatepicker
              name="date-input"
              date={startDate}
              onDateChange={setStartDate}
            />
          </FormControl>
          <FormControl>
            <FormLabel>End Date</FormLabel>
            <SingleDatepicker
              name="date-input"
              date={endDate}
              onDateChange={setEndDate}
            />
          </FormControl>
        </HStack>
        <Button
          colorScheme="blue"
          mb="20px"
          px="25px"
          onClick={() => refetch()}
        >
          Generate
        </Button>
      </CustomCard>

      {data && (
        <>
          <HStack
            spacing="20px"
            mb="20px"
            px="0px"
            justify="space-between"
            w="100%"
          >
            <CustomCard>
              <Text fontSize="lg" mb="10px" fontWeight="700" align="left">
                Invoices
              </Text>
              <HStack spacing="20px" px="0px" justify="space-between" w="100%">
                <Text fontSize="md" fontWeight="400" align="left">
                  Total Invoice Count
                </Text>
                <Text fontSize="md" fontWeight="700" align="left">
                  {data?.data?.invoices?.count || 0}
                </Text>
              </HStack>
              <HStack spacing="20px" px="0px" justify="space-between" w="100%">
                <Text fontSize="md" fontWeight="400" align="left">
                  Total Paid Invoices
                </Text>
                <Text fontSize="md" fontWeight="700" align="left">
                  {(data?.data?.invoices?.paid || 0).toLocaleString("en-US", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </Text>
              </HStack>
            </CustomCard>

            <CustomCard>
              <Text fontSize="lg" mb="10px" fontWeight="700" align="left">
                Domain Orders
              </Text>
              <HStack spacing="20px" px="0px" justify="space-between" w="100%">
                <Text fontSize="md" fontWeight="400" align="left">
                  Total Domains Count
                </Text>
                <Text fontSize="md" fontWeight="700" align="left">
                  {data?.data?.domains?.count || 0}
                </Text>
              </HStack>
              <HStack spacing="20px" px="0px" justify="space-between" w="100%">
                <Text fontSize="md" fontWeight="400" align="left">
                  Total Paid Domains
                </Text>
                <Text fontSize="md" fontWeight="700" align="left">
                  {(data?.data?.domains?.total || 0).toLocaleString("en-US", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </Text>
              </HStack>
            </CustomCard>
          </HStack>


          <CustomCard>
              <Text fontSize="lg" mb="10px" fontWeight="700" align="left">
                Clients Overview
              </Text>
              <ReactDataGrid
                idProperty="id"
                columns={columns}
                dataSource={data?.data?.clients}
                style={gridStyle}
                pagination
              />
          </CustomCard>
        </>
      )}
    </MainContainer>
  );
}
