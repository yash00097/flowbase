import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky,{type Options as KyOptions} from "ky";

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
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

  const result = await step.run("http_request", async () => {
    const endpoint = data.endpoint!;
    const method = data.method || "GET";

    const options: KyOptions = { method };

    if(["POST", "PUT", "PATCH"].includes(method) ) {
      options.body = data.body;
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

    if(data.variableName){
      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    }
    
    return {
      ...context,
      ...responsePayload
    }
  });

  // TODO: Publish "success" state for HTTP request

  return result;
};