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
  Heading,
  Divider,
  Box,
  FormControl,
  Input,
  FormLabel,
  Select,
  Textarea,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import API, { ENDPOINTS } from "@/lib/API";
import { useEffect, useRef, useState } from "react";
import CustomCard from "@/lib/ui/horizon/components/card/Card";
import { FiCheck, FiEye, FiRefreshCcw, FiSave, FiX } from "react-icons/fi";
import countriesData from "@/assets/countries.json";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import moment from "moment";
import { Widget } from "@uploadcare/react-widget";
import { FaEye } from "react-icons/fa";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { MultiSelect } from "chakra-multiselect";

export default function ClientDetails({ id }: any) {
  const [clientId, setClientId] = useState<string>(id);
  const [isApproving, setIsApproving] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const [dataset, setDataset] = useState<any>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [multiaccessClients, setMultiaccessClients] = useState<any>([]);
  const [newDomainCount, setNewDomainCount] = useState<number>(1);
  const [syncConfig, setSyncConfig] = useState<any>({
    license: false,
    company: false,
    domains: false,
    isProvider: false,
    createNew: false,
    status: false,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: clientsData, isLoading: clientsLoading } = useQuery(
    "clients",
    () => API.get(ENDPOINTS.clients),
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );

  console.log(clientsData?.data?.data.map((client: any) => client.website));

  const { data, isLoading, refetch } = useQuery(
    ["client", clientId],
    () => API.get(`${ENDPOINTS.clients}/${clientId}`),
    {
      enabled: !!clientId,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnMount: false,
    }
  );
  // Get user by client id
  const { data: userData, isLoading: userDataLoading } = useQuery(
    ["user", clientId],
    () => API.get(`${ENDPOINTS.users}/by-client/${clientId}`),
    {
      enabled: !!clientId,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnMount: false,
    }
  );

  const { data: companies } = useQuery(
    "companies",
    () => API.get(ENDPOINTS.companies),
    {
      enabled: !!clientId,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );

  const { data: plans } = useQuery("plans", () => API.get(ENDPOINTS.plans), {
    enabled: !!clientId,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnMount: false,
  });

  const { data: productsData } = useQuery(
    "products",
    () => API.get(ENDPOINTS.products).then((res) => res.data.data),
    {
      enabled: !!clientId,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnMount: false,
    }
  );

  useEffect(() => {
    if (data?.data?.data) {
      setDataset(data?.data?.data[0]);
      setEmail(userData?.data?.data?.email);
      setMultiaccessClients(userData?.data?.data?.multiaccessClients);
    }
  }, [data]);

  const handleUpdate = async () => {
    try {
      await API.put(`${ENDPOINTS.clients}/${clientId}`, dataset);
      toast({
        title: "Client updated",
        description: "Client has been updated",
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
      refetch();
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await API.put(`${ENDPOINTS.clients}/approve/${clientId}`);
      toast({
        title: "Client approved",
        description: "Client has been approved",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      refetch();
      setIsApproving(false);
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

  const handleSync = async () => {
    //onClose();
    try {
      await API.post(`${ENDPOINTS.clients_sync}/${clientId}`, {
        config: syncConfig,
        dataset: dataset,
      });
      toast({
        title: "Client syncronized",
        description: "Client has been syncronized",
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

  const handleCreateUpdateUser = async () => {
    try {
      await API.post(`${ENDPOINTS.users}/for-client/${clientId}`, {
        email,
        password,
        multiaccessClients,
      });
      toast({
        title: "User created",
        description: "User has been created",
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

  const calculateNextDomain = (lastDomain: any) => {
    // Example last domain: is {main: "example1.com", mobile: "m.example1.com"} we will return { main: "example2.com", mobile: "m.example2.com" }
    console.log(lastDomain);
    const regex = /(\d+)(?!.*\d)/g;

    const main = lastDomain?.main?.replace(regex, (match) => {
      return parseInt(match) + 1;
    });
    const mobile = lastDomain?.mobile?.replace(regex, (match) => {
      return parseInt(match) + 1;
    });

    return { main, mobile };
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay h="175vh" w="175vw" />
        <ModalContent>
          <ModalHeader>Syncronize Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack w="100%" align="flex-start">
              <Heading as="h3" size="sm" textAlign="left">
                Select what to syncronize
              </Heading>
              <Divider my={2} />
              <HStack w="100%" justify="space-between">
                <Text fontSize="md" fontWeight="bold">
                  License
                </Text>
                <Switch
                  isChecked={syncConfig.license}
                  onChange={(e) =>
                    setSyncConfig({
                      ...syncConfig,
                      license: e.target.checked,
                    })
                  }
                />
              </HStack>
              <HStack w="100%" justify="space-between">
                <Text fontSize="md" fontWeight="bold">
                  Company
                </Text>
                <Switch
                  isChecked={syncConfig.company}
                  onChange={(e) =>
                    setSyncConfig({
                      ...syncConfig,
                      company: e.target.checked,
                    })
                  }
                />
              </HStack>
              <HStack w="100%" justify="space-between">
                <Text fontSize="md" fontWeight="bold">
                  Domains
                </Text>
                <Switch
                  isChecked={syncConfig.domains}
                  onChange={(e) =>
                    setSyncConfig({
                      ...syncConfig,
                      domains: e.target.checked,
                    })
                  }
                />
              </HStack>
              <HStack w="100%" justify="space-between">
                <Text fontSize="md" fontWeight="bold">
                  Is Provider
                </Text>
                <Switch
                  isChecked={syncConfig.isProvider}
                  onChange={(e) =>
                    setSyncConfig({
                      ...syncConfig,
                      isProvider: e.target.checked,
                    })
                  }
                />
              </HStack>
              <HStack w="100%" justify="space-between">
                <Text fontSize="md" fontWeight="bold">
                  Status
                </Text>
                <Switch
                  isChecked={syncConfig.status}
                  onChange={(e) =>
                    setSyncConfig({
                      ...syncConfig,
                      status: e.target.checked,
                    })
                  }
                />
              </HStack>
              <HStack w="100%" justify="space-between">
                <Text fontSize="md" fontWeight="bold">
                  Create New If Not Found
                </Text>
                <Switch
                  isChecked={syncConfig.createNew}
                  onChange={(e) =>
                    setSyncConfig({
                      ...syncConfig,
                      createNew: e.target.checked,
                    })
                  }
                />
              </HStack>
              <Divider my={2} />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              leftIcon={<FiRefreshCcw />}
              isLoading={isLoading}
              onClick={() => handleSync()}
            >
              Start Sync
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {!isLoading && plans && companies && (
        <CustomCard title="Client Details">
          <HStack spacing={4} justify="space-between">
            {" "}
            <VStack align="flex-start">
              <Heading as="h3" size="md">
                {!clientsLoading && (
                  <Select
                    value={clientId}
                    onChange={(e) => {
                      setClientId(e.target.value)
                      // reset everything
                      setEmail("");
                      setPassword("");
                      setMultiaccessClients([]);
                    }}
                  >
                    {clientsData?.data?.data.map((client: any) => (
                      <option key={client._id} value={client._id}>
                        {client.website}
                      </option>
                    ))}
                  </Select>
                )}
              </Heading>
              <Text fontSize="sm">
                Last synced:{" "}
                {moment(dataset?.lastSynced).format("DD/MM/YYYY HH:mm:ss")}
              </Text>
            </VStack>
            <HStack spacing={4}>
              <Button
                colorScheme="orange"
                onClick={() => {
                  handleUpdate();
                }}
                leftIcon={<FiSave />}
              >
                Save
              </Button>
              <Button
                colorScheme="blue"
                leftIcon={<FiRefreshCcw />}
                isLoading={isLoading}
                onClick={() => onOpen()}
              >
                Syncronize
              </Button>
              <Button
                colorScheme="green"
                leftIcon={<FiCheck />}
                isDisabled={dataset?.isActive}
                isLoading={isApproving}
                onClick={handleApprove}
              >
                {dataset?.isActive ? "Client Approved" : "Approve Client"}
              </Button>
            </HStack>
          </HStack>
          <Divider my={4} />

          <Tabs maxW="100%">
            <TabList>
              <Tab>Plan& License</Tab>
              <Tab>Client</Tab>
              <Tab>Telegram Notification</Tab>
              <Tab>Documents</Tab>
              <Tab>Pricing</Tab>
              <Tab>Billing</Tab>
              <Tab>Domains</Tab>
              <Tab>User</Tab>
            </TabList>

            <TabPanels>
              <TabPanel aria-label="Plan& License">
                <Heading as="h4" size="md" mb="5">
                  Selected Plan
                </Heading>
                <Select
                  placeholder="Select plan"
                  value={dataset?.planType?._id}
                  onChange={(e) => {
                    setDataset({
                      ...dataset,
                      planType: e.target.value,
                    });
                  }}
                >
                  {plans?.data?.data?.map((plan: any) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name}
                    </option>
                  ))}
                </Select>

                <Divider my={4} />
                <Heading as="h4" size="md" mb="5" mt="5">
                  Licence Details
                </Heading>
                <HStack w="100%" spacing={4} justify="space-between" mb="6">
                  <FormControl id="licenseStartedAt">
                    <FormLabel>License Started At</FormLabel>
                    <SingleDatepicker
                      name="date-input"
                      date={new Date(dataset?.license.startedAt || Date.now())}
                      onDateChange={(date) => {
                        setDataset({
                          ...dataset,
                          license: {
                            ...dataset?.license,
                            startedAt: date,
                          },
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl id="licenseValidUntil">
                    <FormLabel>License Valid Until</FormLabel>

                    <SingleDatepicker
                      name="date-input"
                      date={new Date(dataset?.license.validUntil || Date.now())}
                      onDateChange={(date) => {
                        setDataset({
                          ...dataset,
                          license: {
                            ...dataset?.license,
                            validUntil: date,
                          },
                        });
                      }}
                    />
                  </FormControl>
                </HStack>
                <HStack w="100%" spacing={4} justify="space-between" mb="6">
                  <FormControl id="masterCompany">
                    <FormLabel>Master Company</FormLabel>
                    <Select
                      placeholder="Select master company"
                      value={dataset?.masterCompany}
                      onChange={(e) => {
                        setDataset({
                          ...dataset,
                          masterCompany: e.target.value,
                        });
                      }}
                    >
                      {companies?.data?.data?.map((company: any) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl id="subCompany">
                    <FormLabel>Sub Company</FormLabel>
                    <Select
                      placeholder="Select sub company"
                      value={dataset?.subCompany}
                      onChange={(e) => {
                        setDataset({
                          ...dataset,
                          subCompany: e.target.value,
                        });
                      }}
                    >
                      {companies?.data?.data?.map((company: any) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>
              </TabPanel>
              <TabPanel aria-label="Client">
                <Heading as="h4" size="md" mb="5">
                  Client Details
                </Heading>
                <HStack w="100%" spacing={4} justify="space-between">
                  <FormControl id="firstName">
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      value={dataset?.firstName}
                      onChange={(e) => {
                        setDataset({
                          ...dataset,
                          firstName: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      value={dataset?.lastName}
                      onChange={(e) => {
                        setDataset({
                          ...dataset,
                          lastName: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </HStack>
                <HStack w="100%" spacing={4} justify="space-between">
                  <FormControl id="contactEmail">
                    <FormLabel>Contact Email</FormLabel>
                    <Input
                      type="text"
                      value={dataset?.contactEmail}
                      onChange={(e) => {
                        setDataset({
                          ...dataset,
                          contactEmail: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl id="phone">
                    <FormLabel>Phone</FormLabel>
                    <Input
                      type="text"
                      value={dataset?.phone}
                      onChange={(e) => {
                        setDataset({
                          ...dataset,
                          phone: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </HStack>
                <HStack w="100%" spacing={4} justify="space-between">
                  <FormControl id="skype">
                    <FormLabel>Skype</FormLabel>
                    <Input
                      type="text"
                      value={dataset?.skype}
                      onChange={(e) => {
                        setDataset({
                          ...dataset,
                          skype: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl id="telegram">
                    <FormLabel>Telegram</FormLabel>
                    <Input
                      type="text"
                      value={dataset?.telegram}
                      onChange={(e) => {
                        setDataset({
                          ...dataset,
                          telegram: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </HStack>
                <FormControl id="website">
                  <FormLabel>Website</FormLabel>
                  <Input
                    type="text"
                    value={dataset?.website}
                    onChange={(e) => {
                      setDataset({
                        ...dataset,
                        website: e.target.value,
                      });
                    }}
                  />
                </FormControl>
                <Divider my={4} />
                <Heading as="h4" size="md" mt="5" mb="5">
                  Client Address
                </Heading>
                <FormControl id="acountry">
                  <FormLabel>Country</FormLabel>
                  <Select
                    value={dataset?.country}
                    onChange={(e) => {
                      setDataset({
                        ...dataset,
                        country: e.target.value,
                      });
                    }}
                  >
                    {countriesData?.map((country) => (
                      <option key={country.country} value={country.country}>
                        {country.country}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="address">
                  <FormLabel>Address</FormLabel>
                  <Textarea
                    value={dataset?.address}
                    onChange={(e) => {
                      setDataset({
                        ...dataset,
                        address: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </TabPanel>
              <TabPanel aria-label="Telegram Notification">
                <Heading as="h4" size="md" mb="5">
                  Telegram Notification
                </Heading>
                <FormControl id="telegram">
                  <FormLabel>Telegram Bot Key</FormLabel>
                  <Input
                    type="text"
                    value={dataset?.telegramBotToken}
                    onChange={(e) => {
                      setDataset({
                        ...dataset,
                        telegramBotToken: e.target.value,
                      });
                    }}
                  />
                </FormControl>
                <FormControl id="telegram">
                  <FormLabel>Telegram Chat ID</FormLabel>
                  <Input
                    type="text"
                    value={dataset?.telegramChatId}
                    onChange={(e) => {
                      setDataset({
                        ...dataset,
                        telegramChatId: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </TabPanel>
              <TabPanel aria-label="Documents">
                <Heading as="h4" size="md" mt="5" mb="5">
                  Client Documents
                </Heading>
                <Box
                  w="80%"
                  border="1px solid #e2e8f0"
                  borderRadius="lg"
                  p={10}
                >
                  <VStack w="100%">
                    {dataset?.docs?.map((doc) => (
                      <HStack
                        key={doc._id}
                        w="100%"
                        justify="space-between"
                        my="3"
                      >
                        <Text fontWeight="bold">
                          {doc.docName === "passport" ? "Passport" : "Document"}
                        </Text>
                        <Box>
                          <Widget
                            publicKey="558b23ad07bf127bae7f"
                            onChange={(info) => {
                              const updatedDoc = {
                                ...doc,
                                docUrl: info?.originalUrl,
                              };
                              const updatedDocs = dataset?.docs?.map((d) => {
                                if (d.docName === doc.docName) {
                                  return updatedDoc;
                                }
                                return d;
                              });
                              setDataset({
                                ...dataset,
                                docs: updatedDocs,
                              });
                            }}
                          />

                          <IconButton
                            icon={<FaEye />}
                            colorScheme="blue"
                            onClick={() => {
                              window.open(doc.docUrl, "_blank");
                            }}
                            ml="3"
                          />

                          <Button
                            ml="4"
                            colorScheme={
                              doc.status === "approved" ? "red" : "green"
                            }
                            leftIcon={
                              doc.status === "approved" ? <FiX /> : <FiCheck />
                            }
                            onClick={() => {
                              const updatedDoc = {
                                ...doc,
                                status:
                                  doc.status === "approved"
                                    ? "pending"
                                    : "approved",
                              };
                              const updatedDocs = dataset?.docs?.map((d) => {
                                if (d.docName === doc.docName) {
                                  return updatedDoc;
                                }
                                return d;
                              });
                              setDataset({
                                ...dataset,
                                docs: updatedDocs,
                              });
                            }}
                          >
                            {doc.status === "approved"
                              ? "Disapprove"
                              : "Approve"}
                          </Button>
                        </Box>
                      </HStack>
                    ))}
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        const randId = Math.random().toString(36).substring(7);
                        setDataset({
                          ...dataset,
                          docs: [
                            ...dataset?.docs,
                            {
                              docName: randId,
                              status: "pending",
                            },
                          ],
                        });
                      }}
                    >
                      Add New Document
                    </Button>
                  </VStack>
                </Box>
                <Divider my={4} />
              </TabPanel>
              <TabPanel aria-label="Pricing">
                <Heading as="h4" size="md" mt="5" mb="5">
                  Pricing Revision
                </Heading>

                <FormControl id="domainPrice">
                  <FormLabel>Domain Price</FormLabel>
                  <NumberInput
                    value={dataset?.revisedDomainPrice || dataset?.domainPrice}
                    onChange={(e) => {
                      setDataset({
                        ...dataset,
                        revisedDomainPrice: e,
                      });
                    }}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </TabPanel>
              <TabPanel aria-label="Billing">
                <HStack justify="space-between">
                  <Heading as="h4" size="md" mt="5" mb="5">
                    Billing
                  </Heading>
                </HStack>
                {(dataset?.billingItems || []).map((itm: any, index: any) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <FormControl mr="20px">
                      <FormLabel>Product</FormLabel>
                      <Select
                        placeholder="Procut"
                        value={itm.product}
                        onChange={(e) => {
                          // Domain object is like { main: 'example.com', mobile: 'subdomain.example.com' }
                          const newBillingItems = dataset?.billingItems
                            ? [...dataset?.billingItems]
                            : [];

                          newBillingItems[index] = {
                            ...newBillingItems[index],
                            name: productsData?.find(
                              (product: any) => product._id === e.target.value
                            )?.name,
                            product: e.target.value,
                            stripeProductId: productsData?.find(
                              (product: any) => product._id === e.target.value
                            )?.stripeData?.product?.id,
                            price: productsData?.find(
                              (product: any) => product._id === e.target.value
                            )?.price,
                            basePrice: productsData?.find(
                              (product: any) => product._id === e.target.value
                            )?.price,
                          };
                          setDataset({
                            ...dataset,
                            billingItems: newBillingItems,
                          });

                          console.log("dataset", dataset);
                        }}
                      >
                        {productsData?.map((product: any) => (
                          <option key={product._id} value={product._id}>
                            {product.name} |{" "}
                            {product.price.toLocaleString("en-UK", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl mr="20px">
                      <FormLabel>Price</FormLabel>
                      <Input
                        placeholder="Price"
                        value={itm.price}
                        onChange={(e) => {
                          const newBillingItems = dataset?.billingItems
                            ? [...dataset?.billingItems]
                            : [];

                          newBillingItems[index] = {
                            ...newBillingItems[index],
                            price: e.target.value,
                          };
                          setDataset({
                            ...dataset,
                            billingItems: newBillingItems,
                          });
                        }}
                      />
                    </FormControl>
                    <FormControl mr="20px">
                      <FormLabel>Payment Day</FormLabel>
                      <Input
                        placeholder="Payment Day"
                        value={itm.period}
                        onChange={(e) => {
                          const newBillingItems = dataset?.billingItems
                            ? [...dataset?.billingItems]
                            : [];

                          newBillingItems[index] = {
                            ...newBillingItems[index],
                            period: e.target.value,
                          };
                          setDataset({
                            ...dataset,
                            billingItems: newBillingItems,
                          });
                        }}
                      />
                    </FormControl>

                    <Button
                      colorScheme="red"
                      pl="15px"
                      onClick={() => {
                        const newBillingItems = dataset?.billingItems
                          ? [...dataset?.billingItems]
                          : [];

                        newBillingItems.splice(index, 1);
                        setDataset({
                          ...dataset,
                          billingItems: newBillingItems,
                        });
                      }}
                    >
                      -
                    </Button>
                  </Box>
                ))}
                <HStack w="100%" justify="flex-end" my="3" mt="20">
                  <Button
                    colorScheme="green"
                    onClick={async () => {
                      console.log(dataset?.billingItems);
                      const newBillingItems = dataset?.billingItems
                        ? [...dataset?.billingItems]
                        : [{}];

                      newBillingItems.push({});

                      setDataset({
                        ...dataset,
                        billingItems: newBillingItems,
                      });
                    }}
                  >
                    New Billing
                  </Button>
                </HStack>
              </TabPanel>
              <TabPanel aria-label="Domains">
                <Heading as="h4" size="md" mt="5" mb="5">
                  Domains
                </Heading>
                {(dataset?.domains || []).map((domain: any, index: any) => (
                  <Box key={index} display="flex" alignItems="center" mb={2}>
                    <Input
                      placeholder="Main domain"
                      value={domain.main}
                      onChange={(e) => {
                        // Domain object is like { main: 'example.com', mobile: 'subdomain.example.com' }
                        const newDomains = dataset?.domains
                          ? [...dataset?.domains]
                          : [];
                        newDomains[index] = {
                          ...newDomains[index],
                          main: e.target.value,
                        };
                        setDataset({
                          ...dataset,
                          domains: newDomains,
                        });
                      }}
                      mr="20px"
                    />
                    <Input
                      placeholder="Mobile domain"
                      value={domain.mobile}
                      onChange={(e) => {
                        const newDomains = dataset?.domains
                          ? [...dataset?.domains]
                          : [];
                        newDomains[index] = {
                          ...newDomains[index],
                          mobile: e.target.value,
                        };
                        setDataset({
                          ...dataset,
                          domains: newDomains,
                        });
                      }}
                      mr="20px"
                    />
                    <Button
                      colorScheme="red"
                      pl="15px"
                      onClick={() => {
                        const newDomains = dataset?.domains
                          ? [...dataset?.domains]
                          : [];
                        newDomains.splice(index, 1);
                        setDataset({
                          ...dataset,
                          domains: newDomains,
                        });
                      }}
                    >
                      -
                    </Button>
                  </Box>
                ))}
                <HStack w="100%" justify="flex-end" my="3" mt="20">
                  <HStack>
                    <Text fontWeight="bold">New Domain Count</Text>
                    <NumberInput
                      value={newDomainCount}
                      onChange={(e) => {
                        setNewDomainCount(e);
                      }}
                      min={1}
                      max={100}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>

                  <Button
                    colorScheme="green"
                    onClick={async () => {
                      const newDomains = dataset?.domains
                        ? [...dataset?.domains]
                        : [];
                      let lastDomain = newDomains[newDomains.length - 1];

                      Array.from({ length: newDomainCount }, (_, i) => i).map(
                        async (i) => {
                          console.log(lastDomain);
                          const f = calculateNextDomain(lastDomain);
                          if (f.main !== "" && f.mobile !== "") {
                            newDomains.push(f);
                            lastDomain = f;
                          } else {
                            newDomains.push({
                              main: "",
                              mobile: "",
                            });
                            lastDomain = {
                              main: "",
                              mobile: "",
                            };
                          }
                        }
                      );
                      setDataset({
                        ...dataset,
                        domains: newDomains,
                      });
                    }}
                  >
                    Add Domain
                  </Button>
                </HStack>
              </TabPanel>
              <TabPanel aria-label="User">
                <Heading as="h4" size="md" mt="5" mb="5">
                  User Details
                </Heading>
                <FormControl id="userEmail">
                  <FormLabel>User Email</FormLabel>
                  <Input
                    placeholder="User Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl id="userPassword">
                  <FormLabel>User Password</FormLabel>
                  <Input
                    placeholder="User Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </FormControl>
                {clientsData?.data?.data?.length > 0 && (
                  <FormControl id="multiaccess">
                    <FormLabel>Multi Access</FormLabel>
                    <MultiSelect
                      options={clientsData?.data?.data?.map((client: any) => ({
                        label: client.website,
                        value: client.website,
                      }))}
                      value={multiaccessClients}
                      onChange={(val) => {
                        setMultiaccessClients(val);
                      }}
                    />
                  </FormControl>
                )}
                <Button
                  colorScheme="green"
                  mt="5"
                  onClick={() => handleCreateUpdateUser()}
                  minW="100%"
                >
                  Save User
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CustomCard>
      )}
    </>
  );
}
