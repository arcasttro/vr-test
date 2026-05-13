# BDD for VRPAT
Feature: Exam - Backend part. 1

    Scenario: Check if the typeOfEstablishment key exists
        Given that I made a GET request to the VRPAT endpoint
        Then so the response must have a typeOfEstablishment key
        And a random establishment type is printed
