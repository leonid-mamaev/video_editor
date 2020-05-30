import unittest
from src.tests.api_client import api_slice_video, api_extract_audio, api_apply_audio, api_join_audios, api_remove_files, \
    api_get_audio_wave_form, api_crop_video
from src.tests.helpers import start_logging


class TestApi(unittest.TestCase):

    def setUp(self) -> None:
        start_logging()

    def test_api_slice_video(self):
        api_slice_video(source_name='test_1.mp4', destination_name='test_lena.mp4', start=5.5, end=7.5)

    def test_api_extract_audio_from_video(self):
        api_extract_audio(source='test_1.mp4', destination='test_audio_extract.mp3', start=0, end=13)

    def test_api_apply_audio(self):
        api_slice_video(source_name='test_1.mp4', destination_name='test_video_slice.mp4', start=0, end=7)
        api_extract_audio(source='test_1.mp4', destination='test_audio_slice.mp3', start=6, end=13)
        api_apply_audio(video='test_video_slice.mp4', audio='drums.mp3', destination='apply.mp4')

    def test_api_join_audios(self):
        api_join_audios(audio_1='test_audio_extract.mp3', audio_2='drums.mp3', destination='joined_audios.mp3')

    def test_flow(self):
        api_apply_audio(video='test_1.mp4', audio='joined_audios.mp3', destination='finish.mp4')

    def test_remove_files(self):
        api_remove_files(names=['test_lena.mp3'])

    def test_get_audio_wave_form(self):
        api_get_audio_wave_form(name='First_Reaper.mp3')

    def test_crop_video(self):
        api_crop_video(source='20200529_152027.mp4', destination='test_crop.mp4', x1=1000, x2=-1000, y1=500, y2=-500)
