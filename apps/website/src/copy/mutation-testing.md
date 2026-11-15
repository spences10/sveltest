# Mutation Testing

Mutation testing asks whether your tests notice deliberate mistakes in
production code. It complements coverage: executing a line is not the
same as checking its behaviour.

[StrykerJS](https://stryker-mutator.io/docs/stryker-js/introduction/)
changes expressions in a temporary copy of the source and runs the
existing tests against each change, called a **mutant**. A failing
test kills the mutant; passing tests leave it alive. The original
source is not changed by this project's configuration.

The goal here is better testing examples, not a perfect score. A test
can catch mutations while enforcing a requirement nobody wanted.
Review the intended behaviour as well as the report.

## Run the Example

From the repository root, after installing dependencies:

```bash
pnpm --filter @sveltest/website test:server --run src/lib/utils/validation.test.ts
pnpm --filter @sveltest/website test:mutation
```

Open `apps/website/reports/mutation/mutation.html`. The adjacent
`mutation.json` contains the machine-readable results. Both reports
and the `.stryker-tmp` sandboxes are gitignored.

This example mutates only `apps/website/src/lib/utils/validation.ts`
and runs its colocated `validation.test.ts`. It does not measure
browser component tests, Svelte markup, or the whole application's
test quality.

The snippets below are independent examples for that test file, next
to `validation.ts`, using Vite+'s Vitest runner. The improved cases
already exist in the repository; do not add duplicate copies.

## Example 1: Catch a Real Surviving Mutation

The email validator's regular expression ends with `$`, requiring the
match to reach the end of the input. Stryker removed that anchor. The
existing tests still passed: they checked malformed addresses, but
none checked a valid address followed by invalid trailing text.

This test alone misses that mistake:

```typescript
import { expect, it } from 'vite-plus/test';
import { validate_email } from './validation';

it('rejects a malformed address', () => {
	expect(validate_email('invalid-email').is_valid).toBe(false);
});
```

The improvement checks a distinct behaviour, not another arbitrary
email example:

```typescript
import { expect, it } from 'vite-plus/test';
import { validate_email } from './validation';

it('rejects trailing garbage after an otherwise valid address', () => {
	expect(validate_email('user@example.com!')).toEqual({
		is_valid: false,
		error_message: 'Invalid email format',
	});
});
```

Without the end anchor, `user@example.com!` is accepted. With it, the
input is rejected. The new assertion kills that specific mutant. The
executable suite includes this case in its named email table,
alongside the existing valid and invalid cases.

## Example 2: Check the Boundary, Not Just a Short Value

Mutation testing also prompts questions that its generated mutations
might not answer. Our old minimum-length test used `Short1`, which has
six characters. That test would still pass if the minimum accidentally
changed from eight to seven.

Check both sides of the boundary, while satisfying the other password
rules so they cannot cause an unrelated failure:

```typescript
import { expect, it } from 'vite-plus/test';
import { validate_password } from './validation';

it.each([
	{
		value: 'Abcdef1',
		is_valid: false,
		error_message: 'Password must be at least 8 characters',
	},
	{
		value: 'Abcdefg1',
		is_valid: true,
		error_message: '',
	},
])(
	'checks the length boundary for $value',
	({ value, is_valid, error_message }) => {
		expect(validate_password(value)).toEqual({
			is_valid,
			error_message,
		});
	},
);
```

Stryker did **not** generate an eight-to-seven length mutation in this
run. This improvement came from reviewing the test's claim, not from
pretending the report covered every possible bug.

These are the demo's configured password rules, not proof that a
password is secure or a recommendation for an authentication policy.
That is why the success test says it accepts passwords meeting the
configured rules rather than calling them "strong passwords".

## Example 3: Test Debounce Timing from the Last Call

Calling a debounced function three times immediately checks that
previous callbacks are cancelled. It does not establish whether the
waiting period restarts after a later call.

Space the calls apart and check just before and at the final deadline:

```typescript
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vite-plus/test';
import { debounce } from './validation';

describe('debounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('resets the waiting period after the last call', () => {
		const callback = vi.fn();
		const debounced = debounce(callback, 100);

		debounced('first'); // t = 0
		vi.advanceTimersByTime(50);
		debounced('second'); // t = 50
		vi.advanceTimersByTime(50);
		debounced('third'); // t = 100

		vi.advanceTimersByTime(99); // t = 199
		expect(callback).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1); // t = 200
		expect(callback).toHaveBeenCalledExactlyOnceWith('third');
	});
});
```

The earlier cancellation test already killed Stryker's removal of
`clearTimeout`. The rewrite preserves that protection and checks an
additional timing requirement. A useful improvement need not change
the mutation score.

See the executable
[validation tests](https://github.com/spences10/sveltest/blob/main/apps/website/src/lib/utils/validation.test.ts)
for these cases and the parameterised delay checks.

## Interpret the Remaining Results

The pilot caught **38 of 41** mutants before the test review and **39
of 41** afterward. Both reliable runs had no timeouts or mutation
errors. These are observations from this example, not a target for
other projects or a promise that future versions generate 41 mutants.

| Result           | What to investigate                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Killed           | A test noticed the change. Check whether the assertion protects intended behaviour.                               |
| Survived         | Tests passed with the change. Look for a missing case, equivalent behaviour, or an instrumentation problem.       |
| No coverage      | The mutated expression was not executed. Ask whether it represents a supported scenario or unused defensive code. |
| Timeout or error | Inspect the diagnostic before treating it as evidence about assertion quality.                                    |

Two results remained after the review:

- Removing `?.` from `result.issues[0]?.message` survived. Valibot's
  failed parse result guarantees a nonempty issues array, so this
  mutation is equivalent for results that follow that contract. Do not
  mock an impossible empty failure array just to kill it.
- The fallback string `'Invalid input'` was not covered. Decide
  whether schemas with an empty error message are a supported use case
  before adding a test or removing the fallback.

### Decide Which Tests Earn Their Place

Use the report alongside callers, documentation, and history:

- **Keep** checks that protect useful behaviour. The email
  compatibility cases were added deliberately during the
  Zod-to-Valibot migration; their unusual inputs were not a reason to
  delete them.
- **Rewrite** tests that claim more than they check, such as the old
  length and debounce examples above.
- **Remove** empty placeholders and unnecessary repetition. We removed
  15 empty skipped tests describing speculative features, plus
  currency cases that mainly retested `Intl.NumberFormat`.
  Default-currency and currency-override checks remain because they
  verify choices made by our wrapper.

A test with no unique kills is not automatically redundant. Generated
mutants represent only some possible defects. Likewise, every active
test catching a mutant does not prove every expectation is justified.

## How This Project Integrates Stryker

`apps/website/stryker.config.json` selects the production file and the
Vitest runner. `apps/website/vite-mutation.config.ts` reuses the Vite+
configuration and selects the existing Node test file. It does not
introduce a separate version of Vitest.

Two settings help with this review:

- `coverageAnalysis: 'perTest'` lets Stryker select tests that cover a
  mutation. This is mutation coverage analysis, not the normal V8
  coverage report.
- `disableBail: true` records all failing tests selected for a mutant
  rather than crediting only the first failure. This improves the
  report for review but can take longer.

With **Stryker 10.1.1**, using its `testFiles` option in this pilot
caused module-level schema mutations to activate too late. All 22
static mutants falsely survived. Selecting the test through the Vite+
config fixed those results. That discarded run was a tooling problem,
not evidence that the tests were ineffective. Recheck the workaround
when upgrading Stryker rather than treating it as a universal rule.

Consult the official
[Vitest runner documentation](https://stryker-mutator.io/docs/stryker-js/vitest-runner/)
and
[configuration reference](https://stryker-mutator.io/docs/stryker-js/configuration/)
for the available options. This project's narrow target and reporting
choices are optional conventions, not Svelte framework defaults.

## Run in CI

The
[mutation testing workflow](https://github.com/spences10/sveltest/blob/main/.github/workflows/mutation-testing.yaml)
runs the same command on pull requests and pushes to `main`, and can
also be started from GitHub Actions using **Run workflow**. It runs
only the Node example, so no Playwright browser installation or
application credentials are needed.

In a completed workflow run, download the **mutation-report**
artifact, unzip it, and open `mutation.html`. `mutation.json` is
included for programmatic inspection. Upload is attempted even if the
mutation step fails, when a report may still be available.

The score is informational: `thresholds.break` is `0`. A surviving
mutant does not fail CI, but a failing baseline test, a tool failure,
or a missing report does. Review the report instead of equating a
green job with perfect tests. The separate
[unit and E2E workflows](./ci-cd) continue to run normally.
