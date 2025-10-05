package main

import "testing"

func TestLogistic(t *testing.T) {
if logistic(0) != 0.5 {
t.Fatalf("expected 0.5")
}
}

func TestScoreConsent(t *testing.T) {
prob := score(&User{Consent: true})
if prob <= 0.1 {
t.Fatalf("expected higher probability")
}
}
