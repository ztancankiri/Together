// import React, { useState, useLayoutEffect, useContext } from "react";
// import { withRouter } from "react-router-dom";


// import "./side-bar.scss";
// import { defaultSidebar } from "./defaultSidebar";
// import { profileSidebar } from "./profileSidebar";
// import { groupDetailsSidebar } from "./groupDetailsSidebar";
// import { eventDetailsSidebar } from "./eventDetailsSidebar";

// function SideBar({ location, history }) {
//     const [sidebarMode, setSidebarMode] = useState(0);
//     let path_id = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

//     useLayoutEffect(() => {
//         if (location.pathname.indexOf('event-details') > -1) {
//             setSidebarMode(1);
//         }
//         else if (location.pathname.indexOf('group-details') > -1) {
//             setSidebarMode(2);
//         }
//         else if (location.pathname.indexOf('profile') > -1) {
//             setSidebarMode(3);
//         }
//         else {
//             setSidebarMode(0);
//         }
//     });
//     switch (sidebarMode) {
//         case 1:
//             return eventDetailsSidebar(path_id);
//         case 2:
//             return groupDetailsSidebar(path_id);
//         case 3:
//             return profileSidebar(history);
//         default:
//             return defaultSidebar();
//     }
// }

// export default withRouter(SideBar);