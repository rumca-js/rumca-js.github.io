import os
import json
from pathlib import Path


class Filter(object):
    def __init__(self, dir):
        self.dir = dir
        self.files = []  # Initialize files as an empty list
        self.entries = []  # Initialize entries as an empty list

        self.get_files()
        self.get_entries()
        self.filter_entries()
        print(len(self.entries))

    def get_files(self):
        """Get all file paths from the specified directory, including subdirectories."""
        self.files = []  # Clear any existing file list
        for root, _, files in os.walk(self.dir):
            for file in files:
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
                        self.entries.extend(entries)  # Append entries if it's a list
                    else:
                        self.entries.append(entries)  # Otherwise, append the single entry
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error processing file {afile}: {e}")

    def filter_entries(self):
        """Filter entries to keep only those with 'page_rating_votes' > 0."""
        filtered_entries = []
        for entry in self.entries:
            if entry.get("page_rating_votes", 0) > 0:
                filtered_entries.append(entry)
        self.entries = filtered_entries

    def write(self, dir):
        """Write entries to the specified directory, 1000 per file."""
        if not os.path.exists(dir):
            os.makedirs(dir)

        for i in range(0, len(self.entries), 1000):
            chunk = self.entries[i:i + 1000]
            file_path = os.path.join(dir, f"entries_{i // 1000 + 1}.json")
            try:
                with open(file_path, 'w') as fh:
                    json.dump(chunk, fh, indent=4)
            except IOError as e:
                print(f"Error writing file {file_path}: {e}")


path = Path("data") / "permanent"
f = Filter(path)

new_path = Path("data") / "permanent_new"
f.write(new_path)
