import type { NodeExecutor } from "@/features/executions/types";
import { decode } from "html-entities";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { ifChannel } from "@/inngest/channels/if";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type IfData = {
  condition?: string;
};

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
      }),
    );
    throw new NonRetriableError("If node: Condition is missing");
  }

  // Resolve any {{variables}} in the condition string against the current context
  const rawCondition = Handlebars.compile(data.condition)(context);
  const evaluatedExpression = decode(rawCondition);

  try {
    const result = await step.run("if-condition-evaluation", async () => {
      // eslint-disable-next-line no-new-func
      const conditionResult = new Function(
        '"use strict"; return (' + evaluatedExpression + ")",
      )() as unknown;

      const activeHandle = conditionResult ? "source-true" : "source-false";
      return { context, activeHandle };
    });

    await publish(
      ifChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      ifChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError(
      `If node evaluation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};