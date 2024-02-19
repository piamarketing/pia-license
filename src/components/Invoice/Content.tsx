// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Popover,
  Text,
  useColorModeValue,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
	VStack,
	HStack,
} from "@chakra-ui/react";

// Custom components
import Card from "@/lib/ui/horizon/components/card/Card";
import InvoiceTable from "./InvoiceTable";

// Assets
import { HSeparator } from "@/lib/ui/horizon/components/separator/Separator";
import moment from "moment";
import { FiChevronRight, FiCreditCard } from "react-icons/fi";
import { useQuery } from "react-query";
import API, { ENDPOINTS } from "@/lib/API";
import { useRouter } from "next/router";

export default function Content(props: {
  invoice: any;
  isCreditCardPaymentWaiting: boolean;
  onClickCreditCardPayment: any;
  [x: string]: any;
}) {
	const router = useRouter();
  const { data: paymentAccountsData, isLoading: isLoadingPaymentAccounts } =
    useQuery("paymentAccounts", () => API.get(ENDPOINTS.paymentAccounts));

  const {
    invoice,
    isCreditCardPaymentWaiting,
    onClickCreditCardPayment,
    ...rest
  } = props;
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bgCard = useColorModeValue("white", "navy.700");
  let paid = 0;

  return (
    <Flex direction="column" p={{ base: "10px", md: "60px" }}>
      <Card
        backgroundRepeat="no-repeat"
        bg={bgCard}
        p="30px"
        mb="30px"
        mt="-100px"
      >
        <Flex direction={{ base: "column", md: "row" }}>
          <Flex direction="column" me="auto" mb={{ base: "30px", md: "0px" }}>
            <Text
              w="max-content"
              mb="8px"
              fontSize="md"
              color="secondaryGray.600"
              fontWeight="400"
            >
              Invoice for:
            </Text>
            <Text color={textColor} fontSize="xl" fontWeight="700">
              {invoice?.client?.website}
            </Text>
            <Text
              w="max-content"
              mb="10px"
              fontSize="md"
              color="secondaryGray.600"
              fontWeight="400"
              lineHeight="26px"
            >
              #{invoice?.client?._id}
            </Text>
          </Flex>
          <Flex direction="column">
            <Text
              w="max-content"
              mb="4px"
              fontSize="md"
              color="secondaryGray.600"
              fontWeight="400"
            >
              Amount due
            </Text>
            <Text color={textColor} fontSize="36px" fontWeight="700">
              {(invoice?.totalAmount || 0).toLocaleString("en-US", {
                style: "currency",
                currency: "EUR",
              })}
            </Text>
            {invoice?.status === "paid" ? (
              <Text
                w="max-content"
                mb="10px"
                fontSize="md"
                p="6px 12px"
                bg="linear-gradient(108.54deg, #00C9A7 6.56%, #92FE9D 95.2%)"
                color="white"
                borderRadius="10px"
                fontWeight="700"
              >
                Paid
              </Text>
            ) : (
              <Text
                w="max-content"
                mb="10px"
                fontSize="md"
                p="6px 12px"
                bg="linear-gradient(108.54deg, #FF416C 6.56%, #FF4B2B 95.2%)"
                color="white"
                borderRadius="10px"
                fontWeight="700"
              >
                Due on {invoice?.dueDate ? moment(invoice?.dueDate).format("MMM DD, YYYY") : moment(invoice?.createdAt).format("MMM DD, YYYY")}
              </Text>
            )}
          </Flex>
        </Flex>
      </Card>
      {/*<InvoiceTable tableData={tableDataInvoice} /> */}
      <Flex mt="70px" direction={{ base: "column", md: "row" }}>
        <Box me="auto" mb={{ base: "40px", md: "0px" }}>
          <Text fontSize="lg" fontWeight="700" color={textColor}>
            Note
          </Text>
          <Text
            fontSize="md"
            fontWeight="400"
            color="secondaryGray.600"
            maxW="292px"
          >
            Hi {invoice?.merchant?.name}, please take a look at the this
            invoice. Let us know if you have any questions, thanks.
          </Text>
        </Box>
        <Box>
          <Flex align="center" justifyContent="space-between" mb="12px">
            <Text
              textAlign="end"
              color={textColor}
              fontSize="lg"
              fontWeight="400"
            >
              Total
            </Text>
            <Text color={textColor} fontSize="lg" fontWeight="700" maxW="292px">
              {(invoice?.totalAmount || 0).toLocaleString("en-US", {
                style: "currency",
                currency: "EUR",
              })}
            </Text>
          </Flex>
          <Flex align="center" justifyContent="space-between">
            <Text
              me="70px"
              fontWeight="400"
              textAlign="end"
              color={textColor}
              fontSize="lg"
            >
              Paid to date
            </Text>
            <Text color={textColor} fontSize="lg" fontWeight="700" maxW="292px">
              {invoice?.status === "paid"
                ? (invoice?.totalAmount || 0).toLocaleString("en-US", {
                    style: "currency",
                    currency: "EUR",
                  })
                : "€0.00"}
            </Text>
          </Flex>
          <HSeparator my="20px" />
          <Flex align="center" justifyContent="space-between">
            <Text
              me="70px"
              fontWeight="400"
              textAlign="end"
              color={textColor}
              fontSize="lg"
            >
              Amount to pay
            </Text>
            <Text color={textColor} fontSize="lg" fontWeight="700" maxW="292px">
              {invoice?.status === "paid"
                ? "€0.00"
                : (invoice?.totalAmount || 0).toLocaleString("en-US", {
                    style: "currency",
                    currency: "EUR",
                  })}
            </Text>
          </Flex>

          {invoice?.status == "pending" && (
            <Popover>
              <PopoverTrigger>
                <Button
                  type="button"
                  colorScheme="blue"
                  w="100%"
                  mt="20px"
                  //isLoading={isCreditCardPaymentWaiting}
                  //onClick={() => onClickCreditCardPayment(invoice)}
                  leftIcon={<Icon as={FiCreditCard} />}
                >
                  Pay Now
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                  <Text fontSize="md" fontWeight="400" color="secondaryGray.600">
										Select a payment method
									</Text>
									<VStack mt="20px" spacing="20px" w="100%" align="flex-start" justify="flex-start">
										{/*{['Wise', 'Crypto'].map((paymentAccount) => (
											<HStack justify="space-between" w="100%" key={paymentAccount} onClick={() => router.push(`/admin/paymentNotices/new?invoice=${invoice?._id}`)} cursor="pointer">
												<Text fontSize="md" fontWeight="400" color="secondaryGray.900">
													{paymentAccount}
												</Text>
												<Icon as={FiChevronRight} />
											</HStack>
                    ))}*/}
										<HStack justify="space-between" w="100%"  onClick={() => onClickCreditCardPayment(invoice)} cursor="pointer">
												<Text fontSize="md" fontWeight="400" color="secondaryGray.900">
													Credit Card
												</Text>
												<Icon as={FiChevronRight} />
											</HStack>
									</VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
