from functools import lru_cache
from tempfile import NamedTemporaryFile
import whisper


@lru_cache()
def load_whisper():
    return whisper.load_model("tiny.en")


def transcribe_audio(audio_file):
    temp_file = NamedTemporaryFile()
    audio_file.save(temp_file)
    return load_whisper().transcribe(temp_file.name)["text"]
