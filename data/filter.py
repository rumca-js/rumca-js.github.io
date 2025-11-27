import argparse

from linkarchivetools.dbfilter import DbFilter
from linkarchivetools.db2json import Db2JSON


def parse():
    parser = argparse.ArgumentParser(description="Data analyzer program")
    parser.add_argument("--db", help="DB to be scanned")
    parser.add_argument("--output-dir", help="Directory to be created")
    parser.add_argument("--file-names", help="File names")
    parser.add_argument("--bookmarked", action="store_true", help="export bookmarks")
    parser.add_argument("--votes", action="store_true", help="export if votes is > 0")
    parser.add_argument("-v", "--verbosity", help="Verbosity level")
    
    args = parser.parse_args()

    return parser, args


def main():
    temporary_file = "tmp.db"

    parser, args = parse()
    if not args.db:
        print("Please specify database")
        return

    print("Filtering")
    filter = DbFilter(input_db=args.db,output_db=temporary_file)
    filter.filter_bookmarks()
    filter.filter_votes()
    filter.close()
    print("Filtering DONE")

    print("Writing JSONS")
    json = Db2JSON(input_db = temporary_file, output_dir=args.output_dir, format=args.file_names, rows_max=1000)
    #if not json.is_valid():
    #    return

    json.convert()
    json.close()

    print("Writing JSONS DONE")

main()
