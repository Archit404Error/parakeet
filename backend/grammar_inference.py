from transformers import T5Tokenizer, AutoModelForSeq2SeqLM
from functools import lru_cache


@lru_cache()
def load_gec_models():
    gec_tokenizer = T5Tokenizer.from_pretrained("./models/gec_model_final")
    gec_model = AutoModelForSeq2SeqLM.from_pretrained("./models/gec_model_final")
    return gec_tokenizer, gec_model


def correct_grammar(
    sentences: list[str], tokenizer: T5Tokenizer, model: AutoModelForSeq2SeqLM
):
    batch = tokenizer(
        sentences,
        truncation=True,
        padding="max_length",
        max_length=128,
        return_tensors="pt",
    )
    translated = model.generate(
        **batch,
        num_beams=5,
        num_return_sequences=1,
        max_new_tokens=500,
        early_stopping=True,
    )
    return tokenizer.batch_decode(translated, skip_special_tokens=True)
