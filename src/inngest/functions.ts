import prisma from "@/lib/db";
import { inngest } from "./client";
import {createGoogleGenerativeAI} from '@ai-sdk/google';
import { createOpenAI } from "@ai-sdk/openai";
import {createAnthropic} from '@ai-sdk/anthropic';
import {generateText, type LanguageModel} from 'ai';

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pre-ai-wait", "5s");

    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google('gemini-2.5-flash') as LanguageModel,
        system:"You are a helpful assistant that helps users with their queries.",
        prompt: "what is 2+2",
      }
    );
    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai('gpt-4') as unknown as LanguageModel,
        system:"You are a helpful assistant that helps users with their queries.",
        prompt: "what is 2+2",
      }
    );
    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: anthropic('claude-opus-4-0') as unknown as LanguageModel,
        system:"You are a helpful assistant that helps users with their queries.",
        prompt: "what is 2+2",
      }
    );
    return { geminiSteps, openaiSteps, anthropicSteps };
  },
);