#!/usr/bin/env node
/**
 * Dotani changelog — tracks meaningful project milestones with git checkpoints.
 *
 * Usage:
 *   node scripts/changelog.mjs sync              # Auto-update from new significant commits
 *   node scripts/changelog.mjs checkpoint "Title" # Manual milestone + git tag
 *   node scripts/changelog.mjs revert <id>        # Show how to roll back to a checkpoint
 *   node scripts/changelog.mjs list               # List all checkpoints
 *   node scripts/changelog.mjs install-hooks      # Enable auto-sync after commits
 *
 * Mark any commit as changelog-worthy:  git commit -m "feat: ... [changelog]"
 */

import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CHANGELOG_PATH = join(ROOT, 'CHANGELOG.md');
const MANIFEST_PATH = join(ROOT, 'changelog', 'manifest.json');
const HOOKS_DIR = join(ROOT, '.githooks');

const SIGNIFICANT_TYPES = new Set(['feat', 'refactor', 'breaking', 'perf', 'docs']);
const MINOR_TYPES = new Set(['fix', 'chore', 'style', 'test', 'ci', 'build']);
const MINOR_MESSAGE_RE =
  /^(fix|chore|style|test|ci|build)(\([^)]+\))?:\s*(typo|lint|format|whitespace|minor|bump|deps|wip|temp|spelling|comment)/i;
const CONVENTIONAL_RE = /^(\w+)(\([^)]+\))?!?:\s*(.+)$/;

const THRESHOLDS = {
  minFiles: 5,
  minLines: 80,
};

function run(cmd, opts = {}) {
  return execSync(cmd, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    ...opts,
  }).trim();
}

function runSafe(cmd) {
  try {
    return run(cmd);
  } catch {
    return '';
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

function parseConventional(message) {
  const firstLine = message.split('\n')[0].trim();
  const match = firstLine.match(CONVENTIONAL_RE);
  if (!match) return { type: null, scope: null, subject: firstLine, breaking: false };
  const [, type, scope, subject] = match;
  return {
    type: type.toLowerCase(),
    scope: scope?.slice(1, -1) ?? null,
    subject,
    breaking: firstLine.includes('!:') || /^BREAKING/i.test(message),
  };
}

function getCommitStats(hash) {
  const stat = runSafe(`git show --stat --format="" ${hash}`);
  const files = (stat.match(/(\d+) files? changed/) ?? [])[1];
  const insertions = (stat.match(/(\d+) insertions?\(\+\)/) ?? [])[1];
  const deletions = (stat.match(/(\d+) deletions?\(-\)/) ?? [])[1];
  return {
    filesChanged: Number(files ?? 0),
    linesChanged: Number(insertions ?? 0) + Number(deletions ?? 0),
  };
}

function isSignificantCommit(hash, message) {
  const firstLine = message.split('\n')[0].trim();

  if (/\[changelog\]|\[checkpoint\]/i.test(firstLine)) {
    return { significant: true, reason: 'explicit marker' };
  }

  const parsed = parseConventional(message);

  if (parsed.breaking) {
    return { significant: true, reason: 'breaking change' };
  }

  const stats = getCommitStats(hash);

  if (MINOR_MESSAGE_RE.test(firstLine) && stats.filesChanged < THRESHOLDS.minFiles) {
    return { significant: false, reason: 'minor maintenance' };
  }

  if (parsed.type && SIGNIFICANT_TYPES.has(parsed.type)) {
    return { significant: true, reason: parsed.type };
  }

  if (
    stats.filesChanged >= THRESHOLDS.minFiles ||
    stats.linesChanged >= THRESHOLDS.minLines
  ) {
    return { significant: true, reason: 'large diff' };
  }

  if (parsed.type && MINOR_TYPES.has(parsed.type)) {
    return { significant: false, reason: 'minor type' };
  }

  // Non-conventional milestone-style commits (stricter for deploy/infra tweaks)
  if (/^(implement|restructure|stabilize|save)\b/i.test(firstLine)) {
    return { significant: true, reason: 'milestone commit' };
  }

  if (/^add\b/i.test(firstLine)) {
    if (
      stats.filesChanged >= 3 ||
      stats.linesChanged >= 40 ||
      /\b(section|page|schema|feature|integration|pipeline|system)\b/i.test(firstLine)
    ) {
      return { significant: true, reason: 'milestone commit' };
    }
    return { significant: false, reason: 'small addition' };
  }

  if (/^(deploy|build|route|align|trigger)\b/i.test(firstLine)) {
    if (
      stats.filesChanged >= THRESHOLDS.minFiles ||
      stats.linesChanged >= THRESHOLDS.minLines
    ) {
      return { significant: true, reason: 'infra milestone' };
    }
    return { significant: false, reason: 'incremental infra tweak' };
  }

  if (/^fix\b/i.test(firstLine)) {
    if (
      stats.filesChanged >= THRESHOLDS.minFiles ||
      stats.linesChanged >= THRESHOLDS.minLines
    ) {
      return { significant: true, reason: 'significant fix' };
    }
    return { significant: false, reason: 'minor fix' };
  }

  return { significant: false, reason: 'below threshold' };
}

function categorizeEntry(parsed, message) {
  const firstLine = message.split('\n')[0].trim();
  if (parsed.breaking) return 'Changed';
  if (parsed.type === 'fix') return 'Fixed';
  if (parsed.type === 'perf') return 'Changed';
  if (parsed.type === 'docs') return 'Changed';
  if (/remove|delete/i.test(firstLine)) return 'Removed';
  if (/fix/i.test(firstLine)) return 'Fixed';
  return 'Added';
}

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    return { version: 1, lastProcessedCommit: null, entries: [] };
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
}

function saveManifest(manifest) {
  mkdirSync(dirname(MANIFEST_PATH), { recursive: true });
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
}

function getCommitsSince(sinceHash) {
  const range = sinceHash ? `${sinceHash}..HEAD` : 'HEAD';
  const log = runSafe(
    `git log --reverse --format=%H%x1f%s%x1f%ai ${range}`,
  );
  if (!log) return [];

  return log
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, subject, date] = line.split('\x1f');
      return { hash, subject, date: date.slice(0, 10) };
    });
}

