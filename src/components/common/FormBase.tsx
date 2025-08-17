import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";

export default function FormBase({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
