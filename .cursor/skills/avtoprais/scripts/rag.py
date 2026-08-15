#!/usr/bin/env python3
"""Простой поиск по базе обучения АвтоПрайс. Запуск: python3 rag.py запрос"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
FILES = [ROOT / "SKILL.md", ROOT / "reference.md", *sorted((ROOT / "knowledge").glob("*.txt"))]


def chunks(text: str, size: int = 900, overlap: int = 120):
    text = re.sub(r"\s+", " ", text).strip()
    i, n = 0, len(text)
    while i < n:
        yield text[i : i + size]
        i += size - overlap


def score(query: str, text: str) -> float:
    q = [w for w in re.findall(r"[а-яёa-z0-9]{3,}", query.lower())]
    t = text.lower()
    if not q:
        return 0.0
    return sum(t.count(w) for w in q) / len(q)


def search(query: str, k: int = 6):
    hits = []
    for path in FILES:
        if not path.exists():
            continue
        raw = path.read_text(encoding="utf-8", errors="ignore")
        for ch in chunks(raw):
            s = score(query, ch)
            if s > 0:
                hits.append((s, path.name, ch))
    hits.sort(key=lambda x: x[0], reverse=True)
    seen, out = set(), []
    for s, name, ch in hits:
        key = (name, ch[:80])
        if key in seen:
            continue
        seen.add(key)
        out.append((s, name, ch))
        if len(out) >= k:
            break
    return out


if __name__ == "__main__":
    q = " ".join(sys.argv[1:]).strip() or "срочный выкуп цена"
    for s, name, ch in search(q):
        print(f"\n=== {name} ({s:.1f}) ===\n{ch}")
