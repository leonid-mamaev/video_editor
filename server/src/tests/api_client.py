import logging
from enum import Enum
from json.decoder import JSONDecodeError
from typing import List

import requests


class Method(Enum):
    POST = 'post'
    PATCH = 'patch'
    GET = 'get'
    PUT = 'put'


class ApiClient:

    @classmethod
    def from_config(cls) -> 'ApiClient':
        return ApiClient('http://127.0.0.1:8000')

    def __init__(self, host: str):
        self.host = host

    def make_request(self, url: str, method: Method, data: dict = None, params: dict = None):
        url = f'{self.host}/{url}'
        logging.info(f'Send {method.value} request to {url} with json: {data}')
        requests_response = requests.request(method=method.value, url=url, json=data, params=params, verify=False)
        try:
            result = requests_response.json()
        except JSONDecodeError:
            result = requests_response.text
        logging.info(f'Response: {result}')
        requests_response.raise_for_status()
        return requests_response


def api_list_video_files(client: ApiClient) -> List[str]:
    return client.make_request('api/list', method=Method.GET).json()


def api_slice_video(source_name: str, destination_name: str, start: float, end: float) -> None:
    data = {
        'source_file_name': source_name,
        'destination_file_name': destination_name,
        'start': start,
        'end': end
    }
    ApiClient.from_config().make_request('api/slice_video', method=Method.POST, data=data)


def api_extract_audio(source: str, destination: str, start: float, end: float) -> None:
    data = {
        'source_file_name': source,
        'destination_file_name': destination,
        'start': start,
        'end': end
    }
    ApiClient.from_config().make_request('api/extract_audio', method=Method.POST, data=data)


def api_apply_audio(video: str, audio: str, destination: str) -> None:
    data = {
        'video': video,
        'audio': audio,
        'destination': destination,
    }
    ApiClient.from_config().make_request('api/apply_audio', method=Method.POST, data=data)


def api_join_audios(audio_1: str, audio_2: str, destination: str) -> None:
    data = {
        'audio_1': audio_1,
        'audio_2': audio_2,
        'destination': destination,
    }
    ApiClient.from_config().make_request('api/join_audios', method=Method.POST, data=data)


def api_remove_files(names: List[str]) -> None:
    data = {'names': names}
    ApiClient.from_config().make_request('api/remove', method=Method.POST, data=data)


def api_get_audio_wave_form(name: str):
    data = {'name': name}
    return ApiClient.from_config().make_request('api/get_audio_wave_form', method=Method.GET, params=data)


def api_crop_video(source: str, destination: str, x1: float, x2: float, y1: float, y2: float):
    data = {
        'source_file_name': source,
        'destination_file_name': destination,
        'x1': x1,
        'x2': x2,
        'y1': y1,
        'y2': y2
    }
    return ApiClient.from_config().make_request('api/crop_video', method=Method.POST, data=data)
