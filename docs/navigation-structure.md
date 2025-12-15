# 🧭 Scount Navigation Structure

## Expo Router File Structure

```
app/
├── _layout.tsx                    # Root layout (Auth + PowerSync)
├── +html.tsx                      # Web HTML template
├── (auth)/                        # Authentication group
│   ├── _layout.tsx                # Auth stack layout
│   ├── login.tsx                  # Login screen
│   └── check-email.tsx            # OTP verification screen
├── (tabs)/                        # Main tab group (Bottom Tab Navigator)
│   ├── _layout.tsx                # Tab navigator layout
│   ├── group/
│   │   └── index.tsx              # Group list screen (shows tabs)
│   ├── personal/
│   │   └── index.tsx              # Personal transactions list (shows tabs)
│   └── profile.tsx                # Profile settings screen (shows tabs)
└── (stack)/                       # Detail screens (No Bottom Tab Navigator)
    ├── _layout.tsx                # Stack layout (hidden tabs)
    ├── group/
    │   └── [groupId]/
    │       ├── _layout.tsx          # Group detail layout + dynamic header
    │       ├── expenses.tsx         # Expenses tab (shows search icon)
    │       ├── balances.tsx         # Balances tab
    │       ├── photos.tsx           # Photos tab
    │       ├── [transactionId].tsx   # Transaction detail screen (from group)
    │       ├── transaction-form.tsx # Transaction form (with user selection)
    │       └── report.tsx           # Group report page (expense vs income graph)
    └── personal/
        ├── [transactionId].tsx      # Transaction detail screen (from personal)
        ├── transaction-form.tsx     # Transaction form (personal)
        ├── edit-categories.tsx      # Edit categories screen
        ├── edit-tags.tsx           # Edit tags screen
        └── report.tsx              # Personal report page (expense vs income graph)
```

## Component Structure

```
src/components/
├── ui/                           # Basic UI components
│   ├── Card.tsx                  # Generic card component
│   ├── Button.tsx               # Generic button
│   ├── Icon.tsx                 # Icon wrapper
│   └── index.ts
├── layout/                       # Layout components
│   ├── AppHeader.tsx            # App header with title
│   ├── FloatingActionButton.tsx # FAB component
│   ├── LoadingScreen.tsx        # Loading state
│   └── index.ts
├── features/                    # Feature-specific components
│   ├── groups/
│   │   ├── GroupCard.tsx        # Group list item
│   │   ├── GroupEmptyState.tsx       # No groups state
│   │   └── index.ts
│   ├── personal/
│   │   ├── PersonalEmptyState.tsx # No personal transactions
│   │   └── index.ts
│   ├── transactions/            # Neutral transaction components (used by both personal & group)
│   │   ├── TransactionCard.tsx  # Transaction list item (personal & group)
│   │   └── index.ts
│   ├── reports/
│   │   ├── ExpenseIncomeGraph.tsx # Expense vs Income graph component
│   │   ├── ReportCard.tsx       # Clickable report card (opens report page)
│   │   └── index.ts
│   └── index.ts
├── forms/                       # Form-related components
│   ├── CategorySelector.tsx     # Category selection
│   ├── TagSelector.tsx          # Tag selection
│   ├── UserSelector.tsx         # User selection (group only)
│   └── index.ts
├── lists/                       # List components
│   ├── ExpenseItem.tsx          # Expense list item
│   ├── SmartList.tsx            # Grouped list component
│   ├── DailyTotal.tsx           # Daily total display
│   └── index.ts
├── navigation/                   # Navigation components
│   ├── HeaderActions.tsx        # Dynamic header actions
│   ├── SegmentedControl.tsx     # Tab control
│   └── index.ts
└── index.ts                     # Main exports
```
