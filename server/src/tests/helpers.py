import logging
import sys


def start_logging() -> None:
    logging.basicConfig(stream=sys.stdout, level=logging.INFO, format='%(message)s')
