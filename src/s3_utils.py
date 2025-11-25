"""
AWS S3 Practice Utilities

This module provides utility functions for practicing with AWS S3 service.
"""

import os
import boto3
from botocore.exceptions import ClientError


def create_s3_client(region="us-east-1"):
    """Create and return an S3 client."""
    return boto3.client("s3", region_name=region)


def list_buckets(s3_client=None):
    """List all S3 buckets in the account."""
    if s3_client is None:
        s3_client = create_s3_client()
    
    try:
        response = s3_client.list_buckets()
        return response.get("Buckets", [])
    except ClientError as e:
        print(f"Error listing buckets: {e}")
        return []


def create_bucket(bucket_name, region="us-east-1", s3_client=None):
    """Create an S3 bucket."""
    if s3_client is None:
        s3_client = create_s3_client(region)
    
    try:
        if region == "us-east-1":
            s3_client.create_bucket(Bucket=bucket_name)
        else:
            s3_client.create_bucket(
                Bucket=bucket_name,
                CreateBucketConfiguration={"LocationConstraint": region}
            )
        return True
    except ClientError as e:
        print(f"Error creating bucket: {e}")
        return False


def upload_file(file_path, bucket_name, object_name=None, s3_client=None):
    """Upload a file to an S3 bucket."""
    if s3_client is None:
        s3_client = create_s3_client()
    
    if object_name is None:
        object_name = os.path.basename(file_path)
    
    try:
        s3_client.upload_file(file_path, bucket_name, object_name)
        return True
    except ClientError as e:
        print(f"Error uploading file: {e}")
        return False


def download_file(bucket_name, object_name, file_path, s3_client=None):
    """Download a file from an S3 bucket."""
    if s3_client is None:
        s3_client = create_s3_client()
    
    try:
        s3_client.download_file(bucket_name, object_name, file_path)
        return True
    except ClientError as e:
        print(f"Error downloading file: {e}")
        return False


def list_objects(bucket_name, prefix="", s3_client=None):
    """List objects in an S3 bucket."""
    if s3_client is None:
        s3_client = create_s3_client()
    
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        return response.get("Contents", [])
    except ClientError as e:
        print(f"Error listing objects: {e}")
        return []


def delete_object(bucket_name, object_name, s3_client=None):
    """Delete an object from an S3 bucket."""
    if s3_client is None:
        s3_client = create_s3_client()
    
    try:
        s3_client.delete_object(Bucket=bucket_name, Key=object_name)
        return True
    except ClientError as e:
        print(f"Error deleting object: {e}")
        return False
