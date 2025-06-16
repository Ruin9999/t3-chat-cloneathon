import SidebarUser from "./sidebar-user"
import SidebarChats from "./sidebar-chats"
import SidebarUtils from "./sidebar-utils"
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar"

export default function CustomSidebar() {
  return <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarUtils />
    </SidebarHeader>
    <SidebarContent>
      <SidebarChats />
    </SidebarContent>
    <SidebarFooter>
      <SidebarUser />
    </SidebarFooter>
  </Sidebar>
}