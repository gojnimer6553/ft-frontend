import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslate } from "@tolgee/react";

export default function SoonBadge({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslate();
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
      <Badge variant={"secondary"} className="absolute -top-2 -right-2">
        {t("soon")}
      </Badge>
    </div>
  );
}
