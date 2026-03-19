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
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    condition: z.string().min(1, { message: "Condition logic is required" }),
});

export type IfFormValues = z.infer<typeof formSchema>

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: IfFormValues) => void;
  defaultValues?: Partial<IfFormValues>;
}

export const IfDialog = ({ 
    open, 
    onOpenChange, 
    onSubmit, 
    defaultValues = {},
}: Props) => {

    const form = useForm<IfFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            condition: defaultValues.condition || "",
        }
    });

    useEffect(() => {
        if (open) {
            form.reset({
                condition: defaultValues.condition || "",
            });
        }
    }, [open, defaultValues, form]);

    const handleFormSubmit = (data: IfFormValues) => {
        onSubmit(data);
        onOpenChange(false);
    }

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>If Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the condition to evaluate. The workflow will branch to the True or False path based on this condition.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(handleFormSubmit)}
                        className="space-y-6 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="condition"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Condition Logic (JavaScript)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="{{webhook.data.amount}} > 100"
                                            className="min-h-32 font-mono text-sm"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Write a Javascript expression to evaluate. Variables will be interpolated before evaluation. 
                                        Example: <code>{"{{webhook.body.status}}"} === "paid"</code>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <DialogFooter>
                            <Button type="submit">
                                Save Condition
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}