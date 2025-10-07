import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler, LabelEncoder
from app.core.config import settings

class CBSEFeatureEngineer:
    """Feature engineering specifically designed for CBSE academic data"""
    
    def __init__(self):
        self.scalers = {}
        self.encoders = {}
        self.feature_names = []
    
    def extract_features(self, student_data: Dict, academic_records: List[Dict]) -> np.ndarray:
        """Extract features from student and academic data"""
        features = {}
        
        # Student demographic features
        features.update(self._extract_student_features(student_data))
        
        # Academic performance features
        features.update(self._extract_academic_features(academic_records))
        
        # Temporal features
        features.update(self._extract_temporal_features(academic_records))
        
        # CBSE-specific features
        features.update(self._extract_cbse_features(student_data, academic_records))
        
        # Enhanced humanities features
        features.update(self._extract_humanities_features(academic_records))
        
        # Convert to feature vector
        return self._dict_to_vector(features)
    
    def _extract_student_features(self, student_data: Dict) -> Dict:
        """Extract features from student profile"""
        features = {}
        
        # Basic demographics
        features['current_class'] = student_data.get('current_class', 0)
        features['gender_encoded'] = self._encode_categorical('gender', student_data.get('gender', 'other'))
        
        # School type (inferred from school code)
        school_code = student_data.get('school_code', '')
        features['school_type'] = self._infer_school_type(school_code)
        
        # Academic year progression
        current_year = datetime.now().year
        academic_year = student_data.get('academic_year', f'{current_year}-{current_year+1}')
        features['academic_year_numeric'] = int(academic_year.split('-')[0])
        
        return features
    
    def _extract_academic_features(self, academic_records: List[Dict]) -> Dict:
        """Extract features from academic performance history"""
        features = {}
        
        if not academic_records:
            return self._get_default_academic_features()
        
        try:
            df = pd.DataFrame(academic_records)
            
            # Ensure numeric types
            df['score'] = pd.to_numeric(df['score'], errors='coerce')
            df['max_score'] = pd.to_numeric(df['max_score'], errors='coerce')
            
            df['percentage'] = (df['score'] / df['max_score']) * 100
        except Exception as e:
            print(f"Error creating DataFrame or percentage column: {str(e)}")
            return self._get_default_academic_features()
        
        # Overall performance metrics
        features['overall_avg'] = df['percentage'].mean()
        features['overall_std'] = df['percentage'].std()
        features['overall_min'] = df['percentage'].min()
        features['overall_max'] = df['percentage'].max()
        
        # Subject-wise performance
        subject_stats = df.groupby('subject')['percentage'].agg(['mean', 'std', 'count'])
        for subject in settings.CBSE_SUBJECTS:
            if subject in subject_stats.index:
                features[f'{subject.lower()}_avg'] = subject_stats.loc[subject, 'mean']
                features[f'{subject.lower()}_std'] = subject_stats.loc[subject, 'std']
                features[f'{subject.lower()}_count'] = subject_stats.loc[subject, 'count']
            else:
                features[f'{subject.lower()}_avg'] = 0
                features[f'{subject.lower()}_std'] = 0
                features[f'{subject.lower()}_count'] = 0
        
        # Exam type performance
        exam_type_stats = df.groupby('exam_type')['percentage'].mean()
        for exam_type in ['unit_test', 'mid_term', 'final', 'board', 'pre_board']:
            features[f'{exam_type}_avg'] = exam_type_stats.get(exam_type, 0)
        
        # Performance trends
        df['exam_date'] = pd.to_datetime(df['exam_date'])
        df_sorted = df.sort_values('exam_date')
        
        if len(df_sorted) >= 3:
            # Calculate trend using linear regression slope
            x = np.arange(len(df_sorted))
            y = df_sorted['percentage'].values
            slope = np.polyfit(x, y, 1)[0]
            features['performance_trend'] = slope
        else:
            features['performance_trend'] = 0
        
        # Consistency metrics
        features['consistency_score'] = 1 / (1 + features['overall_std'])  # Higher is more consistent
        
        return features
    
    def _extract_temporal_features(self, academic_records: List[Dict]) -> Dict:
        """Extract time-based features"""
        features = {}
        
        if not academic_records:
            return {'days_since_last_exam': 365, 'exam_frequency': 0}
        
        df = pd.DataFrame(academic_records)
        df['exam_date'] = pd.to_datetime(df['exam_date'])
        
        # Create percentage column
        df['score'] = pd.to_numeric(df['score'], errors='coerce')
        df['max_score'] = pd.to_numeric(df['max_score'], errors='coerce')
        df['percentage'] = (df['score'] / df['max_score']) * 100
        
        # Time since last exam
        last_exam_date = df['exam_date'].max()
        days_since_last = (datetime.now() - last_exam_date).days
        features['days_since_last_exam'] = min(days_since_last, 365)  # Cap at 1 year
        
        # Exam frequency (exams per month)
        date_range = (df['exam_date'].max() - df['exam_date'].min()).days
        if date_range > 0:
            features['exam_frequency'] = len(df) / (date_range / 30)  # exams per month
        else:
            features['exam_frequency'] = 0
        
        # Seasonal performance (month-wise)
        df['month'] = df['exam_date'].dt.month
        monthly_performance = df.groupby('month')['percentage'].mean()
        
        # Best and worst performing months
        if len(monthly_performance) > 0:
            features['best_month_performance'] = monthly_performance.max()
            features['worst_month_performance'] = monthly_performance.min()
        else:
            features['best_month_performance'] = 0
            features['worst_month_performance'] = 0
        
        return features
    
    def _extract_cbse_features(self, student_data: Dict, academic_records: List[Dict]) -> Dict:
        """Extract CBSE-specific features"""
        features = {}
        
        current_class = student_data.get('current_class', 0)
        
        # Class-specific features
        features['is_board_class'] = 1 if current_class in [10, 12] else 0
        features['class_difficulty_factor'] = self._get_class_difficulty(current_class)
        
        # Subject combination analysis
        if academic_records:
            df = pd.DataFrame(academic_records)
            
            # Create percentage column
            df['score'] = pd.to_numeric(df['score'], errors='coerce')
            df['max_score'] = pd.to_numeric(df['max_score'], errors='coerce')
            df['percentage'] = (df['score'] / df['max_score']) * 100
            
            subjects_taken = set(df['subject'].unique())
            
            # Science stream indicators
            science_subjects = {'Physics', 'Chemistry', 'Biology', 'Mathematics'}
            features['science_stream'] = 1 if science_subjects.issubset(subjects_taken) else 0
            
            # Commerce stream indicators
            commerce_subjects = {'Business Studies', 'Accountancy', 'Economics'}
            features['commerce_stream'] = 1 if commerce_subjects.issubset(subjects_taken) else 0
            
            # Subject diversity
            features['subject_diversity'] = len(subjects_taken)
            
            # Core vs elective performance
            core_subjects = {'Mathematics', 'English', 'Hindi'}
            core_scores = df[df['subject'].isin(core_subjects)]['percentage'].mean() if any(s in subjects_taken for s in core_subjects) else 0
            elective_scores = df[~df['subject'].isin(core_subjects)]['percentage'].mean() if len(subjects_taken - core_subjects) > 0 else 0
            
            features['core_subjects_avg'] = core_scores
            features['elective_subjects_avg'] = elective_scores
            features['core_elective_gap'] = core_scores - elective_scores
        else:
            features.update({
                'science_stream': 0, 'commerce_stream': 0, 'subject_diversity': 0,
                'core_subjects_avg': 0, 'elective_subjects_avg': 0, 'core_elective_gap': 0
            })
        
        return features
    
    def _get_default_academic_features(self) -> Dict:
        """Return default features when no academic records exist"""
        features = {
            'overall_avg': 0, 'overall_std': 0, 'overall_min': 0, 'overall_max': 0,
            'performance_trend': 0, 'consistency_score': 0
        }
        
        # Default subject averages
        for subject in settings.CBSE_SUBJECTS:
            features[f'{subject.lower()}_avg'] = 0
            features[f'{subject.lower()}_std'] = 0
            features[f'{subject.lower()}_count'] = 0
        
        # Default exam type averages
        for exam_type in ['unit_test', 'mid_term', 'final', 'board', 'pre_board']:
            features[f'{exam_type}_avg'] = 0
        
        return features
    
    def _encode_categorical(self, feature_name: str, value: str) -> int:
        """Encode categorical variables"""
        if feature_name not in self.encoders:
            self.encoders[feature_name] = LabelEncoder()
        
        try:
            return self.encoders[feature_name].transform([value])[0]
        except ValueError:
            # Handle unseen categories
            return 0
    
    def _infer_school_type(self, school_code: str) -> int:
        """Infer school type from school code"""
        if not school_code:
            return 0
        
        # Simple heuristic based on CBSE school codes
        if school_code.startswith('1'):
            return 1  # Government school
        elif school_code.startswith('2'):
            return 2  # Private school
        elif school_code.startswith('3'):
            return 3  # International school
        else:
            return 0  # Unknown
    
    def _get_class_difficulty(self, current_class: int) -> float:
        """Get difficulty factor for each class"""
        difficulty_map = {9: 0.6, 10: 1.0, 11: 0.8, 12: 1.0}
        return difficulty_map.get(current_class, 0.5)
    
    def _dict_to_vector(self, features: Dict) -> np.ndarray:
        """Convert feature dictionary to numpy array"""
        if not self.feature_names:
            self.feature_names = sorted(features.keys())
        
        # Ensure all expected features are present
        vector = []
        for feature_name in self.feature_names:
            value = features.get(feature_name, 0)
            # Handle NaN values
            if pd.isna(value):
                value = 0
            vector.append(float(value))
        
        return np.array(vector)
    
    def fit_scalers(self, feature_matrix: np.ndarray):
        """Fit scalers on training data"""
        self.scaler = StandardScaler()
        self.scaler.fit(feature_matrix)
    
    def transform_features(self, feature_matrix: np.ndarray) -> np.ndarray:
        """Scale features using fitted scaler"""
        if hasattr(self, 'scaler'):
            return self.scaler.transform(feature_matrix)
        return feature_matrix
    
    def _extract_humanities_features(self, academic_records: List[Dict]) -> Dict:
        """Extract enhanced features for humanities subjects"""
        features = {}
        
        if not academic_records:
            return features
            
        df = pd.DataFrame(academic_records)
        df['exam_date'] = pd.to_datetime(df['exam_date'])
        df['percentage'] = (df['score'] / df['max_score']) * 100
        
        # Define subject groups
        humanities = ['History', 'Geography', 'Economics', 'Political Science']
        languages = ['English', 'Hindi']
        
        # Language proficiency correlation with humanities
        for subject in humanities:
            subj_scores = df[df['subject'] == subject]
            if not subj_scores.empty:
                # Language performance correlation
                for lang in languages:
                    lang_scores = df[df['subject'] == lang]
                    if not lang_scores.empty:
                        # Synchronize dates for correlation
                        common_dates = set(subj_scores['exam_date']) & set(lang_scores['exam_date'])
                        if common_dates:
                            subj_aligned = subj_scores[subj_scores['exam_date'].isin(common_dates)]
                            lang_aligned = lang_scores[lang_scores['exam_date'].isin(common_dates)]
                            corr = np.corrcoef(subj_aligned['percentage'], lang_aligned['percentage'])[0, 1]
                            features[f'{subject.lower()}_{lang.lower()}_correlation'] = corr if not np.isnan(corr) else 0
                        else:
                            features[f'{subject.lower()}_{lang.lower()}_correlation'] = 0
                            
        # Temporal patterns for humanities
        for subject in humanities:
            subj_df = df[df['subject'] == subject]
            if len(subj_df) >= 3:
                # Monthly performance variation
                subj_df['month'] = subj_df['exam_date'].dt.month
                monthly_avg = subj_df.groupby('month')['percentage'].mean()
                features[f'{subject.lower()}_seasonal_variation'] = monthly_avg.std() if len(monthly_avg) > 1 else 0
                
                # Performance trend analysis
                sorted_scores = subj_df.sort_values('exam_date')
                x = np.arange(len(sorted_scores))
                y = sorted_scores['percentage'].values
                # Fit quadratic trend for better pattern capture
                coeffs = np.polyfit(x, y, 2)
                features[f'{subject.lower()}_trend_quadratic'] = coeffs[0]
                features[f'{subject.lower()}_trend_linear'] = coeffs[1]
                
                # Recent performance momentum (last 3 exams)
                recent_scores = sorted_scores.tail(3)['percentage'].values
                if len(recent_scores) == 3:
                    momentum = recent_scores[-1] - np.mean(recent_scores[:-1])
                    features[f'{subject.lower()}_recent_momentum'] = momentum
                else:
                    features[f'{subject.lower()}_recent_momentum'] = 0
                    
                # Performance stability
                features[f'{subject.lower()}_stability'] = 1 / (1 + subj_df['percentage'].std())
            else:
                features.update({
                    f'{subject.lower()}_seasonal_variation': 0,
                    f'{subject.lower()}_trend_quadratic': 0,
                    f'{subject.lower()}_trend_linear': 0,
                    f'{subject.lower()}_recent_momentum': 0,
                    f'{subject.lower()}_stability': 0
                })
                
        # Cross-subject performance patterns
        if len(humanities) > 1:
            humanities_scores = df[df['subject'].isin(humanities)]
            if not humanities_scores.empty:
                # Overall humanities performance metrics
                features['humanities_overall_avg'] = humanities_scores['percentage'].mean()
                features['humanities_overall_std'] = humanities_scores['percentage'].std()
                
                # Paired subject correlations
                for i, subj1 in enumerate(humanities[:-1]):
                    for subj2 in humanities[i+1:]:
                        subj1_scores = df[df['subject'] == subj1]
                        subj2_scores = df[df['subject'] == subj2]
                        if not subj1_scores.empty and not subj2_scores.empty:
                            common_dates = set(subj1_scores['exam_date']) & set(subj2_scores['exam_date'])
                            if common_dates:
                                s1_aligned = subj1_scores[subj1_scores['exam_date'].isin(common_dates)]
                                s2_aligned = subj2_scores[subj2_scores['exam_date'].isin(common_dates)]
                                corr = np.corrcoef(s1_aligned['percentage'], s2_aligned['percentage'])[0, 1]
                                features[f'{subj1.lower()}_{subj2.lower()}_correlation'] = corr if not np.isnan(corr) else 0
                            else:
                                features[f'{subj1.lower()}_{subj2.lower()}_correlation'] = 0
        
        return features
    
    def get_feature_names(self) -> List[str]:
        """Get list of feature names"""
        return self.feature_names.copy()