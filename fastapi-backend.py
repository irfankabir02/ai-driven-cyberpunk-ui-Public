from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Union
import pandas as pd
import numpy as np
import joblib
import json
import shap
import lime
import lime.lime_tabular
from datetime import datetime
import asyncio
from fastapi.responses import JSONResponse

# Initialize FastAPI app
app = FastAPI(title="AI-Powered Predictive Dashboard API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models from disk
models = {}
model_info = {}

# Track model performance and drift
performance_metrics = {}
drift_detected = {}
retraining_status = {}

# In-memory cache for frequently requested explanations
explanation_cache = {}

# Pydantic models for request validation
class PredictionRequest(BaseModel):
    model_id: str
    features: Dict[str, Any]
    explanation_method: Optional[str] = "shap"
    num_features: Optional[int] = 10

class BatchPredictionRequest(BaseModel):
    model_id: str
    data: List[Dict[str, Any]]
    explanation_method: Optional[str] = None

class ModelDriftReport(BaseModel):
    model_id: str
    metric: str
    current_value: float
    threshold: float
    timestamp: datetime

# Helper functions
def load_model(model_id: str):
    """Load model if not already in memory"""
    if model_id not in models:
        try:
            # Load model and metadata
            models[model_id] = joblib.load(f"models/{model_id}/model.joblib")
            with open(f"models/{model_id}/info.json", "r") as f:
                model_info[model_id] = json.load(f)
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Model {model_id} not found: {str(e)}")
    return models[model_id]

async def generate_shap_explanation(model, features, num_features=10):
    """Generate SHAP-based explanation"""
    # Convert dictionary to DataFrame for SHAP
    df = pd.DataFrame([features])
    
    # Create explainer based on model type
    explainer = shap.Explainer(model)
    shap_values = explainer(df)
    
    # Get feature importance values
    feature_importance = {}
    for i, col in enumerate(df.columns):
        feature_importance[col] = abs(shap_values.values[0][i])
    
    # Sort and get top features
    sorted_features = dict(sorted(feature_importance.items(), 
                                  key=lambda item: abs(item[1]), 
                                  reverse=True)[:num_features])
    
    return {
        "feature_importance": sorted_features,
        "shap_values": shap_values.values[0].tolist(),
        "base_value": shap_values.base_values[0].tolist() if hasattr(shap_values, 'base_values') else 0,
    }

async def generate_lime_explanation(model, features, num_features=10):
    """Generate LIME-based explanation"""
    # Convert dictionary to DataFrame
    df = pd.DataFrame([features])
    
    # Create a training dataset for the explainer (in production, use a sample of your training data)
    # Here we're just using the input as both training and testing which is not ideal
    training_data = df.copy()
    
    # Initialize LIME explainer
    explainer = lime.lime_tabular.LimeTabularExplainer(
        training_data=training_data.values,
        feature_names=training_data.columns.tolist(),
        mode="regression" if model_info.get("task") == "regression" else "classification"
    )
    
    # Generate explanation
    exp = explainer.explain_instance(
        df.values[0], 
        model.predict, 
        num_features=num_features
    )
    
    # Extract feature importance
    feature_importance = {}
    for feature, importance in exp.as_list():
        feature_importance[feature] = importance
    
    return {
        "feature_importance": feature_importance,
        "intercept": exp.intercept[0],
        "prediction": exp.predicted_value
    }

async def check_for_drift(model_id, new_data):
    """Check if model is experiencing drift based on recent predictions"""
    # Simple implementation - in production use more sophisticated methods
    if len(new_data) < 100:  # Need enough data to detect drift
        return False
        
    # Compare recent prediction distribution with historical
    current_mean = np.mean(new_data)
    current_std = np.std(new_data)
    
    # Load historical stats (in production, retrieve from database)
    historical_mean = model_info[model_id].get("historical_mean", current_mean)
    historical_std = model_info[model_id].get("historical_std", current_std)
    
    # Check if current distribution is significantly different
    z_score_mean = abs(current_mean - historical_mean) / historical_std
    drift_threshold = 3.0  # 3 sigma rule
    
    if z_score_mean > drift_threshold:
        drift_detected[model_id] = True
        return True
    
    return False

async def retrain_model_if_needed(background_tasks, model_id):
    """Trigger model retraining if drift is detected"""
    if drift_detected.get(model_id, False) and not retraining_status.get(model_id, False):
        retraining_status[model_id] = True
        background_tasks.add_task(retrain_model, model_id)

async def retrain_model(model_id):
    """Background task to retrain model"""
    try:
        # In a real system, this would call your ML training pipeline
        print(f"Retraining model {model_id} due to detected drift")
        
        # Simulate retraining delay
        await asyncio.sleep(10)
        
        # Update the model (in production, this would load the newly trained model)
        models[model_id] = joblib.load(f"models/{model_id}/model.joblib")
        
        # Reset drift flags
        drift_detected[model_id] = False
        retraining_status[model_id] = False
        
        # Log retraining event
        performance_metrics.setdefault(model_id, []).append({
            "event": "retraining_completed",
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error retraining model {model_id}: {str(e)}")
        retraining_status[model_id] = False

# API Endpoints
@app.get("/")
async def root():
    return {"message": "AI-Powered Predictive Dashboard API"}

@app.get("/models")
async def list_models():
    """List all available models with their metadata"""
    return {model_id: info for model_id, info in model_info.items()}

@app.get("/models/{model_id}")
async def get_model_info(model_id: str):
    """Get detailed information about a specific model"""
    if model_id not in model_info:
        try:
            load_model(model_id)
        except HTTPException:
            raise HTTPException(status_code=404, detail=f"Model {model_id} not found")
    
    return model_info[model_id]

@app.post("/predict")
async def predict(
    request: PredictionRequest, 
    background_tasks: BackgroundTasks
):
    """Make prediction with a single data point and optionally return explanation"""
    model_id = request.model_id
    features = request.features
    
    # Load model
    model = load_model(model_id)
    
    # Make prediction
    df = pd.DataFrame([features])
    prediction = model.predict(df)[0]
    
    # Track predictions for drift detection
    performance_metrics.setdefault(model_id, {}).setdefault("recent_predictions", []).append(prediction)
    
    # Check if we need explanation
    explanation = None
    cache_key = f"{model_id}_{json.dumps(features)}_{request.explanation_method}_{request.num_features}"
    
    if request.explanation_method:
        # Check cache first
        if cache_key in explanation_cache:
            explanation = explanation_cache[cache_key]
        else:
            # Generate explanation based on method
            if request.explanation_method.lower() == "shap":
                explanation = await generate_shap_explanation(model, features, request.num_features)
            elif request.explanation_method.lower() == "lime":
                explanation = await generate_lime_explanation(model, features, request.num_features)
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported explanation method: {request.explanation_method}")
            
            # Cache the explanation
            explanation_cache[cache_key] = explanation
    
    # Check for drift in background
    recent_predictions = performance_metrics.get(model_id, {}).get("recent_predictions", [])
    if len(recent_predictions) >= 100:
        background_tasks.add_task(check_for_drift, model_id, recent_predictions)
        # If drift is detected, retrain in background
        if drift_detected.get(model_id, False):
            background_tasks.add_task(retrain_model_if_needed, background_tasks, model_id)
    
    # Return prediction and explanation
    return {
        "model_id": model_id,
        "prediction": float(prediction) if isinstance(prediction, (float, int, np.number)) else prediction,
        "explanation": explanation,
        "drift_detected": drift_detected.get(model_id, False),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/batch-predict")
async def batch_predict(request: BatchPredictionRequest):
    """Make predictions with batch data"""
    model_id = request.model_id
    data = request.data
    
    # Load model
    model = load_model(model_id)
    
    # Convert to DataFrame
    df = pd.DataFrame(data)
    
    # Make predictions
    predictions = model.predict(df).tolist()
    
    # Add predictions to performance tracking
    performance_metrics.setdefault(model_id, {}).setdefault("recent_predictions", []).extend(predictions)
    
    return {
        "model_id": model_id,
        "predictions": predictions,
        "count": len(predictions),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/performance/{model_id}")
async def get_model_performance(model_id: str):
    """Get performance metrics for a model"""
    if model_id not in performance_metrics:
        raise HTTPException(status_code=404, detail=f"No performance data for model {model_id}")
    
    return {
        "model_id": model_id,
        "metrics": performance_metrics[model_id],
        "drift_detected": drift_detected.get(model_id, False),
        "retraining_status": retraining_status.get(model_id, False)
    }

@app.post("/report-drift")
async def report_drift(report: ModelDriftReport, background_tasks: BackgroundTasks):
    """Report drift from external monitoring systems"""
    model_id = report.model_id
    
    # Update drift status
    if report.current_value > report.threshold:
        drift_detected[model_id] = True
        
        # Queue retraining if needed
        background_tasks.add_task(retrain_model_if_needed, background_tasks, model_id)
    
    # Log the report
    performance_metrics.setdefault(model_id, {}).setdefault("drift_reports", []).append({
        "metric": report.metric,
        "value": report.current_value,
        "threshold": report.threshold,
        "timestamp": report.timestamp.isoformat()
    })
    
    return {
        "status": "received",
        "action": "retraining" if drift_detected.get(model_id, False) else "monitoring"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
