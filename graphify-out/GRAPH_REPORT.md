# Graph Report - .  (2026-08-03)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 770 nodes · 1444 edges · 79 communities (34 shown, 45 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.57)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ba4e009`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- github-engine/index.ts
- dashboard/page.tsx
- AuthModal.tsx
- devDependencies
- carousel.tsx
- sidebar.tsx
- compilerOptions
- generate-roadmap-flow.ts
- use-toast.ts
- cn
- question.types.ts
- technologies.ts
- components.json
- generate-assessment-flow.ts
- start/route.ts
- assessment.ts
- menubar.tsx
- seed-question-bank.ts
- typescript-parser.ts
- question-pool.ts
- dependencies
- DashboardShell.tsx
- alert-dialog.tsx
- dropdown-menu.tsx
- table.tsx
- role-weights.ts
- alert.tsx
- question-bank.ts
- eslint.config.mjs
- avatar.tsx
- tabs.tsx
- app/layout.tsx
- class-variance-authority
- clsx
- date-fns
- dotenv
- embla-carousel-react
- firebase
- firebase-admin
- genkit
- @genkit-ai/compat-oai
- genkitx-groq
- lucide-react
- migration.sh
- next
- next.config.ts
- next-env.d.ts
- open-next.config.ts
- patch-package
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-avatar
- @radix-ui/react-checkbox
- @radix-ui/react-collapsible
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- @radix-ui/react-menubar
- @radix-ui/react-popover
- @radix-ui/react-progress
- @radix-ui/react-radio-group
- @radix-ui/react-scroll-area
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slot
- @radix-ui/react-switch
- @radix-ui/react-tooltip
- react-dom
- react-hook-form
- recharts
- tailwind-merge
- tailwindcss-animate
- tree-sitter
- tree-sitter-typescript
- postcss.config.mjs
- vitest.config.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 53 edges
2. `useAuthUser()` - 19 edges
3. `Button` - 16 edges
4. `compilerOptions` - 16 edges
5. `analyzeRepositorySources()` - 14 edges
6. `adminDb()` - 13 edges
7. `JobService` - 13 edges
8. `SkillsService` - 13 edges
9. `scripts` - 11 edges
10. `main()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `useCarousel()` --references--> `react`  [EXTRACTED]
  src/components/ui/carousel.tsx → package.json
- `useChart()` --references--> `react`  [EXTRACTED]
  src/components/ui/chart.tsx → package.json
- `useFormField()` --references--> `react`  [EXTRACTED]
  src/components/ui/form.tsx → package.json
- `useSidebar()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `useIsMobile()` --references--> `react`  [EXTRACTED]
  src/hooks/use-mobile.tsx → package.json

## Import Cycles
- None detected.

## Communities (79 total, 45 thin omitted)

### Community 0 - "github-engine/index.ts"
Cohesion: 0.07
Nodes (58): fileIR, mockSignals, parsedAST, result, testAIFlow(), main(), generateGithubFeedback(), GenerateGithubFeedbackInput (+50 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.07
Nodes (44): CandidatesPage(), VacancyRow, CompatibilityPage(), CorePage(), JobsPage(), DashboardPage(), ProfilePage(), RoadmapPage() (+36 more)

### Community 2 - "AuthModal.tsx"
Cohesion: 0.07
Nodes (37): NewVacancyPage(), Home(), AuthModal(), ChoiceOptions(), MultiSelect(), Ordering(), QuestionCard(), QuestionTypeBadge() (+29 more)

### Community 3 - "devDependencies"
Cohesion: 0.04
Nodes (45): eslint, eslint-config-next, @eslint/eslintrc, @firebase/rules-unit-testing, genkit-cli, @opennextjs/cloudflare, devDependencies, eslint (+37 more)

### Community 4 - "carousel.tsx"
Cohesion: 0.05
Nodes (34): react, react, Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem (+26 more)

### Community 5 - "sidebar.tsx"
Cohesion: 0.07
Nodes (28): Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 7 - "generate-roadmap-flow.ts"
Cohesion: 0.11
Nodes (21): main(), generateRoadmap(), generateRoadmapFlow, GenerateRoadmapInput, GenerateRoadmapInputSchema, GenerateRoadmapOutput, GenerateRoadmapOutputSchema, LenientRoadmap (+13 more)

### Community 8 - "use-toast.ts"
Cohesion: 0.12
Nodes (22): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+14 more)

### Community 9 - "cn"
Cohesion: 0.12
Nodes (15): Checkbox, DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay, DialogTitle, PopoverContent (+7 more)

### Community 10 - "question.types.ts"
Cohesion: 0.15
Nodes (15): gradeQuestion(), base, mc(), poolOf(), CodeOutputQuestion, MultipleChoiceQuestion, MultiSelectQuestion, OrderingQuestion (+7 more)

