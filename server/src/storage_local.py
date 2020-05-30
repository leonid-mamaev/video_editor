import logging
from dataclasses import dataclass
from pathlib import Path
from typing import List
import src as src_dir


@dataclass
class File:
    name: str
    path: str

    @classmethod
    def from_local_file(cls, file_path: Path) -> 'File':
        return File(
            name=file_path.name,
            path=str(file_path.absolute())
        )


class StorageLocal:

    def __init__(self, path: str = 'store'):
        self.path = path

    @property
    def directory(self) -> Path:
        return Path(src_dir.__file__).parent.joinpath(self.path)

    def list(self) -> List[File]:
        files = [item for item in self.directory.glob('**/*')]
        result = sorted(files)
        return [File.from_local_file(item) for item in result]

    def get_file_path(self, file_name: str) -> str:
        files = self.list()
        for file in files:
            if file.name == file_name:
                return str(self.directory.joinpath(file_name))
        raise FileNotFound(f'File not found: {file_name}')

    def get_file(self, file_name: str) -> File:
        files = self.list()
        for file in files:
            if file.name == file_name:
                return file
        raise ValueError(f'File not found: {file_name}')

    def generate_file_path(self, name: str) -> str:
        return str(self.directory.joinpath(name))

    def remove_files(self, names: List[str]) -> None:
        for name in names:
            self.directory.joinpath(name).unlink()

    def rename(self, name: str, new_name: str) -> None:
        self.directory.joinpath(name).rename(self.generate_file_path(new_name))


class FileNotFound(Exception):
    pass
