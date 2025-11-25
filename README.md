# AWS Practice Application

A Python-based application for practicing and learning AWS services.

## Overview

This project provides utility modules and examples for working with common AWS services:

- **S3**: Object storage operations (upload, download, list, delete)
- **DynamoDB**: NoSQL database operations (CRUD, table management)
- **Lambda**: Serverless function operations (invoke, list, get details)

## Prerequisites

- Python 3.8 or higher
- AWS account with appropriate permissions
- AWS credentials configured (via AWS CLI, environment variables, or credentials file)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bsanjuu/AWSPractice.git
   cd AWSPractice
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

Configure your AWS credentials using one of these methods:

### Option 1: AWS CLI
```bash
aws configure
```

### Option 2: Environment Variables
```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-east-1
```

### Option 3: Credentials File
Create `~/.aws/credentials`:
```ini
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

## Usage

### S3 Operations
```python
from src.s3_utils import list_buckets, create_bucket, upload_file

# List all buckets
buckets = list_buckets()

# Create a new bucket
create_bucket("my-practice-bucket", region="us-east-1")

# Upload a file
upload_file("local_file.txt", "my-practice-bucket", "remote_file.txt")
```

### DynamoDB Operations
```python
from src.dynamodb_utils import list_tables, put_item, get_item

# List all tables
tables = list_tables()

# Put an item
put_item("MyTable", {"user_id": "123", "name": "John"})

# Get an item
item = get_item("MyTable", {"user_id": "123"})
```

### Lambda Operations
```python
from src.lambda_utils import list_functions, invoke_function

# List all functions
functions = list_functions()

# Invoke a function
result = invoke_function("my-function", {"key": "value"})
```

## Examples

Run the example scripts to see the utilities in action:

```bash
python examples/s3_example.py
python examples/dynamodb_example.py
```

## Project Structure

```
AWSPractice/
├── README.md
├── requirements.txt
├── src/
│   ├── __init__.py
│   ├── s3_utils.py
│   ├── dynamodb_utils.py
│   └── lambda_utils.py
└── examples/
    ├── s3_example.py
    └── dynamodb_example.py
```

## License

This project is for educational purposes.