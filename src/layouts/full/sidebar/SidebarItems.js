import React, { useEffect, useState } from "react";
import Menuitems from "./MenuItems";
import { useLocation } from "react-router";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";

const SidebarItems = () => {
  const { pathname } = useLocation();
  const [userRoles, setUserRoles] = useState([]);

  // Lấy roles từ localStorage hoặc API khi component mount
  useEffect(() => {
    const storeData = JSON.parse(localStorage.getItem("data")) || [];
    const roles = storeData.roles || [];
    setUserRoles(roles);
    console.log("User roles:", roles);
  }, []);

  // Lọc các mục menu dựa trên roles của người dùng
  const filteredMenu = Menuitems.filter(
    (item) => !item.roles || item.roles.some((role) => userRoles.includes(role))
  );

  const pathDirect = pathname;

  return (
    // <Box sx={{ px: 3 }}>
    //   <List sx={{ pt: 0 }} className="sidebarNav">
    //     {Menuitems.map((item) => {
    //       // {/********SubHeader**********/}
    //       if (item.subheader) {
    //         return <NavGroup item={item} key={item.subheader} />;

    //         // {/********If Sub Menu**********/}
    //         /* eslint no-else-return: "off" */
    //       } else {
    //         return (
    //           <NavItem item={item} key={item.id} pathDirect={pathDirect} />
    //         );
    //       }
    //     })}
    //   </List>
    // </Box>

    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {filteredMenu.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;

            // {/********If Sub Menu**********/}
          } else {
            return (
              <NavItem item={item} key={item.id} pathDirect={pathDirect} />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
