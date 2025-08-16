import * as React from "react"

import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

type BaseProps = React.ComponentProps<typeof Dialog>

interface RootCredenzaProps extends BaseProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface CredenzaProps extends BaseProps {
  className?: string
  asChild?: true
}

const CredenzaContext = React.createContext<{ isDesktop: boolean }>({
  isDesktop: false,
})

const useCredenzaContext = () => {
  const context = React.useContext(CredenzaContext)
  if (!context) {
    throw new Error(
      "Credenza components cannot be rendered outside the Credenza Context",
    )
  }
  return context
}

const Credenza = ({ children, ...props }: RootCredenzaProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const Component = isDesktop ? Dialog : Drawer

  return (
    <CredenzaContext.Provider value={{ isDesktop }}>
      <Component {...props} {...(!isDesktop && { autoFocus: true })}>
        {children}
      </Component>
    </CredenzaContext.Provider>
  )
}

const CredenzaTrigger = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext()
  const Component = isDesktop ? DialogTrigger : DrawerTrigger

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

const CredenzaClose = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext()
  const Component = isDesktop ? DialogClose : DrawerClose

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

const CredenzaContent = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext()
  const Component = isDesktop ? DialogContent : DrawerContent

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

const CredenzaDescription = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext()
  const Component = isDesktop ? DialogDescription : DrawerDescription

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

const CredenzaHeader = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext()
  const Component = isDesktop ? DialogHeader : DrawerHeader

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

const CredenzaTitle = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext()
  const Component = isDesktop ? DialogTitle : DrawerTitle

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

const CredenzaBody = ({ className, children, ...props }: CredenzaProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  )
}

const CredenzaFooter = ({ className, children, ...props }: CredenzaProps) => {
  const { isDesktop } = useCredenzaContext()
  const Component = isDesktop ? DialogFooter : DrawerFooter

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

export {
  Credenza,
  CredenzaTrigger,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter,
}
