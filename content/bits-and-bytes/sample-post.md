---
title: Why I Always Lint My Shell Scripts
date: 2024-05-20
summary: ShellCheck found three bugs in a script I had been using in production for two years. Here is what I learned.
tags: [shell, tooling, lessons]
link: https://github.com/koalaman/shellcheck
linkLabel: View on GitHub
---

# Why I Always Lint My Shell Scripts

A short one this week.

I was cleaning up an old deployment pipeline and decided to run [ShellCheck](https://github.com/koalaman/shellcheck) on a script I had written two years ago and not touched since. The script ran fine. It had always run fine. I had no reason to suspect it.

ShellCheck found three bugs.

## The Bugs

**Bug 1: Unquoted variable in a path**

```bash
# Before
cp $SOURCE_DIR/config.yml /etc/app/

# After
cp "$SOURCE_DIR/config.yml" /etc/app/
```

If `SOURCE_DIR` ever contained a space, this would silently split and copy the wrong file. It never had. It never would have on my machine. It absolutely would have on the client's.

**Bug 2: `[ ]` vs `[[ ]]`**

```bash
# Before – POSIX test, no regex support
if [ "$ENVIRONMENT" =~ prod ]; then

# After
if [[ "$ENVIRONMENT" =~ prod ]]; then
```

The `=~` operator does not work in single brackets. The condition was always false. The safety check it was supposed to perform never ran. For two years.

**Bug 3: Failure ignored after pipe**

```bash
# Before
cat large-file.txt | grep "ERROR" | wc -l

# After – pipefail catches it
set -euo pipefail
cat large-file.txt | grep "ERROR" | wc -l
```

Without `pipefail`, if `cat` fails, the script keeps going. With a file this large being processed nightly, that was a ticking clock.

## What I Learned

> [!TIP]
> Run `shellcheck` on every script, even the ones that "work". Especially those.

The lesson is not that I write bad shell scripts. The lesson is that shell is ==a language where silence equals success==, and silence is not the same thing as correctness.

I added ShellCheck to the CI pipeline. It takes four seconds.

---

*Delete `content/bits-and-bytes/sample-post.md` when you publish your first real Bits & Bytes post.*

