# CI/CD Pipeline Documentation

## Overview

This document describes the GitHub Actions CI/CD pipeline for building and distributing the SMETA Compliance Platform Electron application.

The pipeline automatically builds distributable packages for macOS (.dmg) and Windows (.exe) platforms, uploads them as artifacts, and creates GitHub releases when version tags are pushed.

## Pipeline Architecture

### Workflow File

**Location**: `.github/workflows/electron-build.yml`

### Jobs

The pipeline consists of three main jobs:

1. **build-macos** - Builds macOS distributable (.dmg and .zip)
2. **build-windows** - Builds Windows installers (NSIS and portable .exe)
3. **release** - Creates GitHub releases with artifacts (triggered only on version tags)

### Build Matrix

| Platform | Runner | Outputs |
|----------|--------|---------|
| macOS | `macos-latest` | `.dmg`, `.zip` (x64 + arm64) |
| Windows | `windows-latest` | `Setup.exe` (NSIS), `Portable.exe` |

## Trigger Conditions

The pipeline triggers on:

### 1. Push to Main Branch
```bash
git push origin main
```
- Builds artifacts for both platforms
- Uploads artifacts (retained for 30 days)
- Does NOT create a release

### 2. Pull Request to Main
```bash
# Automatically triggered when PR is created/updated
```
- Validates that builds complete successfully
- Does NOT upload artifacts
- Ensures code quality before merge

### 3. Manual Workflow Dispatch
- Navigate to Actions tab in GitHub
- Select "Build Electron App" workflow
- Click "Run workflow"
- Useful for testing or ad-hoc builds

### 4. Version Tags
```bash
git tag v1.0.0
git push origin v1.0.0
```
- Builds artifacts for both platforms
- Uploads artifacts
- **Creates GitHub Release** with attached binaries

## Local Testing with `act`

### Installation

**macOS:**
```bash
brew install act
```

**Windows:**
```bash
choco install act-cli
```

