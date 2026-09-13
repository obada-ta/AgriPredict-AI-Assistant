# expert_system.py
from experta import *

class LandParameters(Fact):
    pass

class LandSuitabilityExpertSystem(KnowledgeEngine):
    def __init__(self, user_inputs):
        super().__init__()
        self.user_inputs = user_inputs or {}  # Handle None input
        
        # Parameter weights (must sum to 1.0)
        self.weights = {
            'sand': 0.15, 'clay': 0.15, 'silt': 0.15, 'ph': 0.20,
            'organic_matter': 0.10, 'nitrogen': 0.05, 'phosphorus': 0.05,
            'potassium': 0.05, 'drainage': 0.05, 'slope': 0.02,
            'elevation': 0.01, 'sun_exposure': 0.01, 'pollution': 0.01
        }
        
        # Initialize scoring
        self.parameter_scores = {}
        self.total_score = 0.0
        self.max_possible_score = sum(self.weights.values())
        self.critical_failure = False

    def evaluate_parameter(self, param, value, optimal_range, unacceptable_ranges):
        """Safe parameter evaluation with fallbacks"""
        try:
            # Handle missing values
            if value is None:
                self.parameter_scores[param] = {
                    'value': None,
                    'score': 0.0,
                    'optimal_range': str(optimal_range),
                    'error': 'Missing value'
                }
                return
            
            # String parameters (drainage, sun_exposure, pollution)
            if isinstance(optimal_range, str):
                score = 1.0 if value == optimal_range else (
                    0.7 if value in unacceptable_ranges else 0.3)
            
            # Numeric parameters
            else:
                value = float(value)
                if optimal_range[0] <= value <= optimal_range[1]:
                    score = 1.0
                elif (unacceptable_ranges[0][0] <= value < optimal_range[0] or 
                      optimal_range[1] < value <= unacceptable_ranges[0][1]):
                    score = 0.7
                else:
                    score = 0.3
            
            # Store results
            self.parameter_scores[param] = {
                'value': value,
                'score': score,
                'optimal_range': optimal_range
            }
            
            # Calculate weighted score
            weight = self.weights.get(param, 0.0)
            self.total_score += score * weight
            
            # Check critical parameters
            if param in ['ph', 'drainage', 'pollution'] and score <= 0.3:
                self.critical_failure = True
                
        except Exception as e:
            print(f"Parameter evaluation failed for {param}: {str(e)}")
            self.parameter_scores[param] = {
                'value': value,
                'score': 0.0,
                'optimal_range': str(optimal_range),
                'error': str(e)
            }

    def final_result(self):
        """NEW: Force percentage to match category ranges"""
        if self.critical_failure:
            return {
                "suitability": "Not Suitable (Critical Failure)",
                "suitabilityPercentage": 0.0,
                "parameters": self.parameter_scores
            }
        
        try:
            # Calculate raw percentage
            raw_percentage = (self.total_score / self.max_possible_score) * 100
            raw_percentage = max(0.0, min(100.0, raw_percentage))
            
            # NEW: Assign fixed percentages based on category
            if raw_percentage >= 80:
                category = "Highly Suitable"
                percentage = 90  # Fixed value for highly suitable
            elif raw_percentage >= 60:
                category = "Moderately Suitable"
                percentage = 70  # Fixed value for moderately suitable
            elif raw_percentage >= 40:
                category = "Marginally Suitable"
                percentage = 50  # Fixed value for marginally suitable
            else:
                category = "Not Suitable"
                percentage = 20  # Fixed value for not suitable
                
        except:
            category = "Calculation Error"
            percentage = 0.0
        
        return {
            "suitability": category,
            "suitabilityPercentage": percentage,
            "parameters": self.parameter_scores
        }


    def run_engine(self):
        """Execute rules with full error handling"""
        try:
            self.reset()
            
            # Ensure all expected parameters exist
            input_params = {k: self.user_inputs.get(k) for k in self.weights.keys()}
            self.declare(LandParameters(**input_params))
            
            self.run()
            return self.final_result()
        except Exception as e:
            print(f"Engine failed: {str(e)}")
            return {
                "suitability": "Calculation Error",
                "suitabilityPercentage": 0.0,
                "error": str(e)
            }

    # Rule definitions - must match input parameter names exactly
    @Rule(LandParameters(sand=MATCH.sand))
    def rule_sand(self, sand): self.evaluate_parameter('sand', sand, (40,60), [(30,70)])
    
    @Rule(LandParameters(clay=MATCH.clay))
    def rule_clay(self, clay): self.evaluate_parameter('clay', clay, (20,40), [(10,50)])
    
    @Rule(LandParameters(silt=MATCH.silt))
    def rule_silt(self, silt): self.evaluate_parameter('silt', silt, (20,40), [(10,50)])
    
    @Rule(LandParameters(ph=MATCH.ph))
    def rule_ph(self, ph): self.evaluate_parameter('ph', ph, (6.0,7.0), [(5.5,7.5)])
    
    @Rule(LandParameters(organic_matter=MATCH.organic_matter))
    def rule_organic_matter(self, organic_matter): 
        self.evaluate_parameter('organic_matter', organic_matter, (2.0,4.0), [(0.5,5.0)])
    
    @Rule(LandParameters(nitrogen=MATCH.nitrogen))
    def rule_nitrogen(self, nitrogen): 
        self.evaluate_parameter('nitrogen', nitrogen, (50,100), [(20,50)])
    
    @Rule(LandParameters(phosphorus=MATCH.phosphorus))
    def rule_phosphorus(self, phosphorus): 
        self.evaluate_parameter('phosphorus', phosphorus, (20,50), [(10,20)])
    
    @Rule(LandParameters(potassium=MATCH.potassium))
    def rule_potassium(self, potassium): 
        self.evaluate_parameter('potassium', potassium, (100,200), [(50,100)])
    
    @Rule(LandParameters(drainage=MATCH.drainage))
    def rule_drainage(self, drainage): 
        self.evaluate_parameter('drainage', drainage, 'good', ['moderate'])
    
    @Rule(LandParameters(slope=MATCH.slope))
    def rule_slope(self, slope): 
        self.evaluate_parameter('slope', slope, (0,5), [(5,15)])
    
    @Rule(LandParameters(elevation=MATCH.elevation))
    def rule_elevation(self, elevation): 
        self.evaluate_parameter('elevation', elevation, (0,300), [(300,500)])
    
    @Rule(LandParameters(sun_exposure=MATCH.sun_exposure))
    def rule_sun_exposure(self, sun_exposure): 
        self.evaluate_parameter('sun_exposure', sun_exposure, 'high', ['moderate'])
    
    @Rule(LandParameters(pollution=MATCH.pollution))
    def rule_pollution(self, pollution): 
        self.evaluate_parameter('pollution', pollution, 'low', ['moderate'])