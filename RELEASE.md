# Launch Readiness Checklist

This repo is ready to ship when the following checks complete successfully:

1. **Install dependencies**
   ```bash
   pip install -e .[dev]
   ```
2. **Build the AgentKit bundle**
   ```bash
   agentkit build --config starter-pack/agentkit_config.json --output dist/agentkit-bundle --archive dist/agentkit-bundle.zip
   ```
   *Confirm the command creates both the directory and archive and that Git remains clean.*
3. **Run the automated test suite**
   ```bash
   pytest
   ```
4. **Smoke test the module entry point**
   ```bash
   python -m agentkit --help
   ```
   *Ensure the CLI help text renders without errors.*
5. **Version and tag**
   * Update `pyproject.toml` with the release version.
   * Commit the release and create an annotated tag, e.g. `git tag -a v1.0.0 -m "AgentKit bundle v1.0.0"`.
6. **Publish (optional)**
   * Build the distribution with `python -m build`.
   * Upload to your package index or internal registry.

When each step passes, the project is considered production-ready.
