"""
Prepares permanent repository for offline view
"""
import os
import json
import shutil
from pathlib import Path


class Filter(object):
    def __init__(self, dir):
        self.dir = dir
        self.files = []
        self.entries = []

        self.get_files()

    def get_files(self):
        """Get all JSON file paths from the specified directory, including subdirectories."""
        self.files = []
        for root, _, files in os.walk(self.dir):
            for file in files:
                if file.endswith('.json'):
                    file_path = os.path.join(root, file)
                    if os.path.isfile(file_path):
                        self.files.append(file_path)
        return self.files

    def get_entries(self):
        """Load JSON contents from each file in the directory and extend the entries list."""
        for afile in self.files:
            try:
                with open(afile, 'r') as fh:
                    data = fh.read()
                    entries = json.loads(data)
                    if isinstance(entries, list):
                        self.entries.extend(entries)
                    else:
                        self.entries.append(entries)
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error processing file {afile}: {e}")

    def filter_entries(self):
        """Filter entries to keep only those with 'page_rating_votes' > 0."""
        filtered_entries = []
        for entry in self.entries:
            if entry.get("page_rating_votes", 0) > 0:
                filtered_entries.append(entry)
        self.entries = filtered_entries

    def write_entries(self, dir):
        """Write entries to the specified directory, 1000 per file."""
        if not os.path.exists(dir):
            os.makedirs(dir)

        self.get_entries()
        self.filter_entries()

        for i in range(0, len(self.entries), 1000):
            chunk = self.entries[i:i + 1000]
            file_path = os.path.join(dir, f"entries_{i // 1000 + 1}.json")
            try:
                with open(file_path, 'w') as fh:
                    json.dump(chunk, fh, indent=4)
            except IOError as e:
                print(f"Error writing file {file_path}: {e}")

    def copy_jsons(self, dir):
        """
        Copy JSON files from self.files to the specified directory.
        
        Parameters:
        dir (str): The destination directory where the files will be copied.
        """

        if not os.path.exists(dir):
            os.makedirs(dir)
        
        for afile in self.files:
            try:
                parent = Path(afile)
                name = parent.parent.name
                destination_dir = os.path.join(dir, name)

                shutil.copy(afile, destination_dir + ".json")
                print(f"Copied: {afile} to {dir}")
            except Exception as e:
                print(f"Error copying file {afile}: {e}")


def main():
    path = Path("data") / "permanent"
    if not path.exists():
        print("Path {} does not exist".format(path))
        return

    f = Filter(path)

    new_path = Path("data") / "permanent_new"
    if new_path.exists():
        shutil.rmtree(new_path)
    f.copy_jsons(new_path)

    new_path = Path("data") / "top"
    if new_path.exists():
        shutil.rmtree(new_path)
    f.write_entries(new_path)


main()
