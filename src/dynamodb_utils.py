"""
AWS DynamoDB Practice Utilities

This module provides utility functions for practicing with AWS DynamoDB service.
"""

import boto3
from botocore.exceptions import ClientError


def create_dynamodb_client(region_name="us-east-1"):
    """Create and return a DynamoDB client."""
    return boto3.client("dynamodb", region_name=region_name)


def create_dynamodb_resource(region_name="us-east-1"):
    """Create and return a DynamoDB resource."""
    return boto3.resource("dynamodb", region_name=region_name)


def list_tables(dynamodb_client=None):
    """List all DynamoDB tables in the account."""
    if dynamodb_client is None:
        dynamodb_client = create_dynamodb_client()
    
    try:
        response = dynamodb_client.list_tables()
        return response.get("TableNames", [])
    except ClientError as e:
        print(f"Error listing tables: {e}")
        return []


def create_table(table_name, key_schema, attribute_definitions, 
                 billing_mode="PAY_PER_REQUEST", dynamodb_client=None):
    """Create a DynamoDB table."""
    if dynamodb_client is None:
        dynamodb_client = create_dynamodb_client()
    
    try:
        response = dynamodb_client.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            BillingMode=billing_mode
        )
        return response
    except ClientError as e:
        print(f"Error creating table: {e}")
        return None


def put_item(table_name, item, dynamodb_resource=None):
    """Put an item into a DynamoDB table."""
    if dynamodb_resource is None:
        dynamodb_resource = create_dynamodb_resource()
    
    try:
        table = dynamodb_resource.Table(table_name)
        response = table.put_item(Item=item)
        return response
    except ClientError as e:
        print(f"Error putting item: {e}")
        return None


def get_item(table_name, key, dynamodb_resource=None):
    """Get an item from a DynamoDB table."""
    if dynamodb_resource is None:
        dynamodb_resource = create_dynamodb_resource()
    
    try:
        table = dynamodb_resource.Table(table_name)
        response = table.get_item(Key=key)
        return response.get("Item")
    except ClientError as e:
        print(f"Error getting item: {e}")
        return None


def delete_item(table_name, key, dynamodb_resource=None):
    """Delete an item from a DynamoDB table."""
    if dynamodb_resource is None:
        dynamodb_resource = create_dynamodb_resource()
    
    try:
        table = dynamodb_resource.Table(table_name)
        response = table.delete_item(Key=key)
        return response
    except ClientError as e:
        print(f"Error deleting item: {e}")
        return None


def scan_table(table_name, dynamodb_resource=None):
    """
    Scan all items in a DynamoDB table.
    
    Note: This function returns up to 1MB of data. For larger tables,
    pagination with LastEvaluatedKey should be implemented.
    """
    if dynamodb_resource is None:
        dynamodb_resource = create_dynamodb_resource()
    
    try:
        table = dynamodb_resource.Table(table_name)
        response = table.scan()
        return response.get("Items", [])
    except ClientError as e:
        print(f"Error scanning table: {e}")
        return []