function makeEntryId(date, subject) {
  return `${date}-${slugify(subject)}`;
}

function makeTag(id) {
  return `checkpoint/${id}`;
}

function buildEntry(commit, options = {}) {
  const { hash, subject, date } = commit;
  const parsed = parseConventional(subject);
  const stats = getCommitStats(hash);
  const id = options.id ?? makeEntryId(date, subject);
  const tag = options.tag ?? makeTag(id);

  return {
    id,
    date,
    commit: hash,
    shortCommit: hash.slice(0, 7),
    tag,
    title: options.title ?? parsed.subject ?? subject,
    category: options.category ?? categorizeEntry(parsed, subject),
    summary: options.summary ?? subject,
    filesChanged: stats.filesChanged,
    linesChanged: stats.linesChanged,
    reason: options.reason ?? 'checkpoint',
  };
}

function createGitTag(tag, hash, force = false) {
  const exists = runSafe(`git tag -l "${tag}"`);
  if (exists && !force) return false;
  if (exists && force) run(`git tag -f "${tag}" ${hash}`);
  else run(`git tag "${tag}" ${hash}`);
  return true;
}

function renderChangelog(manifest) {
  const lines = [
    '# Changelog',
    '',
    'All notable changes to the Dotani project are documented here.',
    '',
    'Each entry links to a **git checkpoint** you can restore to if something breaks.',
    'Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).',
    '',
    '## How to use',
    '',
    '- **Auto-updates** after significant commits (via git hook) or run `npm run changelog:sync`',
    '- **Manual milestone:** `npm run changelog:checkpoint -- "Your milestone title"`',
    '- **Roll back:** `npm run changelog:revert -- <checkpoint-id>` then follow the instructions',
    '- **Force any commit into the log:** add `[changelog]` to the commit message',
    '',
    '## [Unreleased]',
    '',
    '_Work in progress since the last checkpoint._',
    '',
  ];

  const sorted = [...manifest.entries].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.commit.localeCompare(a.commit);
  });

  for (const entry of sorted) {
    lines.push(`## [${entry.id}] — ${entry.date}`);
    lines.push('');
    lines.push(
      `> **Checkpoint:** \`${entry.tag}\` · **Commit:** \`${entry.shortCommit}\` · **Restore:** \`git checkout ${entry.tag}\``,
    );
    lines.push('');
    lines.push(`### ${entry.category}`);
    lines.push('');
    lines.push(`- ${entry.title}`);
    if (entry.summary !== entry.title) {
      lines.push(`  - _${entry.summary}_`);
    }
    lines.push(
      `  - ${entry.filesChanged} files, ${entry.linesChanged} lines changed`,
    );
    lines.push('');
  }

  return lines.join('\n');
}

