package mitigation

func TakeAction(totalScore int) string {
	// Example logic for mitigation based on risk score
	if totalScore >= 30 {
		return "Block access and notify admin"
	} else if totalScore >= 20 {
		return "Notify admin for manual review"
	}
	return "Log incident for future review"
}
