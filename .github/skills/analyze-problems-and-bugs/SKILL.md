---
name: analyze-problems-and-bugs
description: "Use when debugging code, analyzing problems or bugs, tracing root causes, and implementing the smallest correct fix. Trigger words: analyze, bug, issue, root cause, troubleshoot, fix, solve."
argument-hint: "Describe the problem, symptoms, and desired outcome."
user-invocable: true
disable-model-invocation: false
---

# Analyze Problems and Fix Bugs

## When to Use
- A bug, regression, or unexpected behavior needs investigation.
- The root cause is unclear and must be traced from evidence.
- A safe, minimal, correct fix is needed instead of a surface-level patch.
- The task may require validation, tests, or follow-up cleanup.

## Workflow
1. Define the problem precisely.
   - Restate the observed behavior, expected behavior, and scope.
   - Identify the files, features, or inputs involved.

2. Gather evidence before changing code.
   - Inspect relevant source files, tests, logs, errors, and recent changes.
   - Reproduce the issue when possible.
   - Prefer direct evidence over assumptions.

3. Find the root cause.
   - Trace the code path end to end.
   - Separate symptoms from underlying causes.
   - If there are multiple causes, rank them by impact and likelihood.

4. Choose the best fix.
   - Prefer the smallest change that fully resolves the issue.
   - Preserve existing behavior unless the behavior is part of the bug.
   - Prefer correctness, maintainability, and testability over cleverness.
   - If the problem is ambiguous, stop and ask a focused question.

5. Implement the fix.
   - Edit only the files needed to solve the problem.
   - Keep the change consistent with the codebase style.
   - Add or update tests when behavior changes or regressions are possible.

6. Validate the result.
   - Run the most relevant tests, build steps, or targeted checks.
   - Confirm the original issue is fixed and no obvious regressions were introduced.
   - If validation fails, return to the root cause instead of layering more patches.

7. Report clearly.
   - Summarize the root cause, fix, and validation.
   - Call out any remaining risk, assumptions, or follow-up work.

## Decision Rules
- If the issue can be reproduced, reproduce it first.
- If the codebase already has a preferred pattern, follow that pattern.
- If two fixes are possible, choose the one with the lowest risk and clearest behavior.
- If a fix requires tradeoffs, state them explicitly.
- If the change is broad, break it into the smallest verifiable steps.

## Quality Bar
- The fix addresses the cause, not just the symptom.
- The behavior is explained in code, tests, or both.
- The solution is understandable to the next engineer reading the code.
- The final result can be verified without guessing.
