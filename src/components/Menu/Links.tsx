// @ts-nocheck
// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
  HStack,
  Select,
} from "@chakra-ui/react";
// Custom Components
import { ItemContent } from "@/lib/ui/horizon/components/menu/ItemContent";
import { SearchBar } from "@/lib/ui/horizon/components/navbar/searchBar/SearchBar";
import { SidebarResponsive } from "@/lib/ui/horizon/components/sidebar/Sidebar";
// Assets
import navImage from "@/lib/ui/horizon/assets/img/layout/Navbar.png";
import { MdNotificationsNone, MdInfoOutline } from "react-icons/md";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import { FaEthereum, FaMoneyBill } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";
import { BsCash } from "react-icons/bs";
import { IoCash } from "react-icons/io5";
import { WalletIcon } from "@/lib/ui/horizon/components/icons/Icons";
import { PermissionGuard } from "../PermissionGuard";
import axios from "axios";
import API, { ENDPOINTS } from "@/lib/API";
export default function HeaderLinks(props: { secondary: boolean }) {
  const session = useSession();

  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.400", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.700", "brand.400");
  const ethColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const ethBg = useColorModeValue("secondaryGray.300", "navy.900");
  const ethBox = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const borderButton = useColorModeValue("secondaryGray.500", "whiteAlpha.200");

  const handleChangeClient = async (client) => {
    try {
      const response = await API.post(ENDPOINTS.users + "/change-client", {
        website: client,
        id: session.data?._id,
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
      zIndex="999"
    >
      {session.data?.multiaccessClients.length > 1 && (
        <Select
          value={session.data?.client?.website}
          size="xs"
          w="190px"
          borderRadius="30px"
          h="40px"
          mr="10px"
          ml="10px"
					onChange={(e) => handleChangeClient(e.target.value)}
        >
          {session.data?.multiaccessClients.map((client) => (
            <option value={client}>{client}</option>
          ))}
        </Select>
      )}

      <SearchBar
        mb={() => {
          if (secondary) {
            return { base: "10px", md: "unset" };
          }
          return "unset";
        }}
        me="10px"
        borderRadius="30px"
      />

      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: "pointer" }}
            color="white"
            name={session?.data?.email.split("@")[0]}
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, {session?.data?.email.split("@")[0]}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={async () => {
                await signOut();
              }}
            >
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
