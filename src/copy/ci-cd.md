# CI/CD

## Production-Ready Testing Pipelines

This project demonstrates sophisticated CI/CD patterns for Svelte
testing with **vitest-browser-svelte** and Playwright, supporting the
**Client-Server Alignment Strategy** in automated environments.

## Overview

The CI/CD setup uses:

- **Playwright containers** for consistent browser environments
- **Separate workflows** for unit tests and E2E tests
- **Automatic version synchronization** between dependencies and
  containers
- **Optimized caching** for fast pipeline execution
- **Coverage reporting** for unit tests

## Workflow Architecture

### Unit Tests Workflow (`unit-tests.yaml`)

```yaml
name: CI/CD
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    name: Unit Tests & Coverage
    runs-on: ubuntu-24.04
    container:
      image: mcr.microsoft.com/playwright:v1.52.0-noble
      options: --user 1001
    timeout-minutes: 10
```

**Key Features:**

- Runs vitest-browser-svelte tests in Playwright container
- Generates coverage reports
- Fast execution with 10-minute timeout
- Proper user permissions with `--user 1001`

### E2E Tests Workflow (`e2e.yaml`)

```yaml
name: E2E Tests
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  e2e:
    name: End-to-End Tests
    runs-on: ubuntu-24.04
    container:
      image: mcr.microsoft.com/playwright:v1.52.0-noble
      options: --user 1001
    timeout-minutes: 15
```

**Key Features:**

- Validates complete Client-Server integration
- Longer timeout for full user journeys
- Same container for consistency with unit tests

## Playwright Container Strategy

### Why Containers?

Using Playwright containers ensures:

- **Consistent browser environments** across local dev and CI
- **Pre-installed browser dependencies** (no installation time)
- **Reproducible test results** regardless of runner environment
- **Faster pipeline execution** with cached browser binaries

### Version Synchronization

Both workflows include automatic version verification:

```bash
# Extract Playwright version from package.json
PACKAGE_VERSION=$(node -p "require('./package.json').devDependencies.playwright.replace(/[\^~]/, '')")

# Extract version from container image
CONTAINER_VERSION=$(grep -o 'playwright:v[0-9.]*' .github/workflows/unit-tests.yaml | sed 's/playwright:v//')

if [ "$PACKAGE_VERSION" != "$CONTAINER_VERSION" ]; then
  echo "❌ ERROR: Playwright versions don't match!"
  exit 1
fi
```

This prevents version mismatches that could cause test failures.

## Caching Strategy

### pnpm Store Caching

```yaml
- name: Get pnpm store directory
  shell: bash
  run: |
    echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

- name: Setup pnpm cache
  uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key:
      ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml')
      }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-
```

**Benefits:**

- Faster dependency installation
- Reduced bandwidth usage
- Consistent package versions

## Concurrency Controls

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**Purpose:**

- Cancels redundant runs on new pushes
- Saves CI resources
- Faster feedback on latest changes

## Environment Configuration

### Environment Variables and Secrets

```yaml
env:
  API_SECRET: ${{ secrets.API_SECRET }}
```

**Note**: The `API_SECRET` is specific to this project's requirements.
Your project may not need secrets, or may need different ones.

**When you MUST configure secrets in CI:**

- **Build-time environment variables** - Build will fail without them
- **Server-side API testing** with authentication
- **E2E tests** that require login flows
- **External service integrations** (databases, APIs)

**⚠️ Critical**: If your project requires environment variables to
build (like `API_SECRET` in this project), you MUST configure them in
GitHub Secrets or your CI build will fail.

**When you DON'T need secrets:**

- Simple component testing only
- Static sites without build-time environment dependencies
- Public demo applications with no external services
- Projects that use only public APIs or mock data

**This project uses `API_SECRET` for:**

- Server-side API testing
- Authentication flows in E2E tests
- Production-like environment simulation

### Build Process

```yaml
- name: Build application
  run: pnpm build
  env:
    API_SECRET: ${{ secrets.API_SECRET }}
```

Builds are tested in CI to catch:

- TypeScript compilation errors
- Build-time configuration issues
- Missing environment variables

## Test Execution Patterns

### Unit Tests with Coverage

```yaml
- name: Coverage
  run: pnpm test:unit --run --coverage
```

**Features:**

- Runs all vitest-browser-svelte tests
- Generates coverage reports
- Fails on coverage thresholds (if configured)

### E2E Test Execution

```yaml
- name: Run E2E tests
  run: pnpm test:e2e
  env:
    API_SECRET: ${{ secrets.API_SECRET }}
```

**Features:**

- Full application testing
- Real browser interactions
- Complete Client-Server validation

## Best Practices

### Container User Permissions

```yaml
container:
  image: mcr.microsoft.com/playwright:v1.52.0-noble
  options: --user 1001
```

**Why `--user 1001`?**

- Matches GitHub Actions runner user
- Prevents permission issues with file creation
- Ensures consistent behavior

### Timeout Management

- **Unit Tests**: 10 minutes (fast feedback)
- **E2E Tests**: 15 minutes (allows for full user journeys)

### Workflow Separation

**Benefits of separate workflows:**

- Independent failure isolation
- Different timeout requirements
- Parallel execution capability
- Clear responsibility separation

## Local Development Alignment

### Matching CI Environment Locally

```bash
# Run tests in same Playwright container locally
docker run --rm -it \
  -v $(pwd):/workspace \
  -w /workspace \
  mcr.microsoft.com/playwright:v1.52.0-noble \
  /bin/bash

# Inside container
npm install -g pnpm
pnpm install
pnpm test:unit --run
```

### Version Consistency

Keep these synchronized:

- `package.json` Playwright version
- Container image version in workflows
- Local Playwright installation

## Troubleshooting CI Issues

### Common Problems

**Playwright Version Mismatch:**

```
❌ ERROR: Playwright versions don't match!
```

**Solution:** Update either package.json or workflow container version

**Permission Errors:**

```
EACCES: permission denied
```

**Solution:** Ensure `--user 1001` is set in container options

**Test Timeouts:**

```
Test timeout of 10000ms exceeded
```

**Solution:** Increase workflow timeout or optimize slow tests

**Missing Environment Variables:**

```
❌ Error: Environment variable API_SECRET is not defined
❌ Build failed: Missing required environment variables
```

**Solution:** Configure required secrets in GitHub repository
settings:

1. Go to repository Settings → Secrets and variables → Actions
2. Add `API_SECRET` (or your required variables) to Repository secrets
3. Ensure workflow files reference the correct secret names

### Debugging Failed Tests

1. **Check workflow logs** for specific error messages
2. **Verify environment variables** are properly set
3. **Test locally** with same container image
4. **Check for flaky tests** with multiple runs

## Advanced Patterns

### Matrix Testing (Future Enhancement)

```yaml
strategy:
  matrix:
    browser: [chromium, firefox, webkit]
    node-version: [20, 22]
```

### Artifact Collection

```yaml
- name: Upload test results
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: test-results
    path: test-results/
```

### Parallel Test Execution

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: pnpm test:unit --shard=${{ matrix.shard }}/4
```

## Security Considerations

### Secret Management

- Use GitHub Secrets for sensitive data
- Never log secret values
- Rotate secrets regularly

### Container Security

- Use official Microsoft Playwright images
- Pin specific versions (avoid `latest`)
- Regular security updates

---

This CI/CD setup ensures your **Client-Server Alignment Strategy**
works reliably in production environments, catching integration issues
before they reach users.
