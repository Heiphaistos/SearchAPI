#!/usr/bin/env python3
"""Validate the hand-maintained JSON lists (data/paid-apis.json, data/extra-apis.json)."""
import json
import re
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
FILES = ["paid-apis.json", "extra-apis.json"]
PRICING = {"free", "freemium", "paid"}
AUTH = {"none", "apiKey", "OAuth", "X-Mashape-Key", "User-Agent", "other"}


def main() -> int:
    errors = []
    for filename in FILES:
        path = DATA / filename
        if not path.exists():
            continue
        try:
            entries = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f"{filename}: invalid JSON ({exc})")
            continue
        if not isinstance(entries, list):
            errors.append(f"{filename}: must be a JSON array")
            continue
        seen = set()
        for i, e in enumerate(entries):
            where = f"{filename}[{i}]"
            for key in ("name", "url", "description", "category", "pricing"):
                if not isinstance(e.get(key), str) or not e[key].strip():
                    errors.append(f"{where}: missing '{key}'")
            if e.get("pricing") not in PRICING:
                errors.append(f"{where}: pricing must be one of {sorted(PRICING)}")
            if e.get("auth", "apiKey") not in AUTH:
                errors.append(f"{where}: auth must be one of {sorted(AUTH)}")
            if not re.match(r"^https?://", str(e.get("url", ""))):
                errors.append(f"{where}: url must start with http(s)://")
            if str(e.get("cors", "unknown")) not in {"yes", "no", "unknown", "True", "False"} and not isinstance(e.get("cors"), bool):
                errors.append(f"{where}: cors must be yes/no/unknown")
            key = (str(e.get("name", "")).lower(), str(e.get("url", "")).lower())
            if key in seen:
                errors.append(f"{where}: duplicate of {e.get('name')}")
            seen.add(key)
    for err in errors:
        print(err, file=sys.stderr)
    print("OK" if not errors else f"{len(errors)} error(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
