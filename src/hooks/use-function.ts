import useExecution from "./use-execution";
import { ExecutionMethod } from "appwrite";

const FUNCTION_ID = "689feffd0007270a4aa1";

export default function useFunction(
  executionParams: Parameters<typeof useExecution>[0] = { async: false }
) {
  const { mutate, status } = useExecution(executionParams);

  const trigger = (
    params: { body?: any; path?: string },
    options?: any
  ) =>
    mutate(
      {
        functionId: FUNCTION_ID,
        body: params.body,
        path: params.path,
        method: ExecutionMethod.POST,
      },
      options
    );

  return { mutate: trigger, status };
}
