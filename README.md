File Data Analysis and Masking Application
This application allows users to upload multiple large files and perform basic data analysis and masking on them. It provides an elegant user interface for performing the following tasks:

File Upload: Users can upload multiple large files.

Analytics View: For each uploaded file, the application presents an analytics view that includes:
1. File name
2. File size
3. List of unique words in the file along with their counts

Word and Synonym Count: Users can find the count of specific words and their synonyms present in the file using the api-ninjas thesaurus api.

Masking Words: Users can specify a set of words to be masked in the file, and the application streams back the updated file with the specified words masked.

Features
User-friendly interface for easy file upload and analysis.
Real-time analytics for better insights into file contents.
Seamless integration with the api-ninja's thersaurus API for finding synonyms.
Efficient masking functionality to protect sensitive information in files.


Getting Started
Follow these steps to set up the project locally:

Clone the repository to your local machine:

git clone <repository-url>
Navigate to the project directory:

cd FileAnalysis_frontend
Install dependencies:

npm install (use node 14.19.1)


How to start the server :- PORT=4000 npm start



FLOW DIAGRAM :- 

                  Start
                    |
            Upload Files UI
                    |
          +---------+----------+
          |                    |
     Fetch Pre-signed URL    Upload Files
          |                    |
          |               Upload Complete
          |                    |
    Store File Metadata       |
          |                    |
         End                  |
                               |
          +---------+----------+
          |                    |
    File Analysis UI          |
          |                    |
    Count Unique Words -------|
    and Their Counts          |
          |                    |
    Find Synonyms             |
    for Specific Words -------|
          |                    |
    Mask Specific Words ------|
          |                    |
         End                  |

How to build and deploy docker file :-
Build :- docker build -t fileanalysis_ui .
Run :- docker run -p 4000:4000 -e REACT_APP_ENV=development fileanalysis_ui






