import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import AWS from "aws-sdk";

function App() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState("File content");

  // Configure AWS credentials (Make sure to replace with your own credentials)
  AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  });

  const s3 = new AWS.S3();

  const uploadFileToS3 = async (file) => {
    console.log(process.env.REACT_APP_S3_BUCKET_NAME);
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };

    try {
      await s3.upload(params).promise();
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err;
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
      };
      reader.readAsText(selectedFile);
    } else {
      setFileContent("No file chosen");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        await uploadFileToS3(file);
        alert("File uploaded successfully!");
      } catch (err) {
        console.error("Error uploading file:", err);
        alert("Error uploading file: " + err.message);
      }
    }
  };

  return (
    <Box textAlign="center" fontSize="xl">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bg="black"
        color="white"
        p={4}
      >
        <form onSubmit={handleSubmit}>
          <FormControl id="text-input" mb={4}>
            <FormLabel>Text Input:</FormLabel>
            <Input
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter input"
              size="lg"
            />
          </FormControl>
          <FormControl id="file-input" mb={4}>
            <FormLabel>File input:</FormLabel>
            <Input
              type="file"
              onChange={handleFileChange}
              size="sm"
              border="none"
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" size="lg">
            Submit
          </Button>
        </form>
        <Text mt={4} fontSize="lg">
          [InputFile].input content: {fileContent}
        </Text>
      </Box>
    </Box>
  );
}

export default App;
