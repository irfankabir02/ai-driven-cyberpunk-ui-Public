import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import logging
from typing import Dict, List, Tuple, Union, Optional

# Forecasting models
from prophet import Prophet
from statsmodels.tsa.arima.model import ARIMA
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler

# ML models for classification/regression
from xgboost import XGBClassifier, XGBRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LinearRegression, LogisticRegression

# Model explanation tools
import shap
import lime
import lime.lime_tabular

# Model drift detection
from scipy.stats import ks_2samp
import numpy as np

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ModelFactory:
    """Factory for creating and managing different types of predictive models."""
    
    def __init__(self):
        self.models = {}
        self.explainers = {}
        self.training_data = {}
        self.feature_names = {}
        self.model_metrics = {}
        self.drift_metrics = {}
    
    def create_time_series_model(self, model_id: str, model_type: str, data: pd.DataFrame, 
                                 target_col: str, date_col: str, forecast_periods: int = 12, 
                                 config: Dict = None) -> Dict:
        """Create a time series forecasting model.
        
        Args:
            model_id: Unique identifier for the model
            model_type: Type of time series model ('prophet', 'arima', or 'lstm')
            data: DataFrame containing the time series data
            target_col: Column name of the target variable
            date_col: Column name of the date variable
            forecast_periods: Number of periods to forecast
            config: Dictionary of model-specific configuration parameters
            
        Returns:
            Dictionary containing the model and its metadata
        """
        logger.info(f"Creating time series model: {model_id} of type {model_type}")
        
        if model_id in self.models:
            logger.warning(f"Model {model_id} already exists. Overwriting.")
        
        if config is None:
            config = {}
            
        # Store training data for drift detection
        self.training_data[model_id] = data.copy()
        
        # Extract features for explanation
        if model_type == 'prophet':
            # Prepare data for Prophet
            df = data[[date_col, target_col]].rename(columns={date_col: 'ds', target_col: 'y'})
            
            # Initialize and fit Prophet model
            model = Prophet(**config)
            model.fit(df)
            
            # Make forecast
            future = model.make_future_dataframe(periods=forecast_periods)
            forecast = model.predict(future)
            
            # Store model and metadata
            self.models[model_id] = {
                'model': model,
                'type': model_type,
                'forecast': forecast,
                'last_trained': datetime.now().isoformat()
            }
            
            # Extract feature names for Prophet (add decomposition components)
            self.feature_names[model_id] = ['trend', 'yearly', 'weekly', 'daily']
            
            # Create SHAP explainer (using trend and seasonality components)
            components = model.predict(df[['ds']])
            feature_df = components[['trend', 'yearly', 'weekly', 'daily']]
            explainer = shap.Explainer(feature_df.values)
            self.explainers[model_id] = {
                'shap': explainer,
                'lime': None  # Prophet doesn't work well with LIME
            }
            
        elif model_type == 'arima':
            # Prepare data for ARIMA
            series = data[target_col]
            
            # Parse ARIMA order from config or use default
            order = config.get('order', (5, 1, 0))
            seasonal_order = config.get('seasonal_order', (0, 0, 0, 0))
            
            # Initialize and fit ARIMA model
            model = ARIMA(series, order=order, seasonal_order=seasonal_order)
            model_fit = model.fit()
            
            # Make forecast
            forecast = model_fit.forecast(steps=forecast_periods)
            
            # Store model and metadata
            self.models[model_id] = {
                'model': model_fit,
                'type': model_type,
                'forecast': forecast,
                'last_trained': datetime.now().isoformat()
            }
            
            # ARIMA doesn't have explicit features for SHAP, so we'll use lag features
            X = self._create_lag_features(series, lags=[1, 2, 3, 4, 5, 12])
            self.feature_names[model_id] = X.columns.tolist()
            
            # Create a surrogate model for explanation
            surrogate = XGBRegressor()
            surrogate.fit(X, series[X.index])
            
            # Create SHAP explainer using surrogate model
            explainer = shap.Explainer(surrogate)
            self.explainers[model_id] = {
                'shap': explainer,
                'lime': lime.lime_tabular.LimeTabularExplainer(
                    X.values, feature_names=X.columns.tolist(), mode='regression'
                )
            }
            
        elif model_type == 'lstm':
            # Prepare data for LSTM
            sequence_length = config.get('sequence_length', 10)
            
            # Scale the data
            scaler = MinMaxScaler()
            scaled_data = scaler.fit_transform(data[[target_col]])
            
            # Create sequences
            X, y = self._create_sequences(scaled_data, sequence_length)
            
            # Build LSTM model
            model = Sequential()
            model.add(LSTM(units=50, return_sequences=True, input_shape=(X.shape[1], 1)))
            model.add(LSTM(units=50))
            model.add(Dense(units=1))
            
            # Compile and fit
            model.compile(optimizer='adam', loss='mean_squared_error')
            model.fit(X, y, epochs=config.get('epochs', 100), batch_size=config.get('batch_size', 32), verbose=0)
            
            # Make forecast
            forecast = self._forecast_lstm(model, scaled_data, sequence_length, forecast_periods, scaler)
            
            # Store model and metadata
            self.models[model_id] = {
                'model': model,
                'type': model_type,
                'forecast': forecast,
                'scaler': scaler,
                'sequence_length': sequence_length,
                'last_trained': datetime.now().isoformat()
            }
            
            # Use lag features for explanation
            lag_df = self._create_lag_features(data[target_col], lags=list(range(1, sequence_length + 1)))
            self.feature_names[model_id] = lag_df.columns.tolist()
            
            # Create a surrogate model for explanation
            surrogate = XGBRegressor()
            surrogate.fit(lag_df, data.loc[lag_df.index, target_col])
            
            # Create SHAP explainer using surrogate model
            explainer = shap.Explainer(surrogate)
            self.explainers[model_id] = {
                'shap': explainer,
                'lime': lime.lime_tabular.LimeTabularExplainer(
                    lag_df.values, feature_names=lag_df.columns.tolist(), mode='regression'
                )
            }
        else:
            raise ValueError(f"Unsupported time series model type: {model_type}")
        
        return self.models[model_id]
    
    def create_classification_model(self, model_id: str, model_type: str, X: pd.DataFrame, 
                                    y: pd.Series, config: Dict = None) -> Dict:
        """Create a classification model.
        
        Args:
            model_id: Unique identifier for the model
            model_type: Type of classification model ('xgboost', 'random_forest', 'logistic')
            X: Feature DataFrame
            y: Target variable Series
            config: Dictionary of model-specific configuration parameters
            
        Returns:
            Dictionary containing the model and its metadata
        """
        logger.info(f"Creating classification model: {model_id} of type {model_type}")
        
        if model_id in self.models:
            logger.warning(f"Model {model_id} already exists. Overwriting.")
            
        if config is None:
            config = {}
            
        # Store training data for drift detection
        self.training_data[model_id] = X.copy()
        self.feature_names[model_id] = X.columns.tolist()
        
        # Create and train the model based on type
        if model_type == 'xgboost':
            model = XGBClassifier(**config)
            model.fit(X, y)
        elif model_type == 'random_forest':
            model = RandomForestClassifier(**config)
            model.fit(X, y)
        elif model_type == 'logistic':
            model = LogisticRegression(**config)
            model.fit(X, y)
        else:
            raise ValueError(f"Unsupported classification model type: {model_type}")
        
        # Store model and metadata
        self.models[model_id] = {
            'model': model,
            'type': model_type,
            'task': 'classification',
            'last_trained': datetime.now().isoformat()
        }
        
        # Create explainers
        explainer = shap.Explainer(model, X)
        self.explainers[model_id] = {
            'shap': explainer,
            'lime': lime.lime_tabular.LimeTabularExplainer(
                X.values, feature_names=X.columns.tolist(), class_names=y.unique().tolist(),
                mode='classification'
            )
        }
        
        return self.models[model_id]
    
    def create_regression_model(self, model_id: str, model_type: str, X: pd.DataFrame, 
                               y: pd.Series, config: Dict = None) -> Dict:
        """Create a regression model.
        
        Args:
            model_id: Unique identifier for the model
            model_type: Type of regression model ('xgboost', 'random_forest', 'linear')
            X: Feature DataFrame
            y: Target variable Series
            config: Dictionary of model-specific configuration parameters
            
        Returns:
            Dictionary containing the model and its metadata
        """
        logger.info(f"Creating regression model: {model_id} of type {model_type}")
        
        if model_id in self.models:
            logger.warning(f"Model {model_id} already exists. Overwriting.")
            
        if config is None:
            config = {}
            
        # Store training data for drift detection
        self.training_data[model_id] = X.copy()
        self.feature_names[model_id] = X.columns.tolist()
        
        # Create and train the model based on type
        if model_type == 'xgboost':
            model = XGBRegressor(**config)
            model.fit(X, y)
        elif model_type == 'random_forest':
            model = RandomForestRegressor(**config)
            model.fit(X, y)
        elif model_type == 'linear':
            model = LinearRegression(**config)
            model.fit(X, y)
        else:
            raise ValueError(f"Unsupported regression model type: {model_type}")
        
        # Store model and metadata
        self.models[model_id] = {
            'model': model,
            'type': model_type,
            'task': 'regression',
            'last_trained': datetime.now().isoformat()
        }
        
        # Create explainers
        explainer = shap.Explainer(model, X)
        self.explainers[model_id] = {
            'shap': explainer,
            'lime': lime.lime_tabular.LimeTabularExplainer(
                X.values, feature_names=X.columns.tolist(), mode='regression'
            )
        }
        
        return self.models[model_id]
    
    def predict(self, model_id: str, X: Union[pd.DataFrame, pd.Series, None] = None) -> np.ndarray:
        """Make predictions using the specified model.
        
        Args:
            model_id: Identifier of the model to use
            X: Input features or dates for prediction
            
        Returns:
            Numpy array of predictions
        """
        if model_id not in self.models:
            raise ValueError(f"Model {model_id} not found")
            
        model_info = self.models[model_id]
        model = model_info['model']
        
        if 'task' in model_info:
            # Classification or regression model
            if X is None:
                raise ValueError("Input features X must be provided for classification/regression models")
            return model.predict(X)
        else:
            # Time series model
            model_type = model_info['type']
            
            if model_type == 'prophet':
                return model_info['forecast']['yhat'].values
            elif model_type == 'arima':
                return model_info['forecast'].values
            elif model_type == 'lstm':
                return model_info['forecast']
    
    def explain_prediction(self, model_id: str, X: pd.DataFrame, 
                           method: str = 'shap', num_features: int = 10) -> Dict:
        """Generate explanations for model predictions.
        
        Args:
            model_id: Identifier of the model to explain
            X: Input features for the instance to explain
            method: Explanation metho