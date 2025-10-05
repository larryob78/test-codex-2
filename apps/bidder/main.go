package main

import (
"math"
"net/http"
"time"

"github.com/gin-gonic/gin"
)

type BidRequest struct {
ID   string `json:"id"`
Imp  []Impression `json:"imp"`
User *User        `json:"user"`
}

type Impression struct {
ID string `json:"id"`
}

type User struct {
ID      string `json:"id"`
Consent bool   `json:"consent"`
}

type BidResponse struct {
ID     string     `json:"id"`
SeatBid []SeatBid `json:"seatbid"`
Cur    string     `json:"cur"`
}

type SeatBid struct {
Bid []Bid `json:"bid"`
}

type Bid struct {
ID    string  `json:"id"`
ImpID string  `json:"impid"`
Price float64 `json:"price"`
Adm   string  `json:"adm"`
CrID  string  `json:"crid"`
NURL  string  `json:"nurl"`
}

func logistic(x float64) float64 {
return 1.0 / (1.0 + math.Exp(-x))
}

func score(user *User) float64 {
if user == nil || !user.Consent {
return 0.1
}
return logistic(0.5)
}

func main() {
r := gin.Default()

r.GET("/healthz", func(ctx *gin.Context) {
ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
})

r.POST("/openrtb/bidrequest", func(ctx *gin.Context) {
var req BidRequest
if err := ctx.BindJSON(&req); err != nil {
ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
return
}

if len(req.Imp) == 0 {
ctx.JSON(http.StatusBadRequest, gin.H{"error": "no impressions"})
return
}

prob := score(req.User)
bidPrice := 1.2 * prob
if bidPrice < 0.1 {
ctx.JSON(http.StatusNoContent, gin.H{})
return
}

resp := BidResponse{
ID: req.ID,
Cur: "USD",
SeatBid: []SeatBid{
{
Bid: []Bid{
{
ID:    "bid-" + time.Now().Format("150405"),
ImpID: req.Imp[0].ID,
Price: bidPrice,
Adm:   "<a href='https://example.com'>Buy now</a>",
CrID:  "crt-demo",
NURL:  "http://redpanda:8082/win",
},
},
},
},
}

ctx.JSON(http.StatusOK, resp)
})

r.Run(":8080")
}
