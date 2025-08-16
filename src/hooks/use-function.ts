import useExecution from "./use-execution";
import { ExecutionMethod } from "appwrite";

export default function useFunction(
  functionId: string,
  executionParams: Parameters<typeof useExecution>[0] = { async: false }
) {
  const { mutate, status } = useExecution(executionParams);

  const trigger = (
    params: { body?: any; path?: string },
    options?: any
  ) =>
    mutate(
      {
        functionId,
        body: params.body,
        path: params.path,
        method: ExecutionMethod.POST,
      },
      options
    );

  return { mutate: trigger, status };
}
