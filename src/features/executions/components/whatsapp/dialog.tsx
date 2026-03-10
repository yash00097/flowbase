"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";



const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/, { 
            message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
        }),
    phoneNumberId: z
        .string()
        .min(1, { message: "Phone Number ID is required" }),
    accessToken: z
        .string()
        .min(1, { message: "Access Token is required" }),
    recipientPhone: z
        .string()
        .min(1, { message: "Recipient phone number is required" })
        .regex(/^\+?[1-9]\d{1,14}$/, {
            message: "Enter a valid phone number in E.164 format (e.g. +1234567890)",
        }),
    content: z
        .string()
        .min(1, { message: "Message content is required" })
        .max(4096, { message: "WhatsApp messages cannot be longer than 4096 characters" }),
});

export type WhatsappFormValues = z.infer<typeof formSchema>
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<WhatsappFormValues>;
}

export const WhatsappDialog = ({ 
    open, 
    onOpenChange, 
    onSubmit, 
    defaultValues = {},
}: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            phoneNumberId: defaultValues.phoneNumberId || "",
            accessToken: defaultValues.accessToken || "",
            recipientPhone: defaultValues.recipientPhone || "",
            content: defaultValues.content || "",
        }
    });

    // Reset form values when dialog opens with new defaults
    useEffect(() => {
    if (open) {
        form.reset({
            variableName: defaultValues.variableName || "",
            phoneNumberId: defaultValues.phoneNumberId || "",
            accessToken: defaultValues.accessToken || "",
            recipientPhone: defaultValues.recipientPhone || "",
            content: defaultValues.content || "",
        });
    }
    }, [open, defaultValues, form]);

    const watchVariableName = form.watch("variableName") || "myWhatsappMessage";

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
        onSubmit(data);
        onOpenChange(false);
    }

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>WhatsApp Configuration</DialogTitle>
                    <DialogDescription>
                        Configure your WhatsApp Cloud API settings for this node.
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
                                            placeholder="myWhatsappMessage"
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
                            name="phoneNumberId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number ID</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123456789012345"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            From Meta Developer Portal → WhatsApp → API Setup
                                        </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="accessToken"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Access Token</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="EAAxxxxxxx..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Temporary or permanent access token from Meta Developer Portal
                                        </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="recipientPhone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+1234567890"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Phone number in E.164 format (e.g. +1234567890)
                                        </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Hello! This is a message sent via WhatsApp Cloud API."
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
}