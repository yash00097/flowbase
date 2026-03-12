import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "./polar";

export const auth = betterAuth({
    trustedOrigins: [
        "https://flow-base.dev",
        "https://www.flow-base.dev",
        "https://flowbase-pink.vercel.app",
    ],
    database: prismaAdapter(prisma,{
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    socialProviders: {
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    plugins:[
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use:[
                checkout({
                    products: [
                        {
                            productId:"daa2203d-d94e-4e9b-b8a1-4cd2a84daa10",
                            slug:"pro",
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL ,
                    authenticatedUsersOnly: true,
                }),
                portal(),
            ],
        }),
    ]
});