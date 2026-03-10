"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import {refine, z} from "zod"
import { Button } from "@/components/ui/button";
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {authClient} from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const registerSchema = z
.object({
    email: z.email("please enter a valid email address"),
    password: z.string().min(1, "password is required"),
    confirmPassword: z.string(),
    })
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {

    const router = useRouter();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const signInGithub = async () => {
        await authClient.signIn.social({
            provider: "github",
        },{
            onSuccess: () => {
                toast.success("Logged in successfully!");
                router.push("/");
            },
            onError: () => {
                toast.error("Failed to login with Github");
            },
        })
    }
    const signInGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
        },{
            onSuccess: () => {
                toast.success("Logged in successfully!");
                router.push("/");
            },
            onError: () => {
                toast.error("Failed to login with Google");
            },
        })
    }

    const onSubmit = async (values: RegisterFormValues) => {
        await authClient.signUp.email(
        {
            name: values.email.split("@")[0],
            email: values.email,
            password: values.password,
            callbackURL:"/"
        },
        {
            onSuccess: () => {
                toast.success("Account created successfully!");
                router.push("/");
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            }
        }
        );
    }

    const isPending = form.formState.isSubmitting;

    return (
       <div className="flex flex-col gap-6">
        <Card>
            <CardHeader className="text-center">
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={signInGithub}
                                    type="button" 
                                    disabled={isPending}
                                >
                                    <Image src="/logos/github.svg" width={20} height={20} alt="Github" />
                                    "Continue with Github"
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={signInGoogle}
                                    type="button" 
                                    disabled={isPending}
                                >
                                    <Image src="/logos/google.svg" width={20} height={20} alt="Google" />
                                    "Continue with Google"
                                </Button>
                            </div>
                            <div className="grid gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="email"
                                                    placeholder="m@example.com"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="password"
                                                    placeholder="**********"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="password"
                                                    placeholder="**********"
                                                    {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                <Button 
                                    type="submit"
                                    className="w-full"
                                    disabled={isPending}
                                    >
                                    {isPending ? "Signing up..." :  "Sign Up"}
                                </Button>   
                            </div>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link 
                                    href="/login"
                                    className={cn(
                                        "underline underline-offset-4 text-primary hover:text-primary/80 transition-colors",
                                        isPending && "pointer-events-none opacity-50"
                                    )}>
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
       </div> 
    );

}
    