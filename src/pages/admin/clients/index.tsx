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
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Switch,
  Checkbox,
  Badge,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FiArrowRight,
  FiCheck,
  FiDelete,
  FiEdit,
  FiFile,
  FiFilePlus,
  FiFileText,
  FiPaperclip,
  FiPlus,
  FiRefreshCw,
  FiTrash,
  FiX,
} from "react-icons/fi";
import { useQuery } from "react-query";
import API, { ENDPOINTS } from "@/lib/API";
import { useState } from "react";
import moment from "moment";
import ClientDetails from "@/components/ClientDetails";

import dynamic from "next/dynamic";
import { render } from "react-dom";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import CustomCard from "@/lib/ui/horizon/components/card/Card";

import "@inovua/reactdatagrid-enterprise/index.css";
const ReactDataGrid = dynamic(
  () => import("@inovua/reactdatagrid-enterprise"),
  {
    ssr: false,
  }
);

export default function ClientsComponent() {
  const router = useRouter();
  const toast = useToast();

  const { data, isLoading, refetch } = useQuery(
    "clients",
    () => API.get(ENDPOINTS.clients),
    {
      refetchOnWindowFocus: false,
    }
  );

  const filterValue = [
    { name: 'website', operator: 'contains', type: 'string', value: '' },
  ];

  const { data: productsData } = useQuery("products", () =>
    API.get(ENDPOINTS.products).then((res) => res.data.data)
  );

  const {
    isOpen: isClientDetailsOpen,
    onOpen: onClientDetailsOpen,
    onClose: onClientDetailsClose,
  } = useDisclosure();

  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const gridStyle = { minHeight: 650 };
  const columns = [
    
    {
      name: "website",
      header: "Website",
      minWidth: 120,
      defaultFlex: 1,
      render: ({ value, data }: any) => {
        let anyError = [];
        const planName = (data.planType?.name || '').toLowerCase();
        const isYearly = planName.includes('year');
        const isMonthly = planName.includes('month');

        if (new Date(data.license.validUntil) < new Date()) {
          anyError.push('License expired');
        }
        if (data.billingItems.length === 0) {
          anyError.push('No billing items');
        }
        if (data.domains.length === 0) {
          anyError.push('No domains');
        }

        return (
          <>
            <HStack>
              {isYearly && (
                <Tooltip label="Yearly plan">
                  <Badge size="xs" fontSize="xs" colorScheme="green">Y</Badge>
                </Tooltip>
              )}
              {isMonthly && (
                <Tooltip label="Monthly plan">
                  <Badge size="xs" fontSize="xs" colorScheme="purple">M</Badge>
                </Tooltip>
              )}
              {data.isActive && anyError.length > 0 && (
                <Tooltip label={anyError.join(', ')}>
                  <WarningIcon color="red.500" />
                </Tooltip>
              )}
              <Text>{value}</Text>
            </HStack>
          </>
        );
      },
    },
    {
      name: "license.validUntil",
      header: "Valid Until",
      minWidth: 50,
      defaultFlex: 0.4,
      render: ({ value, data }: any) => {
        return <>{moment().to(data.license.validUntil)}</>;
      },
    },
    {
      name: "isActive",
      header: "Active",
      minWidth: 100,
      defaultFlex: 0.01,
      render: ({ value, data }: any) => {
        return (
          <Switch 
            defaultChecked={value}
            onChange={(e) => handleToggleActive(data._id, e.target.checked)}
          />
        );
      },
    },
    {
      name: "_id",
      header: "Actions",
      minWidth: 50,
      defaultFlex: 0.5,
      defaultLocked: "end",
      render: ({ value, data: row }: any) => {
        return (
          <HStack>
            <Tooltip label="Create extra invoice">
              <IconButton
                aria-label="Edit"
                icon={<FiFilePlus />}
                size="xs"
                colorScheme="purple"
                onClick={() => {
                  onOpen();
                  setActiveId(row._id);
                }}
              />
            </Tooltip>
            <Tooltip label="Download certificate">
              <IconButton
                aria-label="Edit"
                icon={<FiFileText />}
                size="xs"
                colorScheme="blue"
                onClick={() => window.open(`/api/pdf/${row._id}`, "_blank")}
              />
            </Tooltip>
            <Tooltip label="Act as client">
              <IconButton
                aria-label="Edit"
                icon={<FiArrowRight />}
                size="xs"
                colorScheme="orange"
                onClick={() => handleActAsAffiliate(row._id)}
              />
            </Tooltip>
            <IconButton
              aria-label="Edit"
              icon={<FiEdit />}
              size="xs"
              colorScheme="blue"
              onClick={() => {
                setActiveId(row._id);
                onClientDetailsOpen();
              }}
            />
            <Popover>
              <PopoverTrigger>
                <IconButton
                  aria-label="Edit"
                  icon={<FiTrash />}
                  size="xs"
                  colorScheme="red"
                  isDisabled={row.isActive}
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <Text py="4">
                    Are you sure you want to delete this client?
                  </Text>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDelete(row._id)}
                    size="sm"
                  >
                    Delete
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </HStack>
        );
      },
    },
  ];

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`${ENDPOINTS.clients}/${id}`);
      toast({
        title: "Client deleted",
        description: "Client has been deleted",
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

  const handleToggleActive = async (id: number, active: boolean) => {
    try {
      await API.put(`${ENDPOINTS.clients}/${id}`, {
        isActive: active,
      });
      toast({
        title: "Success",
        description: "Client updated",
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

  const handleToggleProvider = async (id: number, isProvider: boolean) => {
    try {
      await API.put(`${ENDPOINTS.clients}/${id}`, {
        isProvider: isProvider,
      });
      toast({
        title: "Success",
        description: "Client updated",
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

  const handleActAsAffiliate = async (id: number) => {
    try {
      await API.post(`${ENDPOINTS.users}/toggle-acting`, {
        id: id,
      });
      toast({
        title: "Success",
        description: "Acting as affiliate",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // change location
      window.location.href = "/admin";
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCreateExtraInvoice = async () => {
    try {
      await API.post(`${ENDPOINTS.clients}/create-extra-invoice`, {
        id: activeId,
        productId: activeProductId,
      });
      toast({
        title: "Success",
        description: "Invoice created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <MainContainer requiredPermission="clients.view" _for="admin">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay w="175vw" h="175vh" />
        <ModalContent>
          <ModalHeader>Create extra invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Choose product</Text>
            <Select
              placeholder="Select product"
              onChange={(e) => setActiveProductId(e.target.value)}
            >
              {productsData?.map((product: any) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={
                activeProductId
                  ? () => handleCreateExtraInvoice()
                  : () =>
                      toast({
                        title: "Error",
                        description: "Please select product",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                      })
              }
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isClientDetailsOpen} onClose={onClientDetailsClose}>
        <ModalOverlay w="175vw" h="175vh" />
        <ModalContent maxW="90%">
          <ClientDetails id={activeId} />
        </ModalContent>
      </Modal>

      {!isLoading && (
          <>
            <Heading fontSize="3xl" mb="7">Clients</Heading>
            <ReactDataGrid
              idProperty="id"
              columns={columns}
              defaultFilterValue={filterValue}
              dataSource={data?.data?.data}
              style={gridStyle}
              rowIndexColumn={{
                header: "#",
                renderIndex: (index) => <b>{index + 1}</b>,
              }}
            />
          </>
      )}
    </MainContainer>
  );
}

