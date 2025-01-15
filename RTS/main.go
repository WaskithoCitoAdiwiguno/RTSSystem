package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"RTSSystem/detection"
	"RTSSystem/mitigation"
	"RTSSystem/risk"

	"github.com/rs/cors" // Import library CORS
)

type LogRequest struct {
	Logs string `json:"logs"`
}

type AnalysisResult struct {
	RiskLevel string `json:"risk_level"`
	Message   string `json:"message"`
}

func detectHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	var logRequest LogRequest
	err := json.NewDecoder(r.Body).Decode(&logRequest)
	if err != nil {
		http.Error(w, "Failed to parse request", http.StatusBadRequest)
		return
	}

	// Contoh analisis sederhana
	result := AnalysisResult{
		RiskLevel: "High",
		Message:   fmt.Sprintf("Log analysis completed. Input: %s", logRequest.Logs),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func handleDetection(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	var logs []map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&logs)
	if err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	// Step 1: Detect anomalies
	anomalies := detection.DetectAnomalies(logs)

	// Step 2: Assess risks
	var responses []map[string]interface{}
	for _, anomaly := range anomalies {
		riskScore := risk.AssessRisk(anomaly)
		action := mitigation.TakeAction(riskScore.TotalScore)
		response := map[string]interface{}{
			"anomaly": anomaly,
			"risk":    riskScore,
			"action":  action,
		}
		responses = append(responses, response)
	}

	// Return the response as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(responses)

	
}

func main() {
	// Create a new HTTP mux
	mux := http.NewServeMux()

	// Add routes
	mux.HandleFunc("/detect", handleDetection)
	mux.Handle("/", http.FileServer(http.Dir("./static")))

	// Wrap mux with CORS middleware
	corsHandler := cors.AllowAll().Handler(mux)

	// Start the server
	fmt.Println("Server running on http://localhost:8080")
	http.ListenAndServe(":8080", corsHandler)

	
}

