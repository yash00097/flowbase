"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { UserIcon } from "lucide-react";

export const AppHeader = () => {
    const { data: session } = authClient.useSession();
    const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

    const user = session?.user;
    const initials = user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 bg-background">
            <SidebarTrigger />
            {user && (
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <Avatar className="size-8 cursor-pointer">
                                {user.image ? (
                                    <AvatarImage src={user.image} alt={user.name ?? "User"} />
                                ) : null}
                                <AvatarFallback>
                                    {initials ?? <UserIcon className="size-4" />}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-64 p-4">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-10">
                                    {user.image ? (
                                        <AvatarImage src={user.image} alt={user.name ?? "User"} />
                                    ) : null}
                                    <AvatarFallback>
                                        {initials ?? <UserIcon className="size-4" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    {user.name && (
                                        <p className="text-sm font-medium truncate">{user.name}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground truncate">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="border-t pt-3">
                                {isLoading ? (
                                    <p className="text-xs text-muted-foreground">Loading...</p>
                                ) : hasActiveSubscription ? (
                                    <Badge variant="default">Pro</Badge>
                                ) : (
                                    <Badge variant="secondary">Free</Badge>
                                )}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </header>
    );
}