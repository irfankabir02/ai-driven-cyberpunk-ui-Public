import numpy as np
import pandas as pd
import datetime
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from lime.lime_tabular import LimeTabularExplainer

# Simulated Data
start_time_6AM = datetime.datetime.strptime("06:00", "%H:%M")
data = []
stock_growth_rate = 1.2  
initial_stock = 3  
customer_demand = 10  
total_timeframe_hours = 16  
time_intervals = np.linspace(0, total_timeframe_hours, num=10)  

current_stock = initial_stock
for hour in time_intervals:
    timestamp = start_time_6AM + datetime.timedelta(hours=hour)
    available_stock = min(customer_demand, int(current_stock * stock_growth_rate))
    data.append([hour, available_stock, stock_growth_rate, customer_demand])
    current_stock = available_stock  

df = pd.DataFrame(data, columns=["Hours", "Current Stock", "Stock Growth Rate", "Customer Demand"])

# Train Model
X = df[["Hours", "Stock Growth Rate", "Customer Demand"]]
y = df["Current Stock"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)  # Adjusted split ratio
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Apply LIME
explainer = LimeTabularExplainer(
    X_train.values,
    feature_names=X_train.columns.tolist(),
    class_names=["Current Stock"],
    mode="regression"
)

# Pick a valid sample index
sample_index = min(3, len(X_test) - 1)  # Ensures selection is within valid range
exp = explainer.explain_instance(X_test.iloc[sample_index].values, model.predict, num_features=3)

# Show LIME Explanation
exp.show_in_notebook()
exp.as_pyplot_figure()
