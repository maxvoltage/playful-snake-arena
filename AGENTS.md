    # Sync dependencies from lockfile
    uv sync

    # Add a new package
    uv add <PACKAGE-NAME>

    # Run Python files
    uv run python <PYTHON-FILE>

    #commit with suitable message. The message should be bullet point style, simple, and concise. Confirm the message with the user.
    git commit -m "<MESSAGE>"