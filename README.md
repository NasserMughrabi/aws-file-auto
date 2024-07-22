# AWS Automated File Processing System

The AWS Automated File Processing System is a cloud-based solution designed to to provide a fully automated system for processing and storing user-submitted data (text and files). By utilizing AWS services such as S3, API Gateway, Lambda, DynamoDB, and EC2, this system minimizes manual intervention, optimizes resource usage, and ensures efficient data handling and processing. It also automates resource provisioning and cleanup tasks, ensuring high performance and reliability.


## How it works

1. Through React UI, the user inputs text, uploads a text file, and clicks submit.
2. At submit, the system does the following:
    1. Uploads the text file to the S3 bucket provisioned on AWS
    2. Sends the text input along with the path to the uploaded file in the S3 bucket to DynamoDB through a REST API built using API Gateway and Lambda. DynamoDb table would look as follows: text_input: text, s3_input_file_path: s3://bucket-name/input/filename
    3. DynamoDb streams will be listening to table inserts. At new insert, DynamoDB streams will trigger a lambda function to launch a new EC2 instance which will do the following
        1. Copies the input file from the S3 bucket using its path from DynamoDB (s3_input_file_path)
        2. Copies a script.py file that I manually uploaded to S3. This script has the functionality that we want EC2 to run
        3. Runs the script.py file which will do the following
            1. read the input file
            2. calculate the length of the text_input
            3. append the length of the text_input to the content of the input file and save in a new file (fileId.output)
            4. uploads the output file to S3 and store its path in the DynamoDB table to look like this: update item: text_input: text, s3_input_file_path: s3://bucket-name/input/filename, s3_output_file_path: s3://bucket-name/output/filename
            5. EC2 will terminate itself after the above tasks have complteted

## How It Works

1. **User Interaction**:
   - Users interact with the ReactJS web interface to input text and upload a file. After completing these actions, they click the submit button.

2. **Submission Process**:
   - **File Upload**: The system uploads the user’s file to an S3 bucket on AWS.
   - **Metadata Storage**: The text input and the S3 file path are sent to DynamoDB through a REST API built with API Gateway and Lambda. The DynamoDB table records the following:
     - `text_input`: The user’s submitted text
     - `s3_input_file_path`: The S3 path of the uploaded file, formatted as `s3://bucket-name/input/filename`

3. **Automated Processing**:
   - **Triggering EC2**: DynamoDB Streams monitor for new entries in the table. When a new entry is detected, a Lambda function triggers the creation of an EC2 instance.
   - **EC2 Processing Tasks**:
     1. **File Retrieval**: The EC2 instance downloads the input file from S3 using the path provided in DynamoDB (`s3_input_file_path`).
     2. **Script Download**: The EC2 instance retrieves a `script.py` file from S3. This script contains the necessary processing logic.
     3. **Script Execution**:
        - **Read Input File**: The script reads the input file.
        - **Calculate Text Length**: It calculates the length of the submitted text.
        - **Update File**: The script appends the length of the text to the content of the input file and saves it as a new file (`fileId.output`).
        - **Upload Output**: The new file is uploaded to S3, and its path is updated in DynamoDB to include:
          - `s3_output_file_path`: The S3 path of the processed file, formatted as `s3://bucket-name/output/filename`
        - **Terminate EC2**: The EC2 instance automatically terminates itself after completing these tasks.


## Features

- **User-Friendly Web Interface**: Developed with ReactJS, allowing users to input text and upload files easily.
- **Direct File Uploads**: Files are uploaded directly to Amazon S3, providing scalable and durable storage.
- **Automated Metadata Storage**: Stores metadata related to uploads and processing results in DynamoDB.
- **Dynamic Processing**: Utilizes EC2 instances for processing files automatically.
- **Scalable Resource Management**: Automatically provisions and terminates EC2 instances based on processing needs.
- **Efficient Data Handling**: Saves processed data back to S3 and updates metadata in DynamoDB.

## Architecture

1. **Frontend (ReactJS Web UI)**
   - **Text Input**: For users to submit text.
   - **File Input**: For users to upload files.
   - **Submit Button**: Initiates the processing workflow.

2. **File Storage**
   - Files are uploaded to an S3 bucket at the path `[BucketName]/[InputFile].Input`.

3. **Metadata Storage**
   - DynamoDB table schema includes:
     - `Id`: Auto-generated ID via nanoid
     - `Input_text`: User-submitted text
     - `Input_file_path`: S3 path of the uploaded file
     - `Output_file_path`: S3 path of the processed output file (updated post-processing)

4. **Automated Processing**
   - A DynamoDB event triggers the creation of an EC2 instance.
   - A processing script is downloaded from S3 to the EC2 instance.
   - The script processes the input file and text, and the results are saved to S3.

5. **Resource Management**
   - EC2 instances are automatically terminated after processing.

## Technologies Used

- **Frontend**: ReactJS
- **Storage**: Amazon S3
- **Database**: Amazon DynamoDB
- **Compute**: Amazon EC2
- **Serverless**: AWS Lambda
- **API Management**: AWS API Gateway
<!-- - **Infrastructure as Code**: AWS CDK (or programmatic approach for uploading scripts to S3) -->

## Usage

1. Open the web application at [awsfileauto.netlify.app](https://awsfileauto.netlify.app/) in your browser.
2. Enter text into the text input field.
3. Select and upload a file using the file input field.
4. Click the submit button to initiate the processing.
5. The file will be uploaded to S3, metadata will be stored in DynamoDB, and processing will be triggered automatically.
6. Processed files will be available in S3, and metadata will be updated in DynamoDB.

