import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/use-chat";

export const Route = createFileRoute("/__authenticatedLayout/chat")({
  component: ChatPage,
});

function ChatPage() {
  const [input, setInput] = React.useState("");
  const { messages, sendMessage } = useChat();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    sendMessage(value);
    setInput("");
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <Card className="flex h-full w-full max-w-2xl flex-col">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "flex justify-end"
                  : "flex justify-start"
              }
            >
              <div
                className={
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-lg px-3 py-2"
                    : "bg-muted text-muted-foreground rounded-lg px-3 py-2"
                }
              >
                {m.content}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <form onSubmit={onSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
            />
            <Button type="submit">Enviar</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
