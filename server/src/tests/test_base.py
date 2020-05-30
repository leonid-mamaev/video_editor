import unittest
from src.editor import Editor
from src.storage_local import StorageLocal
from src.tests.helpers import start_logging


class TestBase(unittest.TestCase):

    def setUp(self) -> None:
        start_logging()
        self.storage = StorageLocal()
        self.editor = Editor()
