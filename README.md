[![Build Status](https://travis-ci.com/abayo-luc/SendIT.svg?branch=develop)](https://travis-ci.com/abayo-luc/SendIT)
[![Coverage Status](https://coveralls.io/repos/github/abayo-luc/SendIT/badge.svg?branch=develop)](https://coveralls.io/github/abayo-luc/SendIT?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/92f5a240786168af92b0/maintainability)](https://codeclimate.com/github/abayo-luc/SendIT/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/92f5a240786168af92b0/test_coverage)](https://codeclimate.com/github/abayo-luc/SendIT/test_coverage)
# SendIT-API
A [Social platform](https://send-it-api.herokuapp.com/api/v1/) for sending Parcels in any location
## Get Started
Installing dependencies => `npm install`

Starting development server => `npm start`

Run the tests => `npm run test`

## API -Endpoints
 JSON object is expected to returned by each API end point, and their structure is below:

##Parcels
`GET /parcels`
```source-json
{
    "msg": "all parcels",
    "parcels": [
        {
            "id": 1,
            "pickupLocation": "Kigali",
            "destination": "Kigeme",
            "weight": 5,
            "quantity": 8,
            "userId": 1,
            "status": "in_transity",
            "createdAt": "2018-11-09T15:44:41.918Z"
        }
    ]
}
```

`GET /parcels/<parcelId>`
```source-json
{
    "msg": "parcel found",
    "parcel": {
        "id": 1,
        "pickupLocation": "Kigali",
        "destination": "Kigeme",
        "weight": 5,
        "quantity": 8,
        "userId": 1,
        "status": "canceled",
        "createdAt": "2018-11-09T15:44:41.918Z"
    }
}
```


`GET /users/<userId>/parcels`

`NB:` Currently, to test this endpoint user 1 as userId

```source-json
{
    "msg": "user pracles",
    "parcels": [
        {
            "id": 1,
            "pickupLocation": "Kigali",
            "destination": "Kigeme",
            "weight": 5,
            "quantity": 8,
            "userId": 1,
            "status": "canceled",
            "createdAt": "2018-11-09T15:44:41.918Z"
        }
    ]
}
```


`PUT /parcels/<parcelId>/cancel`
```source-json
{
    "msg": "Parcel order canceled",
    "parcel": {
        "id": 1,
        "pickupLocation": "Kigali",
        "destination": "Kigeme",
        "weight": 5,
        "quantity": 8,
        "userId": 1,
        "status": "canceled",
        "createdAt": "2018-11-09T15:44:41.918Z"
    }
}
```


`POST /parcels`

required params are: pickupLocation, destination, weight, quantity.

```{
    "msg": "Parcel created",
    "parcel": {
        "id": 1,
        "pickupLocation": "Kigali",
        "destination": "Kigeme",
        "weight": 5,
        "quantity": 8,
        "userId": 1,
        "status": "in_transity",
        "createdAt": "2018-11-09T15:44:41.918Z"
    }
}
```

