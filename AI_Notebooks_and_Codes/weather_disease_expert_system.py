import json
import requests
import numpy as np
import joblib


# Load rules from JSON

with open("disease_db.json") as f:
    DISEASE_DB = json.load(f)

with open("yield_rules.json") as f:
    YIELD_RULES = json.load(f)


# Fetch weather from API

def fetch_weather_by_location(city, state=None, country=None, api_key=None):
    location = city
    if state:
        location += f",{state}"
    if country:
        location += f",{country}"
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}&units=metric"
    response = requests.get(url)
    data = response.json()
    if data.get("cod") != 200:
        raise ValueError(f"Weather API error: {data.get('message')}")
    return {
        "temp": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "rain": data.get("rain", {}).get("1h", 0),
        "wind": data["wind"]["speed"]
    }


# Compute disease risks

def compute_disease_risks(crop, weather, soil=None):
    results = []
    diseases = DISEASE_DB[crop]

    for disease in diseases:
        triggers = disease["triggers"]
        risk = "LOW"
        reasons = []

        effective_rain = weather.get("rain", 0)
        effective_humidity = weather.get("humidity", 0)

        # Use ML weather to adjust effective values
        if weather.get("ml_weather") == "rain":
            effective_rain += 5
            effective_humidity += 5
        elif weather.get("ml_weather") == "drizzle":
            effective_rain += 2
            effective_humidity += 2

        # Temperature
        if triggers["temp_min"] <= weather["temp"] <= triggers["temp_max"]:
            reasons.append("Temperature in risky range")
        # Humidity
        if effective_humidity >= triggers["humidity"]:
            reasons.append("High humidity favors disease")
        # Rain
        if effective_rain >= triggers["rain"]:
            reasons.append("Rainfall sufficient for disease development")
        # Soil
        if soil and soil.get("drainage") == "poor" and "Wet soil" in triggers.get("notes", []):
            reasons.append("Poor soil drainage increases risk")

        if len(reasons) >= 3:
            risk = "HIGH"
        elif len(reasons) == 2:
            risk = "MEDIUM"

        results.append({
            "crop": crop,
            "disease": disease["name"],
            "risk": risk,
            "confidence": round(len(reasons)/3, 2),
            "reasons": reasons
        })
    return results

# Compute yield prediction

def compute_yield_prediction(crop, weather):
    rules = YIELD_RULES[crop]
    yield_change = "same"
    percent_change = 0

    for rule in rules:
        temp = weather["temp"]
        humidity = weather["humidity"]
        rain = weather["rain"]
        ml_weather = weather.get("ml_weather")

        match = True
        if "temp_min" in rule and not (rule["temp_min"] <= temp <= rule.get("temp_max", temp)):
            match = False
        if "humidity_min" in rule and humidity < rule["humidity_min"]:
            match = False
        if "humidity_max" in rule and humidity > rule["humidity_max"]:
            match = False
        if "rain_min" in rule and rain < rule["rain_min"]:
            match = False
        if "rain_max" in rule and rain > rule.get("rain_max", rain):
            match = False
        if "ml_weather" in rule and ml_weather != rule["ml_weather"]:
            match = False

        if match:
            yield_change = rule["yield_change"]
            percent_change = rule.get("percent_change", 0)
            break

    return {
        "yield_change": yield_change,
        "percent_change": percent_change
    }


# Main program

if __name__ == "__main__":
    api_key = "38feeab1a8dad7ad10354b2d95a80066"  
    crop = input("Enter crop name: ").strip()
    city = input("Enter city name: ").strip()
    state = input("Enter state (optional, Enter to skip): ").strip() or None
    country = input("Enter country (optional, Enter to skip): ").strip() or None

    # Optional soil
    soil_input = input("Enter soil drainage (poor/moderate/good, optional): ").strip() or None
    soil = {"drainage": soil_input} if soil_input else None

    # Fetch API weather
    weather = fetch_weather_by_location(city, state, country, api_key)

    
    # Load ML weather model
    
    rf_model = joblib.load("weather_rf_model.joblib")
    label_encoder = joblib.load("weather_label_encoder.joblib")

    # Prepare ML features
    ml_features = np.array([[weather.get("rain",0), weather["temp"], weather["temp"], weather["wind"]]])  # example encoding
    ml_label_enc = rf_model.predict(ml_features)
    ml_label_prob = rf_model.predict_proba(ml_features).max()

    weather["ml_weather"] = label_encoder.inverse_transform(ml_label_enc)[0]
    weather["ml_weather_prob"] = ml_label_prob

    
    # Compute disease and yield
    
    disease_results = compute_disease_risks(crop, weather, soil)
    yield_result = compute_yield_prediction(crop, weather)

   
    print("\n===== WEATHER RESULT=====")

    print (weather)
    print("\n===== HYBRID DISEASE RISK REPORT =====")
    print(f"ML Weather Prediction: {weather['ml_weather']} (confidence {weather['ml_weather_prob']:.2f})\n")
    for res in disease_results:
        print(res)

    print("\n===== YIELD PREDICTION =====")
    print(yield_result)



