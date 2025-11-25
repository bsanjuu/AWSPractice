"""
Example: S3 Operations

This example demonstrates basic S3 operations using the AWS Practice utilities.
Make sure you have AWS credentials configured before running.
"""

from src.s3_utils import (
    list_buckets,
    create_bucket,
    upload_file,
    list_objects,
    download_file,
    delete_object
)


def main():
    """Demonstrate S3 operations."""
    print("=== S3 Practice Examples ===\n")
    
    # List existing buckets
    print("1. Listing all S3 buckets:")
    buckets = list_buckets()
    for bucket in buckets:
        print(f"   - {bucket['Name']}")
    
    if not buckets:
        print("   No buckets found (or no AWS credentials configured)")
    
    print("\n" + "=" * 40)
    print("Note: To create, upload, and manage buckets,")
    print("ensure you have valid AWS credentials configured.")
    print("You can configure credentials using:")
    print("  - AWS CLI: aws configure")
    print("  - Environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY")
    print("  - AWS credentials file: ~/.aws/credentials")


if __name__ == "__main__":
    main()
