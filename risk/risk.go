package risk

type RiskScore struct {
	Damage          int `json:"damage"`
	Reproducibility int `json:"reproducibility"`
	Exploitability  int `json:"exploitability"`
	AffectedUsers   int `json:"affected_users"`
	Discoverability int `json:"discoverability"`
	TotalScore      int `json:"total_score"`
}

func AssessRisk(anomaly map[string]interface{}) RiskScore {
	// Placeholder DREAD scoring logic
	risk := RiskScore{
		Damage:          7,
		Reproducibility: 8,
		Exploitability:  9,
		AffectedUsers:   5,
		Discoverability: 6,
	}
	risk.TotalScore = risk.Damage + risk.Reproducibility + risk.Exploitability + risk.AffectedUsers + risk.Discoverability
	return risk
}
