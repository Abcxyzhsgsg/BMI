package com.example;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class BMIServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Enable CORS
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        PrintWriter out = response.getWriter();

        try {
            // Get parameters from request
            double height = Double.parseDouble(request.getParameter("height"));
            double weight = Double.parseDouble(request.getParameter("weight"));
            String ageParam = request.getParameter("age");
            String gender = request.getParameter("gender");

            Integer age = null;
            if (ageParam != null && !ageParam.isEmpty()) {
                age = Integer.parseInt(ageParam);
            }

            // Validate inputs
            if (height < 50 || height > 300 || weight < 10 || weight > 500) {
                out.print("{\"error\":\"Invalid height or weight values\"}");
                return;
            }

            // Calculate BMI
            double bmi = calculateBMI(weight, height);
            BMIResult result = getBMICategory(bmi);

            // Create BMI data object
            BMIData bmiData = new BMIData();
            bmiData.height = height;
            bmiData.weight = weight;
            bmiData.age = age;
            bmiData.gender = gender;
            bmiData.bmi = bmi;
            bmiData.category = result.category;
            bmiData.status = result.status;
            bmiData.color = result.color;

            // Store in session
            HttpSession session = request.getSession();
            session.setAttribute("bmiData", bmiData);
            session.setAttribute("bmiResult", result);

            // Generate recommendations
            Recommendations recommendations = generateRecommendations(result, age, gender);
            HealthTip[] healthTips = generateHealthTips(result);
            DietRecommendation[] dietRecommendations = generateDietRecommendations(result);
            ExerciseRecommendation[] exerciseRecommendations = generateExerciseRecommendations(result);

            // Build JSON manually
            StringBuilder responseJson = new StringBuilder();
            responseJson.append("{");
            responseJson.append("\"success\":true,");

            // BMI Data JSON
            responseJson.append("\"bmiData\":{")
                    .append("\"height\":").append(bmiData.height).append(",")
                    .append("\"weight\":").append(bmiData.weight).append(",")
                    .append("\"age\":").append(bmiData.age != null ? bmiData.age : "null").append(",")
                    .append("\"gender\":\"").append(bmiData.gender != null ? bmiData.gender : "").append("\",")
                    .append("\"bmi\":").append(bmiData.bmi).append(",")
                    .append("\"category\":\"").append(bmiData.category).append("\",")
                    .append("\"status\":\"").append(bmiData.status).append("\",")
                    .append("\"color\":\"").append(bmiData.color).append("\"")
                    .append("},");

            // BMI Result JSON
            responseJson.append("\"bmiResult\":{")
                    .append("\"bmi\":").append(result.bmi).append(",")
                    .append("\"category\":\"").append(result.category).append("\",")
                    .append("\"status\":\"").append(result.status).append("\",")
                    .append("\"color\":\"").append(result.color).append("\",")
                    .append("\"bgColor\":\"").append(result.bgColor).append("\",")
                    .append("\"textColor\":\"").append(result.textColor).append("\"")
                    .append("},");

            // Recommendations JSON
            responseJson.append("\"recommendations\":{")
                    .append("\"icon\":\"").append(recommendations.icon).append("\",")
                    .append("\"title\":\"").append(recommendations.title).append("\",")
                    .append("\"items\":[");
            for (int i = 0; i < recommendations.items.length; i++) {
                responseJson.append("\"").append(recommendations.items[i]).append("\"");
                if (i < recommendations.items.length - 1) responseJson.append(",");
            }
            responseJson.append("]},"); // end recommendations

            // Health Tips JSON
            responseJson.append("\"healthTips\":[");
            for (int i = 0; i < healthTips.length; i++) {
                HealthTip tip = healthTips[i];
                responseJson.append("{")
                        .append("\"title\":\"").append(tip.title).append("\",")
                        .append("\"description\":\"").append(tip.description).append("\",")
                        .append("\"image\":\"").append(tip.image).append("\",")
                        .append("\"icon\":\"").append(tip.icon).append("\"")
                        .append("}");
                if (i < healthTips.length - 1) responseJson.append(",");
            }
            responseJson.append("],"); // end healthTips

            // Diet Recommendations JSON
            responseJson.append("\"dietRecommendations\":[");
            for (int i = 0; i < dietRecommendations.length; i++) {
                DietRecommendation d = dietRecommendations[i];
                responseJson.append("{")
                        .append("\"title\":\"").append(d.title).append("\",")
                        .append("\"icon\":\"").append(d.icon).append("\",")
                        .append("\"items\":[");
                for (int j = 0; j < d.items.length; j++) {
                    responseJson.append("\"").append(d.items[j]).append("\"");
                    if (j < d.items.length - 1) responseJson.append(",");
                }
                responseJson.append("]}");
                if (i < dietRecommendations.length - 1) responseJson.append(",");
            }
            responseJson.append("],"); // end dietRecommendations

            // Exercise Recommendations JSON
            responseJson.append("\"exerciseRecommendations\":[");
            for (int i = 0; i < exerciseRecommendations.length; i++) {
                ExerciseRecommendation e = exerciseRecommendations[i];
                responseJson.append("{")
                        .append("\"title\":\"").append(e.title).append("\",")
                        .append("\"icon\":\"").append(e.icon).append("\",")
                        .append("\"items\":[");
                for (int j = 0; j < e.items.length; j++) {
                    responseJson.append("\"").append(e.items[j]).append("\"");
                    if (j < e.items.length - 1) responseJson.append(",");
                }
                responseJson.append("]}");
                if (i < exerciseRecommendations.length - 1) responseJson.append(",");
            }
            responseJson.append("]"); // end exerciseRecommendations

            responseJson.append("}"); // end root

            out.print(responseJson.toString());

        } catch (NumberFormatException e) {
            out.print("{\"error\":\"Invalid input format\"}");
        } catch (Exception e) {
            out.print("{\"error\":\"Server error: " + e.getMessage() + "\"}");
        } finally {
            out.flush();
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Handle CORS preflight
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    // --- BMI Calculation & Categories ---
    private double calculateBMI(double weight, double height) {
        double heightInMeters = height / 100.0;
        return weight / (heightInMeters * heightInMeters);
    }

    private BMIResult getBMICategory(double bmi) {
        BMIResult result = new BMIResult();
        result.bmi = bmi;

        if (bmi < 18.5) {
            result.category = "Underweight";
            result.status = "Below Normal Range";
            result.color = "blue";
            result.bgColor = "linear-gradient(135deg, #dbeafe, #bfdbfe)";
            result.textColor = "#1e40af";
        } else if (bmi >= 18.5 && bmi < 25) {
            result.category = "Normal Weight";
            result.status = "Healthy Range";
            result.color = "green";
            result.bgColor = "linear-gradient(135deg, #dcfce7, #bbf7d0)";
            result.textColor = "#166534";
        } else if (bmi >= 25 && bmi < 30) {
            result.category = "Overweight";
            result.status = "Above Normal Range";
            result.color = "yellow";
            result.bgColor = "linear-gradient(135deg, #fef3c7, #fed7aa)";
            result.textColor = "#92400e";
        } else {
            result.category = "Obese";
            result.status = "High Risk Range";
            result.color = "red";
            result.bgColor = "linear-gradient(135deg, #fee2e2, #fecaca)";
            result.textColor = "#991b1b";
        }

        return result;
    }

    // --- Recommendations ---
    private Recommendations generateRecommendations(BMIResult categoryData, Integer age, String gender) {
        Recommendations recommendations = new Recommendations();

        switch (categoryData.category) {
            case "Underweight":
                recommendations.icon = "fas fa-arrow-up";
                recommendations.title = "Weight Gain Recommendations";
                recommendations.items = new String[]{
                        "Add 300-500 healthy calories daily for gradual weight gain",
                        "Eat 5-6 smaller meals throughout the day instead of 3 large ones",
                        "Include nuts, nut butters, avocados, and olive oil for healthy fats",
                        "Choose protein-rich foods: lean meats, fish, eggs, dairy products",
                        "Exercise: 150 minutes moderate-intensity + 2+ days strength training",
                        "Focus on muscle-building exercises with proper nutrition support"
                };
                break;
            case "Normal Weight":
                recommendations.icon = "fas fa-check-circle";
                recommendations.title = "Healthy Weight Maintenance";
                recommendations.items = new String[]{
                        "Eat 5+ portions of fruits and vegetables daily (≥400g)",
                        "Fill 50% of plate with vegetables/fruits, 25% lean proteins, 25% whole grains",
                        "Limit processed foods and keep free sugars under 10% of total calories",
                        "Stay hydrated with water as your primary beverage",
                        "Exercise: 150-300 minutes moderate OR 75-150 minutes vigorous activity weekly",
                        "Include 2+ days of strength training targeting all major muscle groups"
                };
                break;
            case "Overweight":
                recommendations.icon = "fas fa-arrow-down";
                recommendations.title = "Weight Management Plan";
                recommendations.items = new String[]{
                        "Create 500-750 calorie daily deficit for 1-2 pounds weekly loss",
                        "Increase protein to 0.8-1.5g per kg ideal body weight",
                        "Choose low glycemic index carbohydrates and high-fiber foods",
                        "Consider Mediterranean or DASH diet patterns",
                        "Exercise: 200-300 minutes moderate-intensity weekly for weight maintenance",
                        "Add 2+ days strength training to preserve muscle mass during weight loss"
                };
                break;
            case "Obese":
                recommendations.icon = "fas fa-exclamation-triangle";
                recommendations.title = "Comprehensive Health Improvement";
                recommendations.items = new String[]{
                        "Consult healthcare provider for supervised weight loss program",
                        "Target 5-10% weight loss through structured meal plans",
                        "Consider low-carb (<45% calories) or low-fat (<30% calories) approaches",
                        "Join behavioral programs with 16+ sessions over 6 months",
                        "Exercise: Start with 150+ minutes, progress to 250+ minutes weekly",
                        "Include strength training 2+ days to maintain muscle and metabolic rate"
                };
                break;
            default:
                recommendations = generateRecommendations(getBMICategory(22.0), age, gender);
        }

        return recommendations;
    }

    private HealthTip[] generateHealthTips(BMIResult categoryData) {
        return new HealthTip[]{
                new HealthTip("Smart Food Choices",
                        "Prioritize whole foods over processed options. Include lean proteins, complex carbs, and healthy fats in your meals.",
                        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&h=200",
                        "fas fa-apple-alt"),
                new HealthTip("Exercise Schedule",
                        "Combine cardio (150+ minutes/week) with strength training (2+ days/week) for optimal health benefits.",
                        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=200",
                        "fas fa-dumbbell"),
                new HealthTip("Recovery & Sleep",
                        "Get 7-9 hours of quality sleep nightly to support metabolism, recovery, and weight management.",
                        "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=400&h=200",
                        "fas fa-bed")
        };
    }

    private DietRecommendation[] generateDietRecommendations(BMIResult categoryData) {
        return new DietRecommendation[]{
                new DietRecommendation("Balanced Nutrition", "fas fa-balance-scale",
                        new String[]{"Eat 5+ servings of fruits and vegetables daily", "Choose whole grains", "Include lean proteins"})
        };
    }

    private ExerciseRecommendation[] generateExerciseRecommendations(BMIResult categoryData) {
        return new ExerciseRecommendation[]{
                new ExerciseRecommendation("Cardio Exercise", "fas fa-running",
                        new String[]{"150+ minutes moderate cardio per week", "Include brisk walking", "Try swimming or cycling"})
        };
    }

    // --- Inner Classes ---
    public static class BMIData {
        public double height;
        public double weight;
        public Integer age;
        public String gender;
        public double bmi;
        public String category;
        public String status;
        public String color;
    }

    public static class BMIResult {
        public double bmi;
        public String category;
        public String status;
        public String color;
        public String bgColor;
        public String textColor;
    }

    public static class Recommendations {
        public String icon;
        public String title;
        public String[] items;
    }

    public static class HealthTip {
        public String title;
        public String description;
        public String image;
        public String icon;

        public HealthTip(String title, String description, String image, String icon) {
            this.title = title;
            this.description = description;
            this.image = image;
            this.icon = icon;
        }
    }

    public static class DietRecommendation {
        public String title;
        public String icon;
        public String[] items;

        public DietRecommendation(String title, String icon, String[] items) {
            this.title = title;
            this.icon = icon;
            this.items = items;
        }
    }

    public static class ExerciseRecommendation {
        public String title;
        public String icon;
        public String[] items;

        public ExerciseRecommendation(String title, String icon, String[] items) {
            this.title = title;
            this.icon = icon;
            this.items = items;
        }
    }
}
