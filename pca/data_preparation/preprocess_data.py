import os
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import json
from sklearn.manifold import TSNE

# Load the air quality data (assuming it contains columns: Ozone, CO, SO2, NO2, PM10, PM2.5 for each state)
data = pd.read_csv('merged_pollution.csv')

# Select relevant columns
data = data[['State', 'Ozone', 'CO', 'SO2', 'NO2', 'PM10', 'PM2.5']]

states = data['State'].unique()

processed_data = {}
for state in states:
    processed_data[state] = {}
    city_data = data[(data['State'] == state)]
    unique_city_data = city_data.drop_duplicates(subset=['Ozone', 'SO2', 'NO2', 'CO'])
    processed_data[state] = {
        "Ozone": data[data['State']==state]['Ozone'].tolist(),
        "SO2": data[data['State']==state]['SO2'].tolist(),
        "NO2": data[data['State']==state]['NO2'].tolist(),
        "CO": data[data['State']==state]['CO'].tolist(),
    }

# Create directory if it doesn't exist
output_dir = 'pca_data'
os.makedirs(output_dir, exist_ok=True)

# with open(f'{output_dir}/processed_data.json', 'w') as f:
#     json.dump(processed_data, f, indent=4)

state_pc = {}

for state in states:
    # state_pc[state] = {}
    # df = pd.DataFrame(processed_data[state])
    # standardized_df = StandardScaler().fit_transform(df)
    # pca = PCA(n_components=2)
    # principal_components = pca.fit_transform(standardized_df)
    
    # # Convert the principal components to a DataFrame and then to a dictionary
    # pc_df = pd.DataFrame(principal_components, columns=['PC1', 'PC2'])
    # state_pc[state] = pc_df.values.tolist()
    print(state)
    state_pc[state] = {}
    df = pd.DataFrame(processed_data[state])
    standardized_df = StandardScaler().fit_transform(df)
    tsne = TSNE(n_components=2)
    tsne_components = tsne.fit_transform(standardized_df)

    # Convert the t-SNE components to a DataFrame and then to a dictionary
    tsne_df = pd.DataFrame(tsne_components, columns=['TSNE1', 'TSNE2'])
    state_pc[state] = tsne_df.values.tolist()

# print(processed_data)
with open(f'{output_dir}/state_pc_sne.json', 'w') as f:
    json.dump(state_pc, f, indent=4)
 
