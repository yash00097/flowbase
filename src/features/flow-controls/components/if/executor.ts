import type { NodeExecutor } from "@/features/executions/types";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { ifChannel } from "@/inngest/channels/if";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const SafeString = new Handlebars.SafeString(jsonString);
  return SafeString;
});

type IfData = {
  condition?: string;
}

export const ifExecutor: NodeExecutor<IfData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    ifChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.condition) {
    await publish(
      ifChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("If node: Condition is missing");
  }

  const rawCondition = Handlebars.compile(data.condition)(context);
  const evaluatedExpression = decode(rawCondition);

  try {
    const result = await step.run("if-condition-evaluation", async () => {
      // Evaluate the condition expression safely
      const conditionResult = new Function('"use strict";return (' + evaluatedExpression + ')')();
      
      const activeHandle = conditionResult ? "source-true" : "source-false";

      // We attach whether it succeeded to context if we want, but basically we return the identical context
      return { context, activeHandle };
    });

    await publish(
      ifChannel().status({
        nodeId,
        status: "success",
      }),
    );

    // The IF node won't alter the context, it just routes execution by setting activeHandle
    // Note: NodeExecutor type needs to be updated to support { context, activeHandle } return type soon.
    return result as any; 
  } catch (error) {
      await publish(
        ifChannel().status({
          nodeId,
          status: "error",
        }),
      );
      throw new NonRetriableError(`If node evaluation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};