package models

type Log struct {
	Timestamp string                 `json:"timestamp"`
	UserID    string                 `json:"user_id"`
	Action    string                 `json:"action"`
	Details   map[string]interface{} `json:"details"`
}
