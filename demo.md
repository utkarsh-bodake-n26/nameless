1. Create transaction by curl

	`https://tsazuw1oo7.execute-api.eu-central-1.amazonaws.com/live/transactions`

	```
	{
	"userId": "ABwppHEEtk-BzoM1tb3zb5IOKGk1xLeoQIFpBr0vrrxZgrLhpK-1bj1IOrIgzZTjZJ9AoKDZ_yHTvKZjEj0",
	"space": "home",
	"txnTag": "deposit",
	"amount": 100
	}
	```
	- Create TX (save to db & push to sqs works)	

2. Move money between spaces works
	- `Move 10 euro from main to saving`

3. Create Rule
	`send 50% of my this month salary to my saving space`

