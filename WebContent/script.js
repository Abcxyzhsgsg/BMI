
// BMI Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bmiForm');
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const age = parseInt(document.getElementById('age').value) || null;
        const gender = document.getElementById('gender').value || null;
        
        // Validate inputs
        if (!height || !weight || height < 50 || height > 300 || weight < 10 || weight > 500) {
            alert('Please enter valid height (50-300 cm) and weight (10-500 kg) values.');
            return;
        }
        
        // Calculate BMI
        const bmi = calculateBMI(weight, height);
        const result = getBMICategory(bmi);
        
        // Store data for results page
        const bmiData = {
            height: height,
            weight: weight,
            age: age,
            gender: gender
        };
        
        sessionStorage.setItem('bmiData', JSON.stringify(bmiData));
        sessionStorage.setItem('bmiResult', JSON.stringify(result));
        
        // Redirect to results page
        window.location.href = 'result.html';
    });
    
    // Input validation
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const min = parseFloat(this.min);
            const max = parseFloat(this.max);
            
            if (value < min || value > max) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#e5e7eb';
            }
        });
    });
});

// BMI calculation function
function calculateBMI(weight, height) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

// BMI category determination
function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return {
            bmi: bmi,
            category: 'Underweight',
            status: 'Below Normal Range',
            color: 'blue',
            bgColor: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
            textColor: '#1e40af'
        };
    } else if (bmi >= 18.5 && bmi < 25) {
        return {
            bmi: bmi,
            category: 'Normal Weight',
            status: 'Healthy Range',
            color: 'green',
            bgColor: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
            textColor: '#166534'
        };
    } else if (bmi >= 25 && bmi < 30) {
        return {
            bmi: bmi,
            category: 'Overweight',
            status: 'Above Normal Range',
            color: 'yellow',
            bgColor: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
            textColor: '#92400e'
        };
    } else {
        return {
            bmi: bmi,
            category: 'Obese',
            status: 'High Risk Range',
            color: 'red',
            bgColor: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            textColor: '#991b1b'
        };
    }
}

// Floating label animation
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.floating-input input');
    
    inputs.forEach(input => {
        // Set initial state
        if (input.value) {
            input.classList.add('has-content');
        }
        
        input.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.classList.remove('focused');
            if (this.value) {
                this.classList.add('has-content');
            } else {
                this.classList.remove('has-content');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-content');
            } else {
                this.classList.remove('has-content');
            }
        });
    });
});
