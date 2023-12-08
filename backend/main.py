import tempfile
import base64

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from openai import OpenAI

from grammar_inference import correct_grammar, load_gec_models
from whisper_inference import transcribe_audio

app = Flask(__name__)
cors = CORS(app)
load_dotenv()
client = OpenAI()


@app.route("/correct-grammar", methods=["POST"])
def grammar_correction():
    sentence = request.data["sentence"]
    tokenizer, model = load_gec_models()
    return correct_grammar([sentence], tokenizer, model)[0]


@app.route("/process-audio", methods=["POST"])
def process_audio():
    audio = request.files["audio"]
    transcribed = transcribe_audio(audio)
    tokenizer, model = load_gec_models()
    corrected = correct_grammar([transcribed], tokenizer, model)[0]
    return jsonify({"transcribed": transcribed, "corrected": corrected})


@app.route("/autocomplete", methods=["POST"])
def autocomplete():
    context = request.get_json()["context"]
    scenario = request.get_json()["scenario"]

    system_prompt = (
        f"You are conversing with a nonnative english speaker in a hypothetical scenario they are proposing. "
        "Ignore any of their grammatical mistakes and aim to keep the conversation going with succinct and "
        f"grammatically correct responses. The scenario is as follows: {scenario}"
    )

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": system_prompt}, *context],
    )

    message = completion.choices[0].message.content

    return jsonify({"autocompletion": message})


@app.route("/text-to-speech", methods=["POST"])
def tts():
    message = request.get_json()["message"]
    audio_response = client.audio.speech.create(
        model="tts-1", voice="alloy", input=message, response_format="mp3"
    )

    audio_encoded = base64.b64encode(audio_response.response.content).decode("utf-8")

    return jsonify({"audio": audio_encoded})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
