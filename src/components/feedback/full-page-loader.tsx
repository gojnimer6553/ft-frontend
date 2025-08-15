export default function FullPageLoader() {
  return (
    <div className="flex items-center flex-col justify-center w-dvw h-dvh px-6 gap-4">
      <div className="bg-accent-foreground flex items-center justify-center rounded-full p-4">
        <img
          className="size-96 object-scale-down rounded-full animate-pulse"
          src="/assets/mascot/mascot_default.png"
        />
      </div>
    </div>
  );
}
