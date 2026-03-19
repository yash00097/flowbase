import type { NodeExecutor } from "@/features/executions/types";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { whatsappChannel } from "@/inngest/channels/whatsapp";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const SafeString = new Handlebars.SafeString(jsonString);
  return SafeString;
});

type WhatsappData = {
  variableName?: string;
  phoneNumberId?: string;
  accessToken?: string;
  recipientPhone?: string;
  content?: string;
}

export const whatsappExecutor: NodeExecutor<WhatsappData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    whatsappChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.content) {
    await publish(
      whatsappChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Whatsapp node: Content is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  try {
    const result = await step.run("whatsapp-webhook", async () => {
      if (!data.phoneNumberId) {
        await publish(
          whatsappChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Whatsapp node: Phone Number ID is missing");
      }

      if (!data.accessToken) {
        await publish(
          whatsappChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Whatsapp node: Access Token is missing");
      }

      if (!data.recipientPhone) {
        await publish(
          whatsappChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Whatsapp node: Recipient phone number is missing");
      }

      const apiUrl = `https://graph.facebook.com/v21.0/${data.phoneNumberId}/messages`;

      await ky.post(apiUrl, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
        json: {
          messaging_product: "whatsapp",
          to: data.recipientPhone,
          type: "text",
          text: {
            body: content.slice(0, 4096),
          },
        },
      });

      if (!data.variableName) {
        await publish(
          whatsappChannel().status({
            nodeId,
            status: "error",
          })
        );
        throw new NonRetriableError("Whatsapp node: Variable name is missing");
      }

      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 4096),
        },
      };
    });


    await publish(
      whatsappChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return { context: result, activeHandle: "source-1" };
  } catch (error) {
      await publish(
        whatsappChannel().status({
          nodeId,
          status: "error",
        }),
      );
      throw error;
    }
};