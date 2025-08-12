import { functions } from "@/lib/appwrite";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ExecutionMethod } from "appwrite";
import { useState, useEffect } from "react";

interface INotAsyncParams {
  async: false;
  onCompleted?: (
    data: Awaited<ReturnType<typeof functions.createExecution>>
  ) => void;
}

interface IAsyncParams {
  async: true;
  onCompleted?: () => void;
  refetchInterval?: number;
}

type IParams = INotAsyncParams | IAsyncParams;

type ExecutionStatus =
  | "not-triggered"
  | "pending"
  | "processing"
  | "completed"
  | "error";

export default function useExecution(
  executionParams: IParams = { async: false }
) {
  const [executionStatus, setExecutionStatus] =
    useState<ExecutionStatus>("not-triggered");

  const executeFunction = async (params: {
    functionId: string;
    body?: any;
    path?: string;
    method?: ExecutionMethod;
  }) => {
    return await functions.createExecution(
      params.functionId, // functionId
      typeof params.body === "object"
        ? JSON.stringify(params.body)
        : params.body, // body (optional)
      executionParams.async, // async (defaults to false)
      params.path, // path (optional)
      params.method
    );
  };
  const { data, mutate } = useMutation({
    mutationFn: executeFunction,
    onMutate: () => {
      setExecutionStatus("pending");
    },
    onSuccess: (data) => {
      if (!executionParams.async) executionParams?.onCompleted?.(data);
    },
    onError: () => setExecutionStatus("error"),
  });
  const functionId = data?.functionId;
  const executionId = data?.$id;
  const isQueryEnabled =
    executionParams.async && !!data && executionStatus !== "completed";
  const { data: statusData } = useQuery({
    queryKey: ["get-execution-status", functionId, executionId],
    queryFn: (props) => {
      const [_key, functionId, id] = props.queryKey;
      return functions.getExecution(functionId as string, id as string);
    },
    enabled: isQueryEnabled,
    refetchInterval: isQueryEnabled
      ? (executionParams.refetchInterval ?? 3000)
      : undefined,
  });

  useEffect(() => {
    const currentStatus = statusData?.status;
    if (currentStatus && executionParams.async) {
      setExecutionStatus(statusData.status as ExecutionStatus);
      if (statusData.status === "completed") executionParams.onCompleted?.();
    }
  }, [statusData]);

  return {
    mutate,
    status: executionStatus,
  };
}