**Linux:**
```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### Using the Test Script

We provide a convenient test script for local pipeline validation:

```bash
./test-pipeline-local.sh
```

**Menu Options:**
1. List all workflows and jobs
2. Dry-run macOS build job (validate only)
3. Dry-run Windows build job (validate only)
4. Run workflow syntax validation
5. Show workflow graph

### Manual Testing

**List workflows:**
```bash
act -l
```

**Validate workflow syntax:**
```bash
act -n
```

**Dry-run specific job:**
```bash
act -j build-macos -n
act -j build-windows -n
```

**Run full workflow (Linux only):**
```bash
act push
```

### Important Limitations

⚠️ **Platform-specific builds cannot be fully executed locally:**
- **macOS builds**: Require actual macOS runners (no macOS containers exist)
- **Windows builds**: Limited support in Docker containers
- **Recommendation**: Use `act` for syntax validation only; rely on GitHub runners for actual builds

## Release Process

### Creating a Release

1. **Update version in package.json:**
```bash
npm version patch  # or minor, major
# This creates a git commit and tag
```

2. **Push tag to GitHub:**
```bash
git push origin v1.0.0
```

3. **Monitor pipeline:**
- Go to Actions tab in GitHub
- Watch the build progress
- Verify both macOS and Windows jobs succeed

4. **Verify release:**
- Go to Releases tab
- New release should be created automatically
- Download and test artifacts

### Versioning Strategy

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (1.x.x): Breaking changes
- **MINOR** version (x.1.x): New features, backwards compatible
- **PATCH** version (x.x.1): Bug fixes

### Release Artifacts

Each release includes:
- **macOS DMG**: `SMETA-Compliance-Platform-{version}.dmg`
- **Windows NSIS Installer**: `SMETA-Compliance-Platform-Setup-{version}.exe`
- **Windows Portable**: `SMETA-Compliance-Platform-{version}-Portable.exe`

## Build Process Details

### Build Steps

1. **Checkout code** - Clone repository
2. **Setup Node.js 18.x** - Install Node.js runtime
3. **Install dependencies**:
   ```bash
   npm ci                        # Root dependencies
   npm ci --workspace=frontend   # Frontend dependencies
   npm ci --workspace=backend    # Backend dependencies
   ```
4. **Build frontend** - Compile React app to `frontend/dist/`
5. **Build backend** - Compile TypeScript to `backend/dist/`
6. **Package with electron-builder**:
   - Bundles frontend/backend artifacts
   - Creates platform-specific installers
   - Signs and notarizes (if credentials provided)

### Output Directory

Built artifacts are stored in: `dist-electron/`

**Files created:**
```
dist-electron/
├── SMETA-Compliance-Platform-{version}.dmg
├── SMETA-Compliance-Platform-{version}-mac.zip
├── SMETA-Compliance-Platform-Setup-{version}.exe
└── SMETA-Compliance-Platform-{version}-Portable.exe
```

## Security

### Action Pinning

All GitHub Actions are pinned to specific commit SHAs for security:

```yaml
uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
```

This prevents supply chain attacks from compromised action updates.

### Permissions

The workflow uses minimal required permissions:
- **Default**: `contents: read` (read-only access)
- **Release job**: `contents: write` (only for creating releases)

### Secrets

The workflow uses only the built-in `GITHUB_TOKEN`:
- Automatically provided by GitHub
- Scoped to the repository
- Expires after job completion

**No custom secrets are required.**

## Troubleshooting

### Build Fails: "Cannot find module"

**Cause**: Dependencies not installed correctly

**Solution**:
```bash
# Ensure all workspaces install dependencies
npm ci
npm ci --workspace=frontend
npm ci --workspace=backend
```

### Build Fails: "Frontend/Backend dist not found"

**Cause**: Build step failed before electron-builder

**Solution**:
- Check frontend build logs: `npm run build:frontend`
- Check backend build logs: `npm run build:backend`
- Verify TypeScript compilation succeeds

### Artifact Upload Fails

**Cause**: File patterns don't match built files

**Solution**:
- Check `dist-electron/` directory contents
- Verify file naming matches glob patterns
- Update workflow if filename format changed

### Release Not Created

**Cause**: Tag doesn't match `v*` pattern

**Solution**:
- Ensure tag starts with `v`: `v1.0.0` ✅, `1.0.0` ❌
- Push tag: `git push origin v1.0.0`

### macOS DMG Not Signed

**Cause**: Code signing certificates not configured

**Solution** (optional):
- Add `APPLE_ID`, `APPLE_ID_PASSWORD`, `CSC_LINK`, `CSC_KEY_PASSWORD` secrets
- Update workflow to include signing step
- See: [electron-builder code signing docs](https://www.electron.build/code-signing)

### Windows Build Slow

**Cause**: Windows runners are generally slower than Linux/macOS

**Solution**:
- This is expected behavior
- Typical Windows build: 10-15 minutes
- Consider caching `node_modules` if needed

## Performance Optimization

### Caching

The workflow uses Node.js caching:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

This caches `node_modules` between runs, speeding up builds by ~2-3 minutes.

### Parallel Jobs

macOS and Windows builds run in parallel, reducing total pipeline time from ~30min to ~15min.

## Monitoring

### View Workflow Runs

1. Go to repository on GitHub
2. Click **Actions** tab
3. Select workflow run to view details
4. Click on job name to see logs

### Workflow Status Badge

Add to README.md:
```markdown
![Build Status](https://github.com/{owner}/{repo}/actions/workflows/electron-build.yml/badge.svg)
```

### Notifications

GitHub sends email notifications for:
- Failed builds (on your branches/PRs)
- Completed builds (for watched repositories)

## Advanced Usage

### Building Specific Platforms Only

**Modify workflow to skip jobs:**
```yaml
# Add condition to job
build-windows:
  if: false  # Skip Windows builds
```

### Custom Build Configuration

**Override electron-builder config:**
```yaml
- name: Build Electron app
  run: npm run dist:mac
  env:
    ELECTRON_BUILDER_COMPRESSION_LEVEL: 9  # Max compression
```

### Draft Releases

**Create draft releases for review:**
```yaml
- uses: softprops/action-gh-release@v2
  with:
    draft: true  # Change to true
```

## Support

For issues or questions:
1. Check GitHub Actions logs for detailed error messages
2. Review this documentation
3. Consult [electron-builder documentation](https://www.electron.build/)
4. Open an issue in the repository

---

**Last Updated**: October 29, 2025  
**Pipeline Version**: 1.0  
**Maintained By**: SMETA Compliance Team
