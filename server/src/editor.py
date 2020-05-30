import tempfile
import wave
from numpy.core.records import ndarray
from pydub import AudioSegment
import numpy
from moviepy.editor import VideoFileClip, CompositeAudioClip, AudioFileClip, clips_array, concatenate_videoclips


class Editor:

    def slice_video(self, source: str, destination: str, start: float = 0, end: float = None) -> None:
        video = VideoFileClip(source).subclip(start, end)
        video.write_videofile(destination, audio_codec='aac')

    def slice_audio(self, source: str, destination: str, start: float, end: float) -> None:
        audio = AudioFileClip(source).subclip(start, end)
        return audio.write_audiofile(destination)

    def extract_audio_from_video(self, source: str, destination: str, start: float = 0, end: float = None) -> None:
        video = VideoFileClip(source).subclip(start, end)
        return video.audio.write_audiofile(destination)

    def apply_audio(self, video_path: str, audio_path: str, destination: str) -> None:
        video = VideoFileClip(video_path)
        audio = AudioFileClip(audio_path)
        video_with_applied_audio = video.set_audio(audio)
        video_with_applied_audio.write_videofile(destination, audio_codec='aac')

    def join_audios(self, audio_1: str, audio_2: str, destination: str) -> None:
        audio_clip_1 = AudioFileClip(audio_1)
        audio_clip_2 = AudioFileClip(audio_2)
        new_audio_clip = CompositeAudioClip([audio_clip_1, audio_clip_2])
        new_audio_clip.write_audiofile(destination, fps=44100)

    def array_clips(self, video_1: str, video_2: str, destination: str) -> None:
        clip_1 = VideoFileClip(video_1)
        clip_2 = VideoFileClip(video_2)
        joined = clips_array([[clip_1, clip_2]])
        final = concatenate_videoclips([joined])
        final.write_videofile(destination)

    def join_videos(self, video_1: str, video_2: str, destination: str) -> None:
        final = concatenate_videoclips([VideoFileClip(video_1), VideoFileClip(video_2)])
        final.write_videofile(destination)

    def convert_audio_to_wave(self, audio_file_path: str, destination: str) -> None:
        sound = AudioSegment.from_file(audio_file_path)
        sound = sound.set_channels(1)
        wav_file = sound.export(destination, format='wav')
        wav_file.close()

    def get_wave_form_signal(self, wav_file_path: str, points: int = 600):
        spf = wave.open(wav_file_path, 'r')
        signal = spf.readframes(-1)
        signal = numpy.frombuffer(signal, dtype=numpy.int16)  # type: ndarray
        frame_rate = spf.getframerate()
        time = numpy.linspace(0, len(signal) / frame_rate, num=len(signal))
        new_signal_list = []
        new_time_list = []
        iteration_size = signal.size // points
        signal = signal.clip(0)
        for i in range(signal.size // iteration_size):
            new_signal_list.append(signal[i * iteration_size: (i+1) * iteration_size].mean())
            new_time_list.append(time[i * iteration_size])
        return new_signal_list, new_time_list

    def resize_video(
        self,
        source: str,
        destination: str,
        scale: float = None,
        width: int = None,
        height: int = None
    ) -> None:
        video = VideoFileClip(source)
        if scale:
            video = video.resize(scale)
        if width:
            video = video.resize(width=width)
        if height:
            video = video.resize(width=width, height=height)
        video.write_videofile(destination)

    def crop_video(
        self,
        source: str,
        destination: str,
        x1: float = None,
        x2: float = None,
        y1: float = None,
        y2: float = None
    ) -> None:
        video = VideoFileClip(source)
        video = video.crop(x1=x1, x2=x2, y1=y1, y2=y2)
        video.write_videofile(destination)


def temp_directory() -> str:
    return tempfile.mkdtemp()
