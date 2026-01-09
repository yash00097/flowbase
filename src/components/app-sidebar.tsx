"use client"

import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";

const menuItems = [
    {
        title: "Main",
        itmes: [
            {
                title:"Workflows",
                icon: FolderOpenIcon,
                url:"/workflows",
            },
            {
                title:"Credentials",
                icon: KeyIcon,
                url:"/credentials",
            },
            {
                title:"Executions",
                icon: HistoryIcon,
                url:"/executions",
            },
        ],
    }
]

export const AppSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const {hasActiveSubscription,isLoading} = useHasActiveSubscription();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
                            <Link href="/" prefetch>
                                <Image src="/logos/logo.svg" alt="Flowbase" width={32} height={32}/>
                                <span className="font-semibold text-sm">Flowbase</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                            {group.itmes.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton 
                                        tooltip={item.title}
                                        isActive={
                                            item.url === "/"
                                                ? pathname === "/"
                                                : pathname.startsWith(item.url)
                                        }
                                        asChild
                                        className="gap-x-4 h-10 px-4"
                                    >
                                        <Link href={item.url} prefetch>
                                            <item.icon className="size-4 text-purple-900" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {!isLoading && !hasActiveSubscription && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip="Upgrade to Pro"
                                className="gap-x-4 h-10 px-4"
                                onClick={()=>authClient.checkout({slug:"pro"})}
                            >
                                <StarIcon className="size-4 text-purple-900" />
                                <span>Upgrade to Pro</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Billing Portal"
                            className="gap-x-4 h-10 px-4"
                            onClick={()=>authClient.customer.portal()}
                        >
                            <CreditCardIcon className="size-4 text-purple-900" />
                            <span>Billing Portal</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Sign out"
                            className="gap-x-4 h-10 px-4"
                            onClick={()=>authClient.signOut({
                                fetchOptions:{
                                    onSuccess:()=> {
                                        router.push("/login");
                                    }
                                }
                            })}
                        >
                            <LogOutIcon className="size-4 text-purple-900" />
                            <span>Sign out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}