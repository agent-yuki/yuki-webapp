# Credit System Implementation Plan

This document tracks the implementation of the flexible credit-based subscription system for the Agent Yuki security analyzer.

## Phase 1: Database & Schema
- [x] **Create Migration**: Add `credits` column to `profiles` table.
    - Default value: 3 (Free Tier).
    - Add logic to initialize existing users.
- [x] **Run Migration**: Execute the SQL against the Supabase instance.

## Phase 2: Business Logic (Service Layer)
- [x] **Update `incidentService.ts`**:
    - Add `getUserCredits(userId)`: Returns boolean or credit count.
    - Integration check logic into `createIncident`.
    - Integration deduction logic into `createIncident`.
- [ ] **Create RPC Migration**: Create `decrement_credits` function for atomic updates.
- [x] **Run RPC Migration**.

## Phase 3: Dashboard UI Enhancements
- [ ] **Display Credits**:
    - Add a "Credits Badge" in the Dashboard header (or sidebar).
    - Real-time updates after a scan.
- [ ] **Enforce Limits in UI**:
    - Disable "Start Scan" button if credits <= 0.
    - Show an "Upgrade to Pro" prompt if out of credits.

## Phase 4: Billing & Mock Upgrades
- [x] **Display Credits**:
    - Add a "Credits Badge" in the Dashboard header (or sidebar).
    - Real-time updates after a scan.
- [x] **Enforce Limits in UI**:
    - Disable "Start Scan" button if credits <= 0.
    - Show an "Upgrade to Pro" prompt if out of credits.

## Phase 4: Billing & Mock Upgrades
- [x] **Update Billing Page** (`src/app/billing/page.tsx`):
    - Display current plan and credit usage.
    - Add a **(Mock) "Upgrade / Top Up"** button for testing.
    - Implement the mock action to add credits to the profile.

---

## Status Log
- **User Request**: Implemented a credit-based system where free users get 3 credits and Pro users get monthly allowances.
- **Current State**: Implementation Complete. System is now active.
