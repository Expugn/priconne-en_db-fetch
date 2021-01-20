"""
HOW TO USE:
`python deserialize.py <import_path> <export_path>`

REQUIRED DEPENDENCIES:
- lz4       `pip install lz4`
- UnityPack (provided)
"""


import sys
from io import BytesIO
from vendor.UnityPack import unitypack


def open_textasset(import_path, export_path):
    with open(import_path, 'rb') as f:
        bundle = unitypack.load(f)
        for asset in bundle.assets:
            for id, object in asset.objects.items():
                if object.type == 'TextAsset':
                    data = object.read()

                    with open(export_path, 'wb') as fi:
                         fi.write(data.script)
                         print('<DESERIALIZE>', import_path, '->', export_path)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print('Not enough arguments.')
        sys.exit()
    open_textasset(sys.argv[1], sys.argv[2])