### Community 11 - "technologies.ts"
Cohesion: 0.19
Nodes (15): LineContent(), allSources(), dedupe(), resolveSourcesForSkill(), SOURCE_CATALOG, SourceCategory, TECHNOLOGY_SOURCES, UNIVERSAL_SOURCES (+7 more)

### Community 12 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 13 - "generate-assessment-flow.ts"
Cohesion: 0.12
Nodes (13): BaseFields, DIFFICULTIES, Difficulty, generateQuestionsFlow, GenerateQuestionsInput, GenerateQuestionsInputSchema, GenerateQuestionsOutput, GenerateQuestionsOutputSchema (+5 more)

### Community 14 - "start/route.ts"
Cohesion: 0.26
Nodes (14): POST(), runtime, loadOrCreatePool(), POST(), readPool(), runtime, adminApp(), adminAuth() (+6 more)

### Community 15 - "assessment.ts"
Cohesion: 0.23
Nodes (14): POST(), runtime, gradeAnswers(), GradeResult, isIndexIn(), isValidAnswerFor(), isValidAnswerSet(), LEVELS (+6 more)

### Community 16 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarRadioItem, MenubarSeparator, MenubarShortcut() (+3 more)

### Community 17 - "seed-question-bank.ts"
Cohesion: 0.23
Nodes (13): buildPlan(), existingCount(), initFirestore(), main(), Options, parseArgs(), printPlan(), QUESTIONS_PER_TARGET (+5 more)

### Community 18 - "typescript-parser.ts"
Cohesion: 0.22
Nodes (6): ASTNode, LanguageParser, ParsedAST, convertNode(), TS_EXTENSIONS, TypeScriptParserImpl

### Community 19 - "question-pool.ts"
Cohesion: 0.23
Nodes (12): generateQuestions(), dedupeQuestions(), BANK_QUESTIONS_PER_TYPE, BuildPoolInput, buildQuestionPool(), buildTechnologyPool(), BuildTechnologyPoolInput, MAX_SKILLS_PER_POOL (+4 more)

### Community 20 - "dependencies"
Cohesion: 0.22
Nodes (10): @hookform/resolvers, dependencies, @hookform/resolvers, @radix-ui/react-slider, @radix-ui/react-tabs, @radix-ui/react-toast, zod, @radix-ui/react-slider (+2 more)

### Community 21 - "DashboardShell.tsx"
Cohesion: 0.27
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 22 - "alert-dialog.tsx"
Cohesion: 0.20
Nodes (9): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle (+1 more)

### Community 23 - "dropdown-menu.tsx"
Cohesion: 0.20
Nodes (9): DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut(), DropdownMenuSubContent (+1 more)

### Community 24 - "table.tsx"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 25 - "role-weights.ts"
Cohesion: 0.33
Nodes (5): ROLE_WEIGHTS, SENIORITY_THRESHOLDS, SeniorityLevel, SkillWeights, TargetRole

### Community 26 - "alert.tsx"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 27 - "question-bank.ts"
Cohesion: 0.70
Nodes (3): INITIAL_QUESTION_BANK, sampleBankQuestions(), shuffleOptions()

### Community 28 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): compat, __dirname, eslintConfig

### Community 29 - "avatar.tsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 30 - "tabs.tsx"
Cohesion: 0.50
Nodes (3): TabsContent, TabsList, TabsTrigger

## Knowledge Gaps
- **302 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+297 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`, `carousel.tsx`, `class-variance-authority`, `clsx`, `date-fns`, `dotenv`, `embla-carousel-react`, `firebase`, `firebase-admin`, `genkit`, `@genkit-ai/compat-oai`, `genkitx-groq`, `lucide-react`, `next`, `patch-package`, `@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-menubar`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-radio-group`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `@radix-ui/react-switch`, `@radix-ui/react-tooltip`, `react-dom`, `react-hook-form`, `recharts`, `tailwind-merge`, `tailwindcss-animate`, `tree-sitter`, `tree-sitter-typescript`?**
  _High betweenness centrality (0.276) - this node is a cross-community bridge._
- **Why does `react` connect `carousel.tsx` to `AuthModal.tsx`, `dependencies`, `sidebar.tsx`?**
  _High betweenness centrality (0.255) - this node is a cross-community bridge._
- **Why does `useToast()` connect `AuthModal.tsx` to `use-toast.ts`, `dashboard/page.tsx`, `carousel.tsx`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _302 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `github-engine/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06526315789473684 - nodes in this community are weakly interconnected._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07441688263606072 - nodes in this community are weakly interconnected._
- **Should `AuthModal.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06994535519125683 - nodes in this community are weakly interconnected._