# Project Structure and Naming Conventions

This project organizes React components by feature with shared utilities grouped under common directories.

```
src/
  components/
    auth/              # authentication forms and prompts
    chat/              # chat feature components
    common/            # shared utilities like AppVersion and Portal
    contact/           # contact forms and credenzas
    feedback/          # feedback forms, loaders and badges
    icons/             # reusable SVG icon components
    navigation/        # navigation and sidebar widgets
    settings/          # user settings forms and dialogs
    theme/             # theming helpers
    ui/                # base UI primitives (shadcn)
    waitlist/          # waitlist drawer components
```

**Naming pattern**

- Directories use `kebab-case`.
- React component files use `PascalCase.tsx` and export components with matching names.
- Shared utilities such as hooks or helpers keep `camelCase` file names.
- Barrel `index.ts` files re-export named components where helpful.

Following this structure keeps features isolated and encourages reusable shared components.