function writeChangelog(manifest) {
  writeFileSync(CHANGELOG_PATH, renderChangelog(manifest) + '\n');
}

function sync({ quiet = false } = {}) {
  const manifest = loadManifest();
  const commits = getCommitsSince(manifest.lastProcessedCommit);
  const newEntries = [];

  for (const commit of commits) {
    const { significant, reason } = isSignificantCommit(commit.hash, commit.subject);
    if (!significant) continue;

    const entry = buildEntry(commit, { reason });
    if (manifest.entries.some((e) => e.commit === entry.commit)) continue;

    createGitTag(entry.tag, entry.commit);
    manifest.entries.push(entry);
    newEntries.push(entry);
  }

  if (commits.length > 0) {
    manifest.lastProcessedCommit = commits[commits.length - 1].hash;
  }

  if (newEntries.length > 0 || !existsSync(CHANGELOG_PATH)) {
    writeChangelog(manifest);
    saveManifest(manifest);
    if (!quiet) {
      console.log(`Changelog updated: ${newEntries.length} new entry(ies).`);
      for (const e of newEntries) {
        console.log(`  • [${e.id}] ${e.title} (${e.tag})`);
      }
    }
  } else if (!quiet) {
    console.log('No significant changes since last sync.');
  }

  return newEntries.length;
}

function checkpoint(title, { quiet = false } = {}) {
  const hash = run('git rev-parse HEAD');
  const date = new Date().toISOString().slice(0, 10);
  const id = makeEntryId(date, title);
  const tag = makeTag(id);

  const manifest = loadManifest();
  const entry = buildEntry(
    { hash, subject: title, date },
    { id, tag, title, category: 'Added', reason: 'manual checkpoint' },
  );

  if (manifest.entries.some((e) => e.id === id)) {
    console.error(`Checkpoint "${id}" already exists. Choose a different title.`);
    process.exit(1);
  }

  createGitTag(tag, hash, true);
  manifest.entries.push(entry);
  manifest.lastProcessedCommit = hash;
  writeChangelog(manifest);
  saveManifest(manifest);

  if (!quiet) {
    console.log(`Checkpoint created: [${id}]`);
    console.log(`  Tag:    ${tag}`);
    console.log(`  Commit: ${hash.slice(0, 7)}`);
    console.log(`  Restore: git checkout ${tag}`);
  }
}

function listEntries() {
  const manifest = loadManifest();
  if (manifest.entries.length === 0) {
    console.log('No checkpoints yet. Run: npm run changelog:sync');
    return;
  }

  console.log('Checkpoints (newest first):\n');
  const sorted = [...manifest.entries].sort((a, b) => b.date.localeCompare(a.date));
  for (const e of sorted) {
    console.log(`  ${e.id}`);
    console.log(`    ${e.title}`);
    console.log(`    ${e.tag} @ ${e.shortCommit} (${e.date})`);
    console.log('');
  }
}

function revertInfo(id) {
  const manifest = loadManifest();
  const entry = manifest.entries.find(
    (e) => e.id === id || e.tag === id || e.tag.endsWith(`/${id}`),
  );

  if (!entry) {
    console.error(`Checkpoint not found: "${id}"`);
    console.error('Run: npm run changelog:list');
    process.exit(1);
  }

  console.log(`\nRollback guide for: ${entry.title}`);
  console.log(`Checkpoint: ${entry.tag}`);
  console.log(`Commit:     ${entry.commit} (${entry.shortCommit})`);
  console.log(`Date:       ${entry.date}\n`);

  console.log('Option A — Inspect that state (detached HEAD, read-only):');
  console.log(`  git checkout ${entry.tag}\n`);

  console.log('Option B — Create a branch from that checkpoint:');
  console.log(`  git checkout -b restore/${entry.id} ${entry.tag}\n`);

  console.log('Option C — Revert everything after this checkpoint on current branch:');
  console.log(`  git revert --no-commit ${entry.commit}..HEAD`);
  console.log('  git commit -m "Revert to checkpoint: ' + entry.id + '"\n');

  console.log('Option D — Hard reset (destructive — loses uncommitted & later commits):');
  console.log(`  git reset --hard ${entry.tag}\n`);
}

