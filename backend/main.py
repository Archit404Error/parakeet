from flask import Flask, request, jsonify
from flask_cors import CORS

from grammar_inference import load_gec_models, correct_grammar
from whisper_inference import transcribe_audio
from openai import ChatCompletion, OpenAI
from dotenv import load_dotenv

app = Flask(__name__)
cors = CORS(app)
load_dotenv()

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

    completion = ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": system_prompt}, *context],
    )

    message = completion.choices[0].message.content
    audio_response = OpenAI.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=message,
    )
    audio_response.stream_to_file("../mobile/output.mp3")

    return jsonify({"autocompletion": message})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
