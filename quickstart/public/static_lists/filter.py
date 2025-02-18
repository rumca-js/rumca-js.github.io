"""
Prepares permanent repository for offline view
"""
import os
import sys
import json
import shutil
from pathlib import Path
import argparse

from sqlalchemy import create_engine
from utils.reflected import *


class Filter(object):

    def __init__(self, dir, args):
        self.dir = dir
        self.args = args

        self.file_index = 0
        self.entry_index = 0
        self.handle = None

        self.rows = []

        self.processed = 0
        self.all = 0

    def is_valid(self, entry):
        if self.args.votes:
            if entry.page_rating_votes <= 0:
                return False
            if entry.page_rating_votes is None:
                return False

        if self.args.bookmarked:
            if entry.bookmarked is None or entry.bookmarked is False:
                return False

        return True

    def write(self, entry, tags):
        """Write entries to the specified directory, 1000 per file."""
        if not os.path.exists(self.dir):
            os.makedirs(self.dir)

        if self.handle == None:
            file_path = self.get_file_path()
            self.handle = open(file_path, 'w')

        row = self.get_entry_json_data(entry, tags)

        self.rows.append(row)

        self.entry_index += 1

        sys.stdout.write("{}\r".format(self.entry_index))

        if self.entry_index == 1000:
            self.file_index += 1
            self.entry_index = 0
            self.finish_stream()

            file_path = self.get_file_path()
            self.handle = open(file_path, 'w')

    def get_entry_json_data(self, entry, tags):
        date_published = entry.date_published
        if date_published:
            date_published = date_published.isoformat()

        date_dead_since = entry.date_dead_since
        if date_dead_since:
            date_dead_since = date_dead_since.isoformat()

        row = {"link" : entry.link,
               "description" : entry.description,
               "author" : entry.author,
               "album" : entry.album,
               "bookmarked" : entry.bookmarked,
               "date_dead_since" : date_dead_since,
               "date_published" : date_published,
               "language" : entry.language,
               "manual_status_code" : entry.manual_status_code,
               "page_rating" : entry.page_rating,
               "page_rating_contents" : entry.page_rating_contents,
               "page_rating_votes" : entry.page_rating_votes,
               "page_rating_visits" : entry.page_rating_visits,
               "permanent" : entry.permanent,
               "source_url" : entry.source_url,
               "status_code" : entry.status_code,
               "thumbnail" : entry.thumbnail,
               "title" : entry.title,
               "age" : entry.age,
               "tags" : tags,
                }
        return row

    def get_file_path(self):
        return "{}_{}.json".format(self.args.format, str(self.file_index))

    def close(self):
        if self.handle:
            self.finish_stream()
        self.handle = None

    def finish_stream(self):
        if not self.handle:
            return

        try:
            string = json.dumps(self.rows, indent=4)
            self.handle.write(string)
        except ValueError as e:
            print(f"Error writing file {file_path}: {e}")
        self.handle.close()
        self.rows = []


def parse():
    parser = argparse.ArgumentParser(description="Data analyzer program")
    parser.add_argument("--db", default="places.db", help="DB to be scanned")
    parser.add_argument("--bookmarked", action="store_true", help="export bookmarks")
    parser.add_argument("--votes", action="store_true", help="export if votes is > 0")
    parser.add_argument("-f","--format", default="entries", help="file name format")
    parser.add_argument("-v", "--verbosity", help="Verbosity level")
    
    args = parser.parse_args()

    return parser, args


def main():
    parser, args = parse()

    path = Path(args.db)
    if not path.exists():
        print("File {} does not exist".format(path))
        return

    engine = create_engine(f"sqlite:///{args.db}")
    table = ReflectedEntryTable(engine)

    new_path = Path("data") / "top"
    if new_path.exists():
        shutil.rmtree(new_path)

    f = Filter(new_path, args)
    for entry in table.get_entries():
        if not f.is_valid(entry):
            continue

        tags = table.get_tags(entry.id)
        #print(entry)
        f.write(entry, tags)

    f.close()

main()
