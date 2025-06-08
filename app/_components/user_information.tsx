import { trim } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserInformationProps {
  className ?: string;
}

export default function UserInformation(props: UserInformationProps) {
  
  const { user } = useUser();

  return <div className={`flex-1 flex flex-row items-center justify-center gap-4 mx-1 ${props.className}`}>
    <Avatar>
      <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User Avatar"} />
      <AvatarFallback className="font-bold">
        {user?.fullName ? user.fullName.charAt(0) : "U"}
      </AvatarFallback>
    </Avatar>
    <div className="flex-1 flex flex-col">
      <div className="text-sm font-semibold">{trim(user?.fullName || "Username", 28)}</div>
      <div className="text-sm text-gray-500">{trim(user?.emailAddresses[0]?.emailAddress || "email@gmail.com", 30)}</div>
    </div>
  </div>
}
