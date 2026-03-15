import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { FlaskConicalIcon } from "lucide-react";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const executeWorkflow = useExecuteWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId }, {
      onError: (error) => {
        handleError(error);
      },
    });
  }

  return (
    <>
      {modal}
      <Button size="lg" onClick={handleExecute} disabled={executeWorkflow.isPending}>
        <FlaskConicalIcon className="size-4" />
        Execute workflow
      </Button>
    </>
  );
};