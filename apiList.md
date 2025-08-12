# DevTinder API's

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- status: ignore, interested
- POST /request/send/:status/:userId

- status: accepted, rejected
- POST /request/review/:status/:requestId


## userRouter
- GET /user/connections
- GET /user/requests
- GET /feed - get you the profiles of other users on platform

status: ignore, interested, accepted, rejected