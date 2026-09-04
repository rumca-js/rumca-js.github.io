import argparse

from linkarchivetools.tableconfig import *
from linkarchivetools.dbupdate import DbUpdate
from linkarchivetools.db2json import Db2JSON
from linkarchivetools.dbanalyzer import DbAnalyzer
from linkarchivetools.utils.reflected import ReflectedTable
from linkarchivetools.model import DbConnection


def parse():
    """
    TODO - I think we should use DbFilter parser
    """
    parser = argparse.ArgumentParser(description="filtering program")
    parser.add_argument("--db", help="DB to be processed")
    parser.add_argument("--output-dir", help="Directory to be created")
    parser.add_argument("--output-file", help="Output file")
    parser.add_argument("--file-names", help="File names")
    parser.add_argument("--jsons", action="store_true", help="exported to JSONs")

    parser.add_argument("--bookmarked", action="store_true", help="Removes non bookmarked")
    parser.add_argument("--votes", action="store_true", help="Removes entries without a vote")
    parser.add_argument("--user-data", action="store_true", help="Prepares for setup with no users")
    parser.add_argument("--obfuscate", action="store_true", help="Obfuscates private data")
    parser.add_argument("--dynamic-data", action="store_true", help="Truncates dynamic tables")
    parser.add_argument("--redundant", action="store_true", help="Removes entries that are redundant - not bookmarked, no votes")
    parser.add_argument("--configuration", action="store_true", help="Removes uneceesary configuration")
    parser.add_argument("--search-data", action="store_true", help="Removes user data")
    parser.add_argument("--visits-data", action="store_true", help="Removes user data")
    parser.add_argument("--domains", action="store_true", help="Removes domains data")

    parser.add_argument("-v", "--verbosity", help="Verbosity level")
    
    args = parser.parse_args()

    return parser, args


def main():
    temporary_file = "tmp.db"

    parser, args = parse()
    if not args.db:
        print("Please specify database")
        return

    if args.output_file:
        temporary_file = args.output_file

    #analyzer = DbAnalyzer(input_db = args.db)
    #analyzer.print_summary()

    print("Filtering")
    thefilter = DbUpdate(db=args.db)

    entries_changed = False
    if args.user_data:
        entries_changed = True
        thefilter.truncate_user_tables()
        thefilter.truncate_configuration_tables()
    if args.obfuscate:
        entries_changed = True
        thefilter.obfuscate()
    if args.dynamic_data:
        entries_changed = True
        thefilter.truncate_dynamic_data()
    if args.bookmarked:
        entries_changed = True
        thefilter.delete_non_bookmarked()
    if args.votes:
        entries_changed = True
        thefilter.delete_entries_no_votes()
    if args.redundant:
        entries_changed = True
        thefilter.delete_entries_redundant()
    if args.configuration:
        thefilter.truncate_configuration_tables()
    if args.search_data:
        thefilter.truncate_tables(get_search_tables())
    if args.visits_data:
        thefilter.truncate_tables(get_visits_tables())
    if args.domains:
        thefilter.truncate_tables({"domains"})

    thefilter.obfuscate()

    thefilter.close()
    print("Filtering DONE")

    #analyzer = DbAnalyzer(input_db = temporary_file)
    #analyzer.print_summary()

    if args.jsons:
        print("Writing JSONS")
        json = Db2JSON(input_db = temporary_file, output_dir=args.output_dir, format=args.file_names, rows_max=1000)
        #if not json.is_valid():
        #    return

        json.convert()
        json.close()

        print("Writing JSONS DONE")
    else:
        connection = DbConnection(temporary_file)
        table = ReflectedTable(engine=connection.engine, connection=connection.connection)
        table.vacuum()
        table.close()
        connection.close()

main()
