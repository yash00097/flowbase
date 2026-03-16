"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fetchTelegramChats, type TelegramChat } from "./actions";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const parseModes = ["HTML", "Markdown", "MarkdownV2"] as const;

const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/, {
            message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
        }),
    credentialId: z.string().min(1, { message: "Credential is required" }),
    chatId: z.string().min(1, { message: "Chat ID is required" }),
    text: z
        .string()
        .min(1, { message: "Message text is required" })
        .max(4096, { message: "Telegram messages cannot be longer than 4096 characters" }),
    parseMode: z.enum(parseModes).optional(),
});

export type TelegramFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: TelegramFormValues) => void;
  defaultValues?: Partial<TelegramFormValues>;
}

export const TelegramDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {
    const {
        data: credentials,
        isLoading: isLoadingCredentials,
    } = useCredentialsByType(CredentialType.TELEGRAM);

    const [telegramChats, setTelegramChats] = useState<TelegramChat[]>([]);
    const [isLoadingChats, setIsLoadingChats] = useState(false);

    const form = useForm<TelegramFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            credentialId: defaultValues.credentialId || "",
            chatId: defaultValues.chatId || "",
            text: defaultValues.text || "",
            parseMode: defaultValues.parseMode,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                credentialId: defaultValues.credentialId || "",
                chatId: defaultValues.chatId || "",
                text: defaultValues.text || "",
                parseMode: defaultValues.parseMode,
            });
        }
        if (!open) {
            setTelegramChats([]);
            setIsLoadingChats(false);
        }
    }, [open, defaultValues, form]);

    const watchVariableName = form.watch("variableName") || "myTelegramMessage";
    const watchCredentialId = form.watch("credentialId");

    useEffect(() => {
        let isCancelled = false;

        const loadChats = async () => {
            if (!open || !watchCredentialId) {
                if (!isCancelled) {
                    setTelegramChats([]);
                    setIsLoadingChats(false);
                }
                return;
            }

            setIsLoadingChats(true);
            setTelegramChats([]);

            try {
                const chats = await fetchTelegramChats(watchCredentialId);

                if (isCancelled) {
                    return;
                }

                setTelegramChats(chats);

                const currentChatId = form.getValues("chatId");
                const hasCurrentChat = chats.some((chat) => chat.chatId === currentChatId);
                if (!hasCurrentChat) {
                    form.setValue("chatId", "", {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                }
            } catch {
                if (isCancelled) {
                    return;
                }

                setTelegramChats([]);
                form.setValue("chatId", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                });
                toast.error("Failed to load Telegram chats from this bot.");
            } finally {
                if (!isCancelled) {
                    setIsLoadingChats(false);
                }
            }
        };

        void loadChats();

        return () => {
            isCancelled = true;
        };
    }, [open, watchCredentialId, form]);

    const handleFormSubmit = (data: TelegramFormValues) => {
        onSubmit(data);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Telegram Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Telegram bot credential and message settings for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-8 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="myTelegramMessage"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in other nodes:{""} {`{{${watchVariableName}.text}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="credentialId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telegram Credential</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setTelegramChats([]);
                                            form.setValue("chatId", "", {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            });
                                        }}
                                        value={field.value || undefined}
                                        disabled={isLoadingCredentials || !credentials?.length}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a credential" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {credentials?.map((credential) => (
                                                <SelectItem
                                                    key={credential.id}
                                                    value={credential.id}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Image
                                                            src="/logos/telegram.svg"
                                                            alt="Telegram"
                                                            width={16}
                                                            height={16}
                                                        />
                                                        {credential.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Choose the saved Telegram bot token to use for this message.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="chatId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chat</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value || undefined}
                                        disabled={!watchCredentialId || isLoadingChats || telegramChats.length === 0}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder={
                                                        !watchCredentialId
                                                            ? "Select a credential first"
                                                            : isLoadingChats
                                                              ? "Loading chats..."
                                                              : "No chats found"
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {telegramChats.map((chat) => (
                                                <SelectItem
                                                    key={chat.chatId}
                                                    value={chat.chatId}
                                                >
                                                    <div className="flex flex-col">
                                                        <span>{chat.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {chat.chatId} ({chat.type})
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Chats are loaded from Telegram getUpdates for the selected bot token.
                                        {watchCredentialId && !isLoadingChats && telegramChats.length === 0
                                            ? " Send a message to the bot in your target chat, then reopen this dialog to fetch it."
                                            : ""}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message Text</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Hello from Flowbase! This message was sent with Telegram."
                                            className="min-h-30 font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The message to send. Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="parseMode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parse Mode (Optional)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value || undefined}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="No formatting" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {parseModes.map((parseMode) => (
                                                <SelectItem key={parseMode} value={parseMode}>
                                                    {parseMode}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Apply Telegram formatting to the message text when needed.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="mt-4">
                            <Button type="submit">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};