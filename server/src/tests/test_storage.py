from src.tests.test_base import TestBase
import matplotlib.pyplot as plt


class TestStorage(TestBase):

    def test_file_rename(self):
        self.storage.rename('cropped.mp4', 'cropped_renamed.mp4')
