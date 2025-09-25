
// Results page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get stored data
    const bmiData = JSON.parse(sessionStorage.getItem('bmiData'));
    const bmiResult = JSON.parse(sessionStorage.getItem('bmiResult'));
    
    if (!bmiData || !bmiResult) {
        // Redirect to calculator if no data
        window.location.href = 'index.html';
        return;
    }
    
    // Display BMI results
    displayBMIResults(bmiResult);
    
    // Generate and display recommendations
    displayRecommendations(bmiResult, bmiData.age, bmiData.gender);
    
    // Generate and display health tips
    displayHealthTips(bmiResult);
    
    // Generate and display diet recommendations
    displayDietRecommendations(bmiResult);
    
    // Generate and display exercise recommendations
    displayExerciseRecommendations(bmiResult);
    
    // Back button handler
    document.getElementById('backBtn').addEventListener('click', function() {
        sessionStorage.removeItem('bmiData');
        sessionStorage.removeItem('bmiResult');
        window.location.href = 'index.html';
    });
});

function displayBMIResults(result) {
    document.getElementById('bmiValue').textContent = result.bmi.toFixed(1);
    document.getElementById('bmiCategory').textContent = result.category;
    
    const statusBadge = document.getElementById('bmiStatus');
    statusBadge.textContent = result.status;
    statusBadge.style.background = result.bgColor;
    statusBadge.style.color = result.textColor;
}

function displayRecommendations(categoryData, age, gender) {
    const recommendations = generateRecommendations(categoryData, age, gender);
    const container = document.getElementById('recommendationsContent');
    
    container.innerHTML = `
        <div class="recommendation-item">
            <div class="recommendation-header">
                <div class="recommendation-icon">
                    <i class="${recommendations.icon}"></i>
                </div>
                <h4>${recommendations.title}</h4>
            </div>
            <ul class="recommendation-list">
                ${recommendations.items.map(item => `
                    <li>
                        <i class="fas fa-check"></i>
                        <span>${item}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}

function displayHealthTips(categoryData) {
    const healthTips = generateHealthTips(categoryData);
    const container = document.getElementById('healthTips');
    
    container.innerHTML = healthTips.map(tip => `
        <div class="tip-item">
            <img src="${tip.image}" alt="${tip.title}" class="tip-image" 
                 onerror="this.src='https://via.placeholder.com/400x200/8b5cf6/ffffff?text=${encodeURIComponent(tip.title)}'">
            <div class="tip-header">
                <i class="${tip.icon} tip-icon"></i>
                <h4 class="tip-title">${tip.title}</h4>
            </div>
            <p class="tip-description">${tip.description}</p>
        </div>
    `).join('');
}

