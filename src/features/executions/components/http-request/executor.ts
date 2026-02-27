import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as KyOptions} from "ky";
import Handlebars from "handlebars";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const SafeString = new Handlebars.SafeString(jsonString);
  return SafeString;
});

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
}

export const HttpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  // TODO: Publish "loading" state for HTTP request

  if(!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: Missing endpoint configuration.");
  }
  if(!data.variableName) {
    throw new NonRetriableError("HTTP Request node: Missing variable name configuration.");
  }
  if(!data.method) {
    throw new NonRetriableError("HTTP Request node: Missing method configuration.");
  }

  const result = await step.run("http_request", async () => {
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const method = data.method;

    const options: KyOptions = { method };

    if(["POST", "PUT", "PATCH"].includes(method) ) {
      const resolved = Handlebars.compile(data.body || "{}")(context);
      JSON.parse(resolved); 
      options.body = resolved;
      options.headers = {
        "Content-type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse:{
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  // TODO: Publish "success" state for HTTP request

  return result;
};