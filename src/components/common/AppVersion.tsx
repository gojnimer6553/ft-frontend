import pkg from "../../../package.json" assert { type: "json" };

export function AppVersion() {
  return <span>{pkg.version}</span>;
}
