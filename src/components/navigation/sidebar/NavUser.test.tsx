import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NavUser } from './NavUser'

vi.mock('@/hooks/queries/user', () => ({
  default: () => ({ data: { name: 'John Doe', email: 'john@example.com' } }),
}))

vi.mock('@tanstack/react-query', () => ({
  useMutation: () => ({ mutate: vi.fn(), status: 'idle' }),
}))

vi.mock('@tolgee/react', () => ({
  useTranslate: () => ({ t: (key: string) => key }),
}))

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => () => {},
  Link: ({ children }: any) => <a>{children}</a>,
}))

vi.mock('@/lib/appwrite', () => ({
  account: { deleteSession: vi.fn() },
}))

vi.mock('@/components/ui/sidebar', () => ({
  useSidebar: () => ({ isMobile: false }),
  SidebarMenu: ({ children }: any) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: any) => <div>{children}</div>,
  SidebarMenuButton: ({ children }: any) => <button>{children}</button>,
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }: any) => <div>{children}</div>,
  DropdownMenuSeparator: () => <div />,
  DropdownMenuItem: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarImage: (props: any) => <img {...props} />,
  AvatarFallback: ({ children }: any) => <div>{children}</div>,
}))

describe('NavUser', () => {
  it('renders session user information', () => {
    render(<NavUser />)
    expect(screen.getAllByText('John Doe')[0]).toBeTruthy()
    expect(screen.getAllByText('john@example.com')[0]).toBeTruthy()
  })
})
