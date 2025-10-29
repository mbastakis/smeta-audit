#!/bin/bash

# Local GitHub Actions Pipeline Testing Script
# Uses 'act' to run GitHub Actions workflows locally

set -e

echo "======================================================================"
echo "🧪 GitHub Actions Local Pipeline Test"
echo "======================================================================"
echo ""

# Check if act is installed
if ! command -v act &> /dev/null; then
    echo "❌ 'act' is not installed."
    echo ""
    echo "Please install 'act' first:"
    echo "  macOS:   brew install act"
    echo "  Windows: choco install act-cli"
    echo "  Linux:   See https://github.com/nektos/act#installation"
    echo ""
    exit 1
fi

echo "✓ 'act' is installed"
echo ""

# Display menu
echo "Select an option:"
echo "  1) List all workflows and jobs"
echo "  2) Dry-run macOS build job (validate only)"
echo "  3) Dry-run Windows build job (validate only)"
echo "  4) Run workflow syntax validation"
echo "  5) Show workflow graph"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo ""
        echo "📋 Available workflows and jobs:"
        echo "======================================================================"
        act -l
        ;;
    2)
        echo ""
        echo "🧪 Dry-run: macOS build job"
        echo "======================================================================"
        echo "Note: This validates the workflow but doesn't actually run it."
        echo "macOS builds cannot be fully tested locally (no macOS containers)."
        echo ""
        act -j build-macos -n
        ;;
    3)
        echo ""
        echo "🧪 Dry-run: Windows build job"
        echo "======================================================================"
        echo "Note: This validates the workflow but doesn't actually run it."
        echo "Windows builds have limited support in act."
        echo ""
        act -j build-windows -n
        ;;
    4)
        echo ""
        echo "✅ Validating workflow syntax..."
        echo "======================================================================"
        # Check if workflow file exists and is valid YAML
        if [ -f ".github/workflows/electron-build.yml" ]; then
            echo "✓ Workflow file exists"
            # Try to parse with act (will fail if invalid)
            if act -l > /dev/null 2>&1; then
                echo "✓ Workflow syntax is valid"
            else
                echo "❌ Workflow syntax validation failed"
                act -l
                exit 1
            fi
        else
            echo "❌ Workflow file not found: .github/workflows/electron-build.yml"
            exit 1
        fi
        ;;
    5)
        echo ""
        echo "📊 Workflow graph:"
        echo "======================================================================"
        act -g
        ;;
    *)
        echo ""
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "======================================================================"
echo "✅ Test complete!"
echo "======================================================================"
echo ""
echo "ℹ️  Important notes:"
echo "  - Platform-specific builds (macOS, Windows) cannot be fully tested locally"
echo "  - Use GitHub runners for actual build testing"
echo "  - act is primarily useful for workflow structure validation"
echo ""
