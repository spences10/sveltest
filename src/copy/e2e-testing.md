# E2E Testing

## The Final Safety Net

E2E testing completes the **Client-Server Alignment Strategy** by
testing the full user journey from browser to server and back.

## Quick Overview

E2E tests validate:

- Complete form submission flows
- Client-server integration
- Real network requests
- Full user workflows

## Basic Pattern

```typescript
// e2e/registration.spec.ts
import { test, expect } from '@playwright/test';

test('user registration flow', async ({ page }) => {
	await page.goto('/register');

	await page.getByLabelText('Email').fill('user@example.com');
	await page.getByLabelText('Password').fill('secure123');
	await page.getByRole('button', { name: 'Register' }).click();

	// Tests the complete client-server integration
	await expect(page.getByText('Welcome!')).toBeVisible();
});
```

## Why E2E Matters

- Catches client-server contract mismatches that unit tests miss
- Validates real form submissions with actual FormData
- Tests complete user workflows
- Provides confidence in production deployments

---

_This document will be expanded with comprehensive E2E patterns,
configuration, and best practices._
