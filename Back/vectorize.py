import os
from transformers import AutoTokenizer, TFAutoModel
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import json
from dotenv import load_dotenv

os.environ['KMP_DUPLICATE_LIB_OK']='True'
load_dotenv()
model_ckpt = os.getenv("MODEL_CKPT")
print(model_ckpt)

def get_embeddings(text_list):
    """
    Embeds the input text using the pre-trained model

    Args:
        text_list (list): A list of strings to be embedded
    
    Returns:
        np.ndarray: An array containing the embeddings of the input text
    """
    
    tokenizer = AutoTokenizer.from_pretrained(model_ckpt)
    model = TFAutoModel.from_pretrained(model_ckpt, from_pt=True)

    encoded_input = tokenizer(
        text_list, padding=True, truncation=True, return_tensors="tf"
    )
    encoded_input = {k: v for k, v in encoded_input.items()}
    model_output = model(**encoded_input)
    return model_output.last_hidden_state[:, 0]

def embed_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Embeds the bullet points in the user data using the pre-trained model

    Args:
        df (pd.DataFrame): A pandas DataFrame containing the bullet points

    Returns:
        pd.DataFrame: A pandas DataFrame with an additional column "embedding" containing the embeddings of the bullet points
    """

    assert type(df) == pd.DataFrame, "Input must be a pandas DataFrame"
    assert "bullet" in df.columns, "The DataFrame must have a column named 'bullet'"

    tokenizer = AutoTokenizer.from_pretrained(model_ckpt)
    model = TFAutoModel.from_pretrained(model_ckpt, from_pt=True)

    def cls_pooling(model_output):
        return model_output.last_hidden_state[:, 0]

    def get_embeddings(text_list):
        encoded_input = tokenizer(
            text_list, padding=True, truncation=True, return_tensors="tf"
        )
        encoded_input = {k: v for k, v in encoded_input.items()}
        model_output = model(**encoded_input)
        return cls_pooling(model_output)
    
    df["embedding"] = df["bullet"].apply(lambda x: get_embeddings(x).numpy())
    return df

def get_similiarity(job_desc: str, df: pd.DataFrame) -> pd.DataFrame:
    """
    Sorts the DataFrame based on the similarity of the bullet points with the job description

    Args:
        job_desc (str): The job description
        df (pd.DataFrame): The DataFrame to be sorted

    Returns:
        pd.DataFrame: The sorted DataFrame
    """

    assert type(df) == pd.DataFrame, "Input must be a pandas DataFrame"
    assert "embedding" in df.columns, "The DataFrame must have a column named 'embedding'"
    assert type(job_desc) == str, "Job description must be a string"

    
    query_embedding = get_embeddings(job_desc).numpy()
    df['similarity'] = df["embedding"].apply(lambda x: cosine_similarity(query_embedding, x)[0][0])
    return df


if __name__ == "__main__":
    data = []
    with open("dummydata.json", "r") as f:
        json_data = json.load(f)
        for project in json_data:
            for bullet in json_data[project]['bullets']:
                data.append((bullet, json_data[project]['title']))
    data = pd.DataFrame(data, columns=["bullet", "title"])

    job_desc = open("dummyjob.txt", "r").read()

    print(sort_by_similarity(job_desc, embed_data(data)))

