import os
import spacy
from spacy.cli import download
from dotenv import load_dotenv
load_dotenv()

MODEL_SPACY = os.getenv("MODEL_SPACY")

os.environ['KMP_DUPLICATE_LIB_OK']='True'

def get_keyword_count(job_desc, df):
    # Load the spaCy model
    try:
        nlp = spacy.load("en_core_web_sm")
        print(f"{MODEL_SPACY} is already installed.")
    except OSError:
        # If the model is not installed, catch the OSError and install the model
        print(f"{MODEL_SPACY} not found, installing...")
        download(MODEL_SPACY)
        # Load the model after installation to verify
        try:
            nlp = spacy.load(MODEL_SPACY)
            print(f"{MODEL_SPACY} has been successfully installed.")
        except OSError:
            print(f"Failed to install {MODEL_SPACY}. Please check your installation.")
    # Process the job description text
    doc = nlp(job_desc)
    
    # Initialize a list to store keywords
    keywords = []
    
    # Add proper nouns, nouns, and verbs to the keywords list
    for token in doc:
        if token.pos_ in ['PROPN', 'NOUN', 'VERB']:
            # Add the token's lemma to the list of keywords if it's not a stop word
            if not token.is_stop:
                keywords.append(token.lemma_)
    
    # Use a set to remove duplicates, then convert back to list
    unique_keywords = list(set(keywords))

    # Count the number of keywords in each bullet point
    df['keyword_count'] = df['bullet'].apply(lambda x: sum([1 for keyword in unique_keywords if keyword in x]))
    
    return df


if __name__ == "__main__":
    job_desc = open("dummyjob.txt", "r").read()
    keywords = extract_keywords_spacy(job_desc)
    print(keywords)
