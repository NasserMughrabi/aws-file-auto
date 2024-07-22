import argparse
import boto3

def update_dynamodb(file_id, output_path):
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('FilesTable')
    table.update_item(
        Key={'id': file_id},
        UpdateExpression='SET s3_output_file_path = :val1',
        ExpressionAttributeValues={':val1': output_path}
    )

def main(text_input, input_file, output_file, file_id):
    # Read input file
    with open(input_file, 'r') as f:
        content = f.read()

    # Get the length of input text
    text_length = len(text_input)

    # Create the output content
    output_content = f"{content} : {text_length}"

    # Write to the output file
    with open(output_file, 'w') as f:
        f.write(output_content)

    # Upload the output file to S3
    s3 = boto3.client('s3')
    bucket_name = 'fovus-cdk-bucket258'
    s3_output_path = f'output/{file_id}.output'
    s3.upload_file(output_file, bucket_name, s3_output_path)

    # Update DynamoDB
    update_dynamodb(file_id, f's3://{bucket_name}/{s3_output_path}')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process input file.')
    parser.add_argument('--text_input', required=True, help='Text input string')
    parser.add_argument('--input_file', required=True, help='Path to input file')
    parser.add_argument('--output_file', required=True, help='Path to output file')
    parser.add_argument('--dynamo_id', required=True, help='DynamoDB item ID')
    
    args = parser.parse_args()
    
    main(args.text_input, args.input_file, args.output_file, args.dynamo_id)
