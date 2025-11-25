"""
Example: DynamoDB Operations

This example demonstrates basic DynamoDB operations using the AWS Practice utilities.
Make sure you have AWS credentials configured before running.
"""

from src.dynamodb_utils import (
    list_tables,
    create_table,
    put_item,
    get_item,
    scan_table,
    delete_item
)


def main():
    """Demonstrate DynamoDB operations."""
    print("=== DynamoDB Practice Examples ===\n")
    
    # List existing tables
    print("1. Listing all DynamoDB tables:")
    tables = list_tables()
    for table in tables:
        print(f"   - {table}")
    
    if not tables:
        print("   No tables found (or no AWS credentials configured)")
    
    print("\n" + "=" * 40)
    print("Example: Creating a table")
    print("""
    # Define key schema and attributes
    key_schema = [
        {'AttributeName': 'user_id', 'KeyType': 'HASH'},
        {'AttributeName': 'timestamp', 'KeyType': 'RANGE'}
    ]
    
    attribute_definitions = [
        {'AttributeName': 'user_id', 'AttributeType': 'S'},
        {'AttributeName': 'timestamp', 'AttributeType': 'N'}
    ]
    
    # Create the table
    create_table('MyPracticeTable', key_schema, attribute_definitions)
    """)
    
    print("=" * 40)
    print("Note: Ensure you have valid AWS credentials configured.")


if __name__ == "__main__":
    main()
