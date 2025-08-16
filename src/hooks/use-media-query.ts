import * as React from "react"

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (event: MediaQueryListEvent) => setValue(event.matches)
    mql.addEventListener("change", onChange)
    setValue(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return value
}
