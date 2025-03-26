#!/bin/bash

DEBUG=true
curl -sL https://firebase.tools | bash



export $(grep -v '^#' C:/Users/ICTD/Desktop/Speedtest/.env | xargs -0)

API_URL= $TEST


if [ "$DEBUG" = true ]; then
    echo "Debug mode is on"
    echo "Sending dummy data to $API_URL"
    dummy_data=$(cat "C:\Users\ICTD\Desktop\Speedtest\dummy.json")
    echo "$dummy_data" | curl -X POST -H "Content-Type: application/json" -d @- "$API_URL"
else
    echo "Running speed test on $(date '+%I:%M:%S %p')"
    echo "Convert into JSON format"
    echo "Sending json data to $API_URL"
    speedtest --format=json-pretty | curl -X POST -H "Content-Type: application/json" -d @- "$API_URL"
fi

