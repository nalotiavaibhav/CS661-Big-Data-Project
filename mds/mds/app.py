
import os
import pandas as pd
from flask import jsonify
from flask import *
from sklearn.cluster import KMeans
from sklearn import manifold
from sklearn.decomposition import PCA
from sklearn.manifold import MDS
import numpy as np
import random
from sklearn import preprocessing
from sklearn.metrics import pairwise_distances
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_mds')
def get_mds():
    mds = pd.read_csv("mds_result.csv")
    return mds.to_json(orient='columns')

@app.route('/get_correlation')
def get_correlation():
    mds = pd.read_csv("mds_result_correlation.csv")
    return mds.to_json(orient='columns')

if __name__ == "__main__":
    app.run(debug=True)