function pushTags({ quiet = false } = {}) {
  const tags = runSafe('git tag -l "checkpoint/*"');
  if (!tags) {
    if (!quiet) console.log('No checkpoint tags to push.');
    return;
  }
  run('git push origin --tags');
  if (!quiet) console.log('Checkpoint tags pushed to origin.');
}

function installHooks() {
  mkdirSync(HOOKS_DIR, { recursive: true });

  const postCommit = `#!/bin/sh
# Auto-sync changelog for significant commits (installed by scripts/changelog.mjs)
node scripts/changelog.mjs sync --quiet
`;

  const commitMsg = `#!/bin/sh
# Remind about changelog markers for significant work (installed by scripts/changelog.mjs)
COMMIT_MSG_FILE="$1"
MSG=$(head -n1 "$COMMIT_MSG_FILE")

case "$MSG" in
  feat:*|refactor:*|breaking:*|perf:*|docs:*|*"[changelog]"*|*"[checkpoint]"*)
    exit 0
    ;;
  fix:*|chore:*|style:*|test:*)
    # Minor commits are fine — they won't auto-enter the changelog
    exit 0
    ;;
esac
`;

  writeFileSync(join(HOOKS_DIR, 'post-commit'), postCommit, { mode: 0o755 });
  writeFileSync(join(HOOKS_DIR, 'commit-msg'), commitMsg, { mode: 0o755 });

  run(`git config core.hooksPath .githooks`);

  console.log('Git hooks installed.');
  console.log('  .githooks/post-commit  → auto-syncs changelog after each commit');
  console.log('  .githooks/commit-msg  → conventional commit helper');
  console.log('');
  console.log('Tip: use [changelog] in a commit message to force an entry.');
}

function seedFromHistory() {
  const manifest = loadManifest();
  if (manifest.entries.length > 0) {
    console.log('Manifest already has entries. Skipping seed.');
    return;
  }

  const allCommits = getCommitsSince(null);
  for (const commit of allCommits) {
    const { significant } = isSignificantCommit(commit.hash, commit.subject);
    if (!significant) continue;

    const entry = buildEntry(commit);
    if (manifest.entries.some((e) => e.commit === entry.commit)) continue;
    createGitTag(entry.tag, entry.commit);
    manifest.entries.push(entry);
  }

  if (allCommits.length > 0) {
    manifest.lastProcessedCommit = allCommits[allCommits.length - 1].hash;
  }

  writeChangelog(manifest);
  saveManifest(manifest);
  console.log(`Seeded ${manifest.entries.length} checkpoint(s) from git history.`);
}

function printHelp() {
  console.log(`Dotani Changelog

Commands:
  sync              Update CHANGELOG.md from significant git commits
  checkpoint TITLE  Create a manual milestone + git tag
  revert ID         Show rollback instructions for a checkpoint
  list              List all checkpoints
  seed              Bootstrap changelog from full git history (first run)
  install-hooks     Enable automatic sync after every commit
  push-tags         Push checkpoint tags to origin (for cross-machine rollback)

Significant commits are detected when they:
  • Use feat/refactor/breaking/perf/docs conventional commits
  • Change ≥${THRESHOLDS.minFiles} files or ≥${THRESHOLDS.minLines} lines
  • Start with Add/Implement/Restructure/Stabilize/Deploy/Build/Save
  • Include [changelog] or [checkpoint] in the message

Minor fix/chore/style commits are skipped automatically.
`);
}

const [,, command, ...args] = process.argv;
const quiet = args.includes('--quiet');
const positional = args.filter((a) => a !== '--quiet');

switch (command) {
  case 'sync':
    sync({ quiet });
    break;
  case 'checkpoint': {
    const title = positional.join(' ').trim();
    if (!title) {
      console.error('Usage: npm run changelog:checkpoint -- "Milestone title"');
      process.exit(1);
    }
    checkpoint(title, { quiet });
    break;
  }
  case 'revert':
    if (!positional[0]) {
      console.error('Usage: npm run changelog:revert -- <checkpoint-id>');
      process.exit(1);
    }
    revertInfo(positional[0]);
    break;
  case 'list':
    listEntries();
    break;
  case 'seed':
    seedFromHistory();
    break;
  case 'install-hooks':
    installHooks();
    break;
  case 'push-tags':
    pushTags({ quiet });
    break;
  default:
    printHelp();
    if (command) process.exit(1);
}