function displayDietRecommendations(categoryData) {
    const dietRecommendations = generateDietRecommendations(categoryData);
    const container = document.getElementById('dietRecommendations');
    
    container.innerHTML = dietRecommendations.map(category => `
        <div class="diet-category">
            <div class="category-header">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <h4 class="category-title">${category.title}</h4>
            </div>
            <ul class="category-list">
                ${category.items.map(item => `
                    <li>
                        <i class="fas fa-check"></i>
                        <span>${item}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

function displayExerciseRecommendations(categoryData) {
    const exerciseRecommendations = generateExerciseRecommendations(categoryData);
    const container = document.getElementById('exerciseRecommendations');
    
    container.innerHTML = exerciseRecommendations.map(category => `
        <div class="exercise-category">
            <div class="category-header">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <h4 class="category-title">${category.title}</h4>
            </div>
            <ul class="category-list">
                ${category.items.map(item => `
                    <li>
                        <i class="fas fa-check"></i>
                        <span>${item}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

function generateRecommendations(categoryData, age, gender) {
    const recommendations = {
        'Underweight': {
            icon: 'fas fa-arrow-up',
            title: 'Weight Gain Recommendations',
            items: [
                'Add 300-500 healthy calories daily for gradual weight gain',
                'Eat 5-6 smaller meals throughout the day instead of 3 large ones',
                'Include nuts, nut butters, avocados, and olive oil for healthy fats',
                'Choose protein-rich foods: lean meats, fish, eggs, dairy products',
                'Exercise: 150 minutes moderate-intensity + 2+ days strength training',
                'Focus on muscle-building exercises with proper nutrition support'
            ]
        },
        'Normal Weight': {
            icon: 'fas fa-check-circle',
            title: 'Healthy Weight Maintenance',
            items: [
                'Eat 5+ portions of fruits and vegetables daily (≥400g)',
                'Fill 50% of plate with vegetables/fruits, 25% lean proteins, 25% whole grains',
                'Limit processed foods and keep free sugars under 10% of total calories',
                'Stay hydrated with water as your primary beverage',
                'Exercise: 150-300 minutes moderate OR 75-150 minutes vigorous activity weekly',
                'Include 2+ days of strength training targeting all major muscle groups'
            ]
        },
        'Overweight': {
            icon: 'fas fa-arrow-down',
            title: 'Weight Management Plan',
            items: [
                'Create 500-750 calorie daily deficit for 1-2 pounds weekly loss',
                'Increase protein to 0.8-1.5g per kg ideal body weight',
                'Choose low glycemic index carbohydrates and high-fiber foods',
                'Consider Mediterranean or DASH diet patterns',
                'Exercise: 200-300 minutes moderate-intensity weekly for weight maintenance',
                'Add 2+ days strength training to preserve muscle mass during weight loss'
            ]
        },
        'Obese': {
            icon: 'fas fa-exclamation-triangle',
            title: 'Comprehensive Health Improvement',
            items: [
                'Consult healthcare provider for supervised weight loss program',
                'Target 5-10% weight loss through structured meal plans',
                'Consider low-carb (<45% calories) or low-fat (<30% calories) approaches',
                'Join behavioral programs with 16+ sessions over 6 months',
                'Exercise: Start with 150+ minutes, progress to 250+ minutes weekly',
                'Include strength training 2+ days to maintain muscle and metabolic rate'
            ]
        }
    };
    
    return recommendations[categoryData.category] || recommendations['Normal Weight'];
}

function generateHealthTips(categoryData) {
    const baseTips = [
        {
            title: 'Smart Food Choices',
            description: 'Prioritize whole foods over processed options. Include lean proteins, complex carbs, and healthy fats in your meals.',
            image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
            icon: 'fas fa-apple-alt'
        },
        {
            title: 'Exercise Schedule',
            description: 'Combine cardio (150+ minutes/week) with strength training (2+ days/week) for optimal health benefits.',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
            icon: 'fas fa-dumbbell'
        },
        {
            title: 'Recovery & Sleep',
            description: 'Get 7-9 hours of quality sleep nightly to support metabolism, recovery, and weight management.',
            image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
            icon: 'fas fa-bed'
        }
    ];
    
    const categorySpecificTips = {
        'Underweight': [
            {
                title: 'Nutrient-Dense Calories',
                description: 'Add healthy fats like nuts, seeds, avocados, and olive oil. Include protein-rich smoothies and frequent meals.',
                image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
                icon: 'fas fa-seedling'
            },
            {
                title: 'Strength Building',
                description: 'Focus on resistance exercises to build muscle mass. Start with bodyweight exercises and progress gradually.',
                image: 'https://images.unsplash.com/photo-1517963628607-235ccdd5476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
                icon: 'fas fa-dumbbell'
            }
        ],
        'Normal Weight': [
            {
                title: 'Maintain Balance',
                description: 'Keep your current healthy habits. Eat varied foods from all food groups and stay consistently active.',
                image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
                icon: 'fas fa-balance-scale'
            }
        ],
        'Overweight': [
            {
                title: 'Portion Management',
                description: 'Use smaller plates, measure portions, and practice mindful eating. Focus on vegetables and lean proteins.',
                image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
                icon: 'fas fa-balance-scale'
            },
            {
                title: 'Active Lifestyle',
                description: 'Increase daily activity to 200-300 minutes/week. Try brisk walking, swimming, or cycling.',
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
                icon: 'fas fa-walking'
            }
        ],
        'Obese': [
            {
                title: 'Professional Guidance',
                description: 'Work with healthcare providers for supervised programs. Consider structured meal plans and behavioral support.',
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
                icon: 'fas fa-user-md'
            },
            {
                title: 'Gradual Progress',
                description: 'Start with low-impact activities like walking. Gradually increase to 250+ minutes/week as fitness improves.',
                image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
                icon: 'fas fa-chart-line'
            }
        ]
    };
    
    const categoryTips = categorySpecificTips[categoryData.category] || [];
    return [...baseTips, ...categoryTips];
}

function generateDietRecommendations(categoryData) {
    const dietRecommendations = {
        'Underweight': [
            {
                title: 'Protein-Rich Foods',
                icon: 'fas fa-drumstick-bite',
                items: [
                    'Lean meats, fish, and poultry (3-4 servings daily)',
                    'Eggs and dairy products (2-3 servings daily)',
                    'Legumes, beans, and lentils',
                    'Protein smoothies with fruits and nuts',
                    'Greek yogurt with granola and berries'
                ]
            },
            {
                title: 'Healthy Calorie Sources',
                icon: 'fas fa-seedling',
                items: [
                    'Nuts, seeds, and nut butters (1-2 oz daily)',
                    'Avocados and olive oil',
                    'Whole grain cereals and breads',
                    'Dried fruits and fresh fruit smoothies',
                    'Healthy snacks between meals'
                ]
            }
        ],
        'Normal Weight': [
            {
                title: 'Balanced Nutrition',
                icon: 'fas fa-balance-scale',
                items: [
                    '5+ servings of fruits and vegetables daily',
                    'Whole grains over refined carbohydrates',
                    'Lean proteins at every meal',
                    'Healthy fats in moderation',
                    'Stay hydrated with 8+ glasses of water daily'
                ]
            }
        ],
        'Overweight': [
            {
                title: 'Portion Control',
                icon: 'fas fa-utensils',
                items: [
                    'Use smaller plates and bowls',
                    'Fill half your plate with vegetables',
                    'Choose lean proteins (fish, chicken, tofu)',
                    'Limit refined sugars and processed foods',
                    'Eat slowly and mindfully'
                ]
            },
            {
                title: 'Low-Calorie Foods',
                icon: 'fas fa-apple-alt',
                items: [
                    'Leafy greens and non-starchy vegetables',
                    'Fresh fruits instead of fruit juices',
                    'Whole grains in smaller portions',
                    'Low-fat dairy products',
                    'Herbal teas and water for hydration'
                ]
            }
        ],
        'Obese': [
            {
                title: 'Structured Meal Plan',
                icon: 'fas fa-calendar-alt',
                items: [
                    'Plan meals and snacks in advance',
                    'Track calorie intake with apps or journals',
                    'Prepare healthy meals at home',
                    'Avoid emotional eating triggers',
                    'Consider working with a registered dietitian'
                ]
            },
            {
                title: 'Medical Nutrition Support',
                icon: 'fas fa-user-md',
                items: [
                    'Consult healthcare provider for meal plans',
                    'Consider medically supervised programs',
                    'Monitor blood sugar and cholesterol levels',
                    'Join support groups for accountability',
                    'Focus on sustainable lifestyle changes'
                ]
            }
        ]
    };
    
    return dietRecommendations[categoryData.category] || dietRecommendations['Normal Weight'];
}

function generateExerciseRecommendations(categoryData) {
    const exerciseRecommendations = {
        'Underweight': [
            {
                title: 'Strength Training',
                icon: 'fas fa-dumbbell',
                items: [
                    'Weightlifting 3-4 times per week',
                    'Focus on compound movements (squats, deadlifts)',
                    'Progressive overload for muscle growth',
                    'Rest 48-72 hours between muscle group workouts',
                    'Consider working with a personal trainer'
                ]
            },
            {
                title: 'Moderate Cardio',
                icon: 'fas fa-heart',
                items: [
                    'Light to moderate cardio (avoid excessive)',
                    'Walking or light jogging 20-30 minutes',
                    'Swimming for low-impact exercise',
                    'Yoga for flexibility and stress relief',
                    'Focus more on strength than cardio'
                ]
            }
        ],
        'Normal Weight': [
            {
                title: 'Balanced Exercise',
                icon: 'fas fa-running',
                items: [
                    '150-300 minutes moderate cardio per week',
                    'Strength training 2+ days per week',
                    'Include flexibility and mobility work',
                    'Try different activities to stay motivated',
                    'Listen to your body and rest when needed'
                ]
            }
        ],
        'Overweight': [
            {
                title: 'Cardio Focus',
                icon: 'fas fa-running',
                items: [
                    'Brisk walking 30-45 minutes daily',
                    'Swimming or water aerobics',
                    'Cycling or stationary bike',
                    'Dance classes or Zumba',
                    'Gradually increase intensity and duration'
                ]
            },
            {
                title: 'Strength Training',
                icon: 'fas fa-dumbbell',
                items: [
                    'Resistance exercises 2-3 times per week',
                    'Start with bodyweight exercises',
                    'Use resistance bands or light weights',
                    'Focus on major muscle groups',
                    'Maintain muscle mass during weight loss'
                ]
            }
        ],
        'Obese': [
            {
                title: 'Low-Impact Cardio',
                icon: 'fas fa-walking',
                items: [
                    'Start with 10-15 minutes of walking',
                    'Water exercises and swimming',
                    'Chair exercises if mobility is limited',
                    'Gradually progress to 150+ minutes per week',
                    'Focus on consistency over intensity'
                ]
            },
            {
                title: 'Supervised Programs',
                icon: 'fas fa-user-md',
                items: [
                    'Work with exercise physiologist or trainer',
                    'Join medically supervised fitness programs',
                    'Consider physical therapy if needed',
                    'Monitor heart rate and blood pressure',
                    'Set realistic, achievable goals'
                ]
            }
        ]
    };
    
    return exerciseRecommendations[categoryData.category] || exerciseRecommendations['Normal Weight'];
}
