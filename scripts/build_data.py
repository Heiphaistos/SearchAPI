#!/usr/bin/env python3
"""Build the SearchAPI database.

Sources:
  1. https://github.com/public-apis/public-apis (MIT) - free / public APIs.
  2. data/paid-apis.json  - curated list of paid & freemium APIs.
  3. data/extra-apis.json - community additions (any pricing).

Output:
  data/apis.json - the full, normalised database (also served as the public JSON API of the site)
  data/apis.js   - same data as a JS global so the site works without a server (file://)
"""
from __future__ import annotations

import json
import re
import sys
import unicodedata
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
PUBLIC_APIS_URL = "https://raw.githubusercontent.com/public-apis/public-apis/master/README.md"

ROW_RE = re.compile(r"^\|\s*\[(?P<name>[^\]]+)\]\((?P<url>[^)\s]+)\)\s*\|(?P<rest>.*)$")
SECTION_RE = re.compile(r"^###\s+(?P<name>.+?)\s*$")

AUTH_MAP = {
    "no": "none",
    "": "none",
    "apikey": "apiKey",
    "oauth": "OAuth",
    "x-mashape-key": "X-Mashape-Key",
    "user-agent": "User-Agent",
}


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return value or "api"


def clean(cell: str) -> str:
    cell = "".join(ch for ch in cell if ch.isprintable())
    return cell.strip().strip("`").strip().strip("\\").strip()


def norm_auth(cell: str) -> str:
    key = re.sub(r"[^a-z-]", "", clean(cell).lower())
    if key.endswith("pikey"):
        key = "apikey"
    return AUTH_MAP.get(key, clean(cell) or "none")


def norm_yes_no(cell: str) -> str:
    key = clean(cell).lower()
    if key == "yes":
        return "yes"
    if key == "no":
        return "no"
    return "unknown"


def fetch_public_apis(path: Path | None) -> str:
    if path and path.exists():
        return path.read_text(encoding="utf-8")
    req = urllib.request.Request(PUBLIC_APIS_URL, headers={"User-Agent": "SearchAPI-builder"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8")


def parse_public_apis(markdown: str) -> list[dict]:
    """Parse the category tables of the public-apis README (after the Index)."""
    apis: list[dict] = []
    in_index = False
    category = None
    for raw in markdown.splitlines():
        line = raw.rstrip()
        if line.startswith("## Index"):
            in_index = True
            continue
        if not in_index:
            continue
        if line.startswith("## "):
            # License / other top level section: stop.
            category = None
            continue
        section = SECTION_RE.match(line)
        if section:
            category = section.group("name").strip()
            continue
        if category is None:
            continue
        row = ROW_RE.match(line)
        if not row:
            continue
        cells = [c for c in row.group("rest").split("|")]
        # Expect: description | auth | https | cors (| trailing empties)
        if len(cells) < 4:
            continue
        description, auth, https, cors = (clean(c) for c in cells[:4])
        name = row.group("name").strip()
        url = row.group("url").strip()
        apis.append(
            {
                "name": name,
                "description": description,
                "url": url,
                "category": category,
                "auth": norm_auth(auth),
                "https": norm_yes_no(https) == "yes",
                "cors": norm_yes_no(cors),
                "pricing": "free",
                "pricing_model": "Free",
                "tags": [],
                "source": "public-apis",
            }
        )
    return apis


def load_json_list(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open(encoding="utf-8") as fh:
        data = json.load(fh)
    if not isinstance(data, list):
        raise SystemExit(f"{path} must contain a JSON array")
    return data


def normalise(entry: dict, default_source: str) -> dict:
    pricing = entry.get("pricing", "free")
    if pricing not in {"free", "freemium", "paid"}:
        raise SystemExit(f"Invalid pricing '{pricing}' for {entry.get('name')}")
    cors = entry.get("cors", "unknown")
    if isinstance(cors, bool):
        cors = "yes" if cors else "no"
    return {
        "name": entry["name"].strip(),
        "description": entry.get("description", "").strip(),
        "url": entry["url"].strip(),
        "category": entry.get("category", "Other").strip(),
        "auth": entry.get("auth", "apiKey") or "none",
        "https": bool(entry.get("https", True)),
        "cors": cors if cors in {"yes", "no", "unknown"} else "unknown",
        "pricing": pricing,
        "pricing_model": entry.get("pricing_model", {"free": "Free", "freemium": "Free tier + paid plans", "paid": "Paid"}[pricing]),
        "tags": [t.strip() for t in entry.get("tags", []) if t.strip()],
        "source": entry.get("source", default_source),
    }


def dedupe(apis: list[dict]) -> list[dict]:
    """Later entries (curated) win over earlier ones (public-apis) when the URL host + name match."""
    seen: dict[str, int] = {}
    result: list[dict] = []
    for api in apis:
        key = (slugify(api["name"]), re.sub(r"^https?://(www\.)?", "", api["url"]).split("/")[0].lower())
        k = "|".join(key)
        if k in seen:
            result[seen[k]] = api
        else:
            seen[k] = len(result)
            result.append(api)
    return result


def assign_ids(apis: list[dict]) -> None:
    used: set[str] = set()
    for api in apis:
        base = slugify(api["name"])
        candidate = base
        n = 2
        while candidate in used:
            candidate = f"{base}-{n}"
            n += 1
        used.add(candidate)
        api["id"] = candidate


def main(argv: list[str]) -> int:
    local_readme = Path(argv[1]) if len(argv) > 1 else None
    try:
        markdown = fetch_public_apis(local_readme)
    except Exception as exc:  # noqa: BLE001
        print(f"Could not fetch public-apis README: {exc}", file=sys.stderr)
        return 1

    free = parse_public_apis(markdown)
    print(f"public-apis: {len(free)} APIs")

    paid = [normalise(e, "curated") for e in load_json_list(DATA / "paid-apis.json")]
    extra = [normalise(e, "community") for e in load_json_list(DATA / "extra-apis.json")]
    print(f"paid/freemium (curated): {len(paid)} APIs")
    print(f"community extras: {len(extra)} APIs")

    apis = dedupe(free + extra + paid)
    apis.sort(key=lambda a: (a["category"].lower(), a["name"].lower()))
    assign_ids(apis)

    categories = sorted({a["category"] for a in apis}, key=str.lower)
    payload = {
        "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "count": len(apis),
        "counts": {
            "free": sum(a["pricing"] == "free" for a in apis),
            "freemium": sum(a["pricing"] == "freemium" for a in apis),
            "paid": sum(a["pricing"] == "paid" for a in apis),
        },
        "categories": categories,
        "sources": [
            {"name": "public-apis/public-apis", "url": "https://github.com/public-apis/public-apis", "license": "MIT"},
            {"name": "SearchAPI curated list", "url": "https://github.com/Heiphaistos/SearchAPI", "license": "MIT"},
        ],
        "apis": apis,
    }

    DATA.mkdir(exist_ok=True)
    (DATA / "apis.json").write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    (DATA / "apis.js").write_text(
        "// Generated by scripts/build_data.py - do not edit by hand.\n"
        "window.SEARCHAPI_DATA = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"total: {len(apis)} APIs in {len(categories)} categories -> data/apis.json, data/apis.js")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
