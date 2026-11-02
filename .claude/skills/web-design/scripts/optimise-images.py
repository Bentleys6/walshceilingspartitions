#!/usr/bin/env python3
"""
Prepare photos for a site: find duplicates, optionally crop black bars from phone screenshots,
and save each photo as WebP at 800px and (when the original is big enough) 1600px on the long edge.

Usage:
  python3 optimise-images.py <input-dir> --report
      List every image with its size and group near-duplicates (same photo uploaded twice).
  python3 optimise-images.py <input-dir> <output-dir> <mapping.json>
      mapping.json: {"01-hero-kitchen": {"file": "abc.jpg", "crop": [0, 307, 739, 1293]}, ...}
      ("crop" is optional: left, top, right, bottom in pixels.)
  python3 optimise-images.py --find-bars <image>
      Print the row range that holds the actual photo inside a phone screenshot with black bars.

Needs Pillow and numpy.
"""
import json, os, sys
from PIL import Image
import numpy as np

def ahash(path):
    im = Image.open(path).convert("L").resize((16, 16))
    px = np.asarray(im, dtype=float).flatten()
    return px > px.mean()

def report(src):
    files = sorted(f for f in os.listdir(src) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")))
    hashes, groups = {}, []
    for f in files:
        p = os.path.join(src, f)
        try:
            im = Image.open(p)
        except Exception as e:
            print(f"{f}: unreadable ({e})"); continue
        print(f"{f[:40]:40} {im.size[0]}x{im.size[1]} {im.mode} {os.path.getsize(p)//1024}KB")
        hashes[f] = ahash(p)
        for g in groups:
            if (hashes[f] != hashes[g[0]]).sum() < 20:
                g.append(f); break
        else:
            groups.append([f])
    print("\nDuplicate groups (same photo, keep one):")
    for g in groups:
        if len(g) > 1: print("  " + ", ".join(g))
    print(f"\n{len(groups)} unique photos out of {len(files)} files")

def find_bars(path):
    a = np.asarray(Image.open(path).convert("L"), dtype=float)
    busy = a.std(axis=1) > 8
    runs, start = [], None
    for i, v in enumerate(busy):
        if v and start is None: start = i
        if not v and start is not None: runs.append((start, i)); start = None
    if start is not None: runs.append((start, len(busy)))
    # Join runs split by a few plain rows (a flat ceiling or wall inside the photo).
    merged = []
    for r in runs:
        if merged and r[0] - merged[-1][1] <= 12: merged[-1] = (merged[-1][0], r[1])
        else: merged.append(r)
    top = max(merged, key=lambda r: r[1] - r[0])
    print(f"Photo rows: {top[0]}-{top[1]} (crop: [0, {top[0]}, {a.shape[1]}, {top[1]}])")

def convert(src, dst, mapping_file):
    os.makedirs(dst, exist_ok=True)
    mapping = json.load(open(mapping_file))
    for name, spec in mapping.items():
        im = Image.open(os.path.join(src, spec["file"])).convert("RGB")
        if spec.get("crop"): im = im.crop(tuple(spec["crop"]))
        sizes = [800] + ([1600] if max(im.size) >= 1440 else [])
        made = []
        for s in sizes:
            r = im.copy(); r.thumbnail((s, s), Image.LANCZOS)
            out = os.path.join(dst, f"{name}-{s}.webp")
            r.save(out, "WEBP", quality=78, method=6)
            made.append(f"{s}: {os.path.getsize(out)//1024}KB")
        print(f"{name:40} {im.size[0]}x{im.size[1]}  " + ", ".join(made))

if __name__ == "__main__":
    a = sys.argv[1:]
    if len(a) == 2 and a[1] == "--report": report(a[0])
    elif len(a) == 2 and a[0] == "--find-bars": find_bars(a[1])
    elif len(a) == 3: convert(*a)
    else: print(__doc__); sys.exit(1)
