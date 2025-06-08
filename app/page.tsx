"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useDroppable, DndContext, useSensor, PointerSensor } from "@dnd-kit/core";

import { Button } from "@/components/ui/button";
import UserInformation from "./_components/user_information";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import ChatButton from "./_components/chat_button";

export default function Main() {
  const { user } = useUser();
  const router = useRouter();
  const sensor = useSensor(PointerSensor, { activationConstraint: { delay: 150, tolerance: 5, distance: 5} });
  
  return <>
    <DndContext sensors={[sensor]}>
      <Sidebar>
        <SidebarHeader className="flex flex-col items-center justify-center h-[60px]">
          <div className="font-bold">T4 Chat</div>
        </SidebarHeader>
        <SidebarContent className="px-4">
          <Button>
            <span className="text-sm font-bold">New Chat</span>
          </Button>
          <ChatButton id="testignid" title="test test test test test test test " href="asdasd"/>
          <ChatButton id="testasdinid" title="test test test test test test " href="asdasd"/>
          <ChatButton id="testinasdsadid" title="test test test " href="asdasd"/>
          <ChatButton id="testiasdafadnid" title="test test test test test test test test test test test test test test " href="asdasd"/>
        </SidebarContent>
        <SidebarFooter>
          { user ? <UserInformation /> : <Button onClick={() => router.push("/sign-in")}> Login </Button> }      
        </SidebarFooter>
      </Sidebar>  
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Welcome to the Main Page</h1>
        <p className="text-gray-600">This is a placeholder for your main content.</p>
      </div>
    </DndContext>
  </>
}