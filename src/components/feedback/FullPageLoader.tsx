const FullPageLoader = () => (
  <div className="flex items-center flex-col justify-center w-dvw h-dvh px-6 ">
    <img
      className="size-96 object-scale-down rounded-full animate-pulse"
      src="/assets/main-logo.png"
    />
    <p className="font-mono text-2xl animate-pulse">Carregando ...</p>
  </div>
);

export default FullPageLoader;
