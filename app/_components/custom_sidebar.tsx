import SidebarUser from "./sidebar-user"
import SidebarChats from "./sidebar-chats"
import SidebarUtils from "./sidebar-utils"
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar"

export default function CustomSidebar() {
  return <Sidebar collapsible="icon">
    <SidebarContent>
      <SidebarUtils />  
      <SidebarChats />
    </SidebarContent>
    <SidebarFooter>
      <SidebarUser />
    </SidebarFooter>
  </Sidebar>
}