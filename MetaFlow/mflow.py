from metaflow import FlowSpec, step, Parameter
from pymongo import MongoClient
import logging

class MongoDBExtractorFlow(FlowSpec):

    
    mongo_username = Parameter('systemDesign', help="Username for MongoDB authentication")
    mongo_password = Parameter('rAK3kq1gRpJDiZG7', help="Password for MongoDB authentication")
    mongo_host = Parameter('cluster0.gra679a.mongodb.net', help="Host for MongoDB server")
    mongo_port = Parameter('27017', default=27017, help="Port for MongoDB server")
    mongo_database = Parameter('systemDesignDatabase', help="Name of the MongoDB database")
    mongo_collection = Parameter('cartorders', help="Name of the MongoDB collection")
    source_collection = Parameter('source_collection', help="Name of the source MongoDB collection")
    destination_collection = Parameter('destination_collection', help="Name of the destination MongoDB collection")
    limit = Parameter('limit', default=None, help="Limit the number of documents to fetch from the source collection")

    @step
    def start(self):

        self.client = MongoClient(
            host=self.mongo_host,
            port=self.mongo_port,
            username=self.mongo_username,
            password=self.mongo_password,
            authSource=self.mongo_database
        )
        self.db = self.client[self.mongo_database]
        self.collection = self.db[self.mongo_collection]
        self.source = self.db[self.source_collection]
        self.destination = self.db[self.destination_collection]
        self.next(self.extract_data)

        
    @step
    def extract_data(self):
        try:
            if self.limit:
                self.data = list(self.source.find().limit(self.limit))
            else:
                self.data = list(self.source.find())
            self.next(self.import_data)
        except Exception as e:
            logging.error(f"Error while extracting data: {str(e)}")
            self.fail(f"Error while extracting data: {str(e)}")
        
    @step
    def import_data(self):
        try:
            self.destination.insert_many(self.data)
            print("Data imported successfully.")
            self.next(self.end)
        except Exception as e:
            logging.error(f"Error while importing data: {str(e)}")
            self.fail(f"Error while importing data: {str(e)}")

    @step
    def end(self):
        print("Extracted Data:")
        for item in self.data:
            print(item)
        self.client.close()

if __name__ == '__main__':
    MongoDBExtractorFlow()


