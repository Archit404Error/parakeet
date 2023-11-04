from flask import Flask, request, jsonify
from flask_cors import CORS

from grammar_inference import load_gec_models, correct_grammar
from whisper_inference import transcribe_audio

app = Flask(__name__)
cors = CORS(app)


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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
