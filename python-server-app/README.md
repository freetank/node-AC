# Python Server Application

This project is a simple Flask server application that listens for POST requests on the `/generate-layout` endpoint. It is designed to generate layouts based on the provided data.

## Project Structure

```
python-server-app
├── src
│   ├── main.py               # Entry point of the application
│   └── routes
│       └── generate_layout.py # Logic for handling /generate-layout requests
├── requirements.txt          # Project dependencies
└── README.md                 # Project documentation
```

## Requirements

To run this application, you need to have Python installed along with the required packages. You can install the necessary packages using the following command:

```
pip install -r requirements.txt
```

## Running the Server

To start the server, navigate to the `src` directory and run the `main.py` file:

```
python main.py
```

The server will start and listen on `localhost:9500`.

## Endpoint

### POST /generate-layout

This endpoint accepts POST requests with a JSON payload. The server processes the incoming data to generate a layout.

### Example Request

```json
{
  "slabPoly": [[0, 0], [1, 1], [2, 2]],
  "namePrefix": "Zone "
}
```

### Response

The server will respond with a JSON object containing the generated layout data.

## License

This project is licensed under the MIT License.