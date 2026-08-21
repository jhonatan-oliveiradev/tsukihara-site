# Hero asset report

Measured on the PR runner with Pillow. Every new hero asset is RGBA with a real alpha channel.

| Asset | Width | Height | Ratio | Mode | Alpha | Bytes |
|---|---:|---:|---:|---|---|---:|
| `characters-after.png` | 1448 | 1086 | 1.3333 | RGBA | yes | 2847871 |
| `characters-before.png` | 1448 | 1086 | 1.3333 | RGBA | yes | 1889986 |
| `ground-after.png` | 1916 | 821 | 2.3337 | RGBA | yes | 1942292 |
| `ground-before.png` | 1916 | 821 | 2.3337 | RGBA | yes | 1897903 |
| `left-petals-after.png` | 1916 | 821 | 2.3337 | RGBA | yes | 1696729 |
| `left-petals-before.png` | 1916 | 821 | 2.3337 | RGBA | yes | 1240781 |
| `left-sakura-tree-after.png` | 1916 | 821 | 2.3337 | RGBA | yes | 2074006 |
| `mist-2-after.png` | 1916 | 821 | 2.3337 | RGBA | yes | 1388554 |
| `mist-after.png` | 1916 | 821 | 2.3337 | RGBA | yes | 1260136 |
| `mist-before.png` | 1916 | 821 | 2.3337 | RGBA | yes | 946950 |
| `moon-after.png` | 1254 | 1254 | 1.0000 | RGBA | yes | 2150212 |
| `moon-before.png` | 1254 | 1254 | 1.0000 | RGBA | yes | 2467563 |
| `right-petals-after.png` | 1916 | 821 | 2.3337 | RGBA | yes | 1567837 |
| `right-sakura-tree-after.png` | 1916 | 821 | 2.3337 | RGBA | yes | 1794172 |
| `right-sakura-tree-before.png` | 1916 | 821 | 2.3337 | RGBA | yes | 1786453 |
| `temple-after.png` | 1916 | 821 | 2.3337 | RGBA | yes | 2321083 |
| `temple-before.png` | 1916 | 821 | 2.3337 | RGBA | yes | 2465653 |

The environment masters share a 1916×821 canvas, so paired layers can occupy identical geometry without layout drift. Character masters share 1448×1086. Moon masters are square 1254×1254.