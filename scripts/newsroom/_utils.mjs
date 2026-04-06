export function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index];

    if (!entry.startsWith("--")) {
      continue;
    }

    const key = entry.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      args[key] = "true";
      continue;
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

export function ensure(value, message) {
  if (!value) {
    throw new Error(message);
  }

  return value;
}

export function boolArg(value) {
  return String(value).toLowerCase() === "true";
}

export function printIssues(issues) {
  for (const issue of issues) {
    console.log(`${issue.severity.toUpperCase()}: ${issue.path} - ${issue.message}`);
  }
}

export function formatList(values) {
  return values.length > 0 ? values.join(", ") : "none";
}
