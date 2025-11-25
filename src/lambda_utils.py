"""
AWS Lambda Practice Utilities

This module provides utility functions for practicing with AWS Lambda service.
"""

import json
import boto3
from botocore.exceptions import ClientError


def create_lambda_client(region_name="us-east-1"):
    """Create and return a Lambda client."""
    return boto3.client("lambda", region_name=region_name)


def list_functions(lambda_client=None):
    """List all Lambda functions in the account."""
    if lambda_client is None:
        lambda_client = create_lambda_client()
    
    try:
        response = lambda_client.list_functions()
        return response.get("Functions", [])
    except ClientError as e:
        print(f"Error listing functions: {e}")
        return []


def invoke_function(function_name, payload=None, lambda_client=None):
    """Invoke a Lambda function."""
    if lambda_client is None:
        lambda_client = create_lambda_client()
    
    try:
        invoke_params = {
            "FunctionName": function_name,
            "InvocationType": "RequestResponse"
        }
        
        if payload is not None:
            invoke_params["Payload"] = json.dumps(payload)
        
        response = lambda_client.invoke(**invoke_params)
        
        payload_stream = response.get("Payload")
        if payload_stream:
            payload_data = payload_stream.read()
            if payload_data:
                return json.loads(payload_data)
        return None
    except ClientError as e:
        print(f"Error invoking function: {e}")
        return None


def get_function(function_name, lambda_client=None):
    """Get details about a Lambda function."""
    if lambda_client is None:
        lambda_client = create_lambda_client()
    
    try:
        response = lambda_client.get_function(FunctionName=function_name)
        return response
    except ClientError as e:
        print(f"Error getting function: {e}")
        return